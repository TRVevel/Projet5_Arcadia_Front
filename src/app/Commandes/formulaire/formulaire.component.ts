import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of, switchMap } from 'rxjs';
import { RequetesApiService } from '../../services/requetes-api.service';

@Component({
  selector: 'app-formulaire',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})
export class FormulaireComponent implements OnInit {

  formu: string | null = '';
  id: string | null = '';
  quantity: string | null = '';
  customerId: string | null = '';
  name: string | null = '';
  date: string | null = '';
  address: string | null = '';
  productId: string | null = '';
  productName: string | null = '';
  selectedDatetime: string | null = '';
  isCreateFormVisible = false;
  isModifierFormVisible = false;

  createOrderForm: FormGroup;
  editOrderForm: FormGroup;
  createErrorMessage = '';
  createSuccessMessage = '';
  editErrorMessage = '';
  editSuccessMessage = '';

  constructor(private fb: FormBuilder, private apiService: RequetesApiService) {
    // Initialisation des formulaires
    this.createOrderForm = this.fb.group({
      customerId: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    this.editOrderForm = this.fb.group({
      orderId: ['', [Validators.required]],
      customerId: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      selectedDatetime: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.formu = urlParams.get('formu');
    this.id = urlParams.get('id');
    this.quantity = urlParams.get('quantity');
    this.customerId = urlParams.get('customerId');
    this.name = urlParams.get('name');
    this.date = urlParams.get('date');
    this.address = urlParams.get('address');
    this.productId = urlParams.get('productId');
    this.productName = urlParams.get('productName');

    this.selectedDatetime = this.date ? this.formatToDatetimeLocal(this.date) : null;

    if (this.id) {
      const orderId = parseInt(this.id, 10);
      if (!isNaN(orderId)) {
        this.loadOrderData(orderId);
      } else {
        console.error('ID de commande invalide');
      }
    }

    if (this.formu === "0") {
      this.isCreateFormVisible = true;
    } else if (this.formu === "1") {
      this.isModifierFormVisible = true;
    }
  }

  formatToDatetimeLocal(date: string): string {
    const dateOk = new Date(date);
    return dateOk.toISOString().slice(0, 16);
  }

  loadOrderData(orderId: number) {
    this.apiService.getOrderById(orderId).pipe(
      catchError(err => {
        this.editErrorMessage = `Erreur: impossible de charger les données de la commande avec l'ID ${orderId}.`;
        this.editOrderForm.reset();
        return of(null); // Retourner un observable vide
      })
    ).subscribe(order => {
      if (order) {
        this.editOrderForm.patchValue({
          orderId: order.id,
          customerId: this.customerId,
          productId: order.productId,
          quantity: order.quantity,
          selectedDatetime: order.createdAt ? this.formatToDatetimeLocal(order.createdAt) : '',
        });
        this.editErrorMessage = '';
      }
    });
  }

  handleError(message: string) {
    this.createErrorMessage = message;
    this.createSuccessMessage = '';
  }

  handleSuccess(message: string) {
    this.createSuccessMessage = message;
    this.createErrorMessage = '';
  }

  onCreateSubmit(): void {
    const { customerId, productId, quantity } = this.createOrderForm.value;
    const userId = this.getUserId();

    this.apiService.getCustomerById(customerId).pipe(
      catchError(() => {
        this.handleError('Customer ID inexistant.');
        return of(null);
      }),
      switchMap(() => this.apiService.getProductById(productId).pipe(
        catchError(() => {
          this.handleError('Product ID inexistant.');
          return of(null);
        })
      ))
    ).subscribe(product => {
      if (product && product.stock >= quantity) {
        const orderData = { customerId, productId, quantity, userId };
        this.apiService.createOrder(orderData).pipe(
          catchError(() => {
            this.handleError('Erreur lors de la création de la commande.');
            return of(null);
          })
        ).subscribe(response => {
          if (response) {
            this.handleSuccess('Commande créée avec succès.');
            this.createOrderForm.reset();
          }
        });
      } else {
        this.handleError('Stock insuffisant.');
      }
    });
  }

  onEditSubmit(): void {
    const { orderId, customerId, productId, quantity, selectedDatetime } = this.editOrderForm.value;

    this.apiService.getCustomerById(customerId).pipe(
      catchError(() => {
        this.editErrorMessage = 'Customer ID inexistant.';
        return of(null);
      }),
      switchMap(() => this.apiService.getProductById(productId).pipe(
        catchError(() => {
          this.editErrorMessage = 'Product ID inexistant.';
          return of(null);
        })
      ))
    ).subscribe(product => {
      if (product && product.stock >= quantity) {
        const orderData = { customerId, productId, quantity, selectedDatetime };
        this.apiService.updateOrder(orderId, orderData).pipe(
          catchError(() => {
            this.editErrorMessage = 'Erreur lors de la modification de la commande.';
            return of(null);
          })
        ).subscribe(() => {
          this.editSuccessMessage = 'Commande modifiée avec succès.';
          this.editErrorMessage = '';
          this.editOrderForm.reset();
        });
      } else {
        this.editErrorMessage = 'Stock insuffisant pour cette commande.';
      }
    });
  }

  getUserId(): number {
    return 1;
  }

  onCancelOrder(): void {
    const { orderId, customerId, productId, quantity } = this.editOrderForm.value;
  
    if (!orderId) {
      this.editErrorMessage = 'Aucune commande sélectionnée pour annulation.';
      return;
    }

    this.apiService.deleteOrder(orderId).pipe(
      catchError(() => {
        this.editErrorMessage = 'Erreur lors de la suppression de la commande.';
        return of(null);
      })
    ).subscribe(() => {
      this.apiService.getCustomerById(customerId).pipe(
        catchError(() => {
          this.editErrorMessage = 'Erreur lors de la récupération du client.';
          return of(null);
        })
      ).subscribe(customer => {
        if (customer) {
          const updatedOrders = customer.orders.filter((id: number) => id !== orderId);
          const updatedCustomer = { ...customer, orders: updatedOrders };

          this.apiService.updateCustomerOrders(customerId, updatedCustomer).pipe(
            catchError(() => {
              this.editErrorMessage = 'Erreur lors de la mise à jour du client.';
              return of(null);
            })
          ).subscribe(() => {
            this.apiService.getProductById(productId).pipe(
              catchError(() => {
                this.editErrorMessage = 'Erreur lors de la récupération du produit.';
                return of(null);
              })
            ).subscribe(product => {
              if (product) {
                const updatedStock = product.stock + quantity;
                const updatedProduct = { ...product, stock: updatedStock };

                this.apiService.updateProductStock(productId, updatedProduct).pipe(
                  catchError(() => {
                    this.editErrorMessage = 'Erreur lors de la restauration du stock.';
                    return of(null);
                  })
                ).subscribe(() => {
                  this.editSuccessMessage = 'Commande annulée avec succès.';
                  this.editErrorMessage = '';
                  this.editOrderForm.reset();
                });
              }
            });
          });
        }
      });
    });
  }

  onCreerClick(event: Event): void {
    event.preventDefault();
    window.location.href = `formulaire?formu=0`;
  }
}
