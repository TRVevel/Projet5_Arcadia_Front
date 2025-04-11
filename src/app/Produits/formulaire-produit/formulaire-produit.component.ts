import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { RequetesApiService } from '../../services/requetes-api.service';

@Component({
  selector: 'app-formulaire',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulaire-produit.component.html',
  styleUrls: ['./formulaire-produit.component.css']
})
export class FormulaireProduitComponent implements OnInit {
  
  formu: string | null = '';
  productId: string | null = '';
  productName: string | null = '';
  stock: string | null = '';
  isCreateFormVisible = false;
  isModifierFormVisible = false;

  createProductForm: FormGroup;
  editProductForm: FormGroup;
  createErrorMessage = '';
  createSuccessMessage = '';
  editErrorMessage = '';
  editSuccessMessage = '';

  constructor(private fb: FormBuilder, private apiService: RequetesApiService) {
    // Initialisation des formulaires
    this.createProductForm = this.fb.group({
      name: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
    });

    this.editProductForm = this.fb.group({
      productId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.formu = urlParams.get('formu');
    this.productId = urlParams.get('productId');
    this.productName = urlParams.get('productName');
    this.stock = urlParams.get('stock');

    if (this.productId) {
      const productIdNum = parseInt(this.productId, 10);
      if (!isNaN(productIdNum)) {
        this.loadProductData(productIdNum);
      } else {
        console.error('ID de produit invalide');
      }
    }

    if (this.formu === "0") {
      this.isCreateFormVisible = true;
    } else if (this.formu === "1") {
      this.isModifierFormVisible = true;
    }
  }

  loadProductData(productId: number) {
    this.apiService.getProductById(productId).pipe(
      catchError(err => {
        this.editErrorMessage = `Erreur: impossible de charger les données du produit avec l'ID ${productId}.`;
        this.editProductForm.reset();
        return of(null); // Retourner un observable vide
      })
    ).subscribe(product => {
      if (product) {
        this.editProductForm.patchValue({
          productId: product.id,
          name: product.name,
          stock: product.stock,
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
    const { name, stock } = this.createProductForm.value;

    const productData = { name, stock };
    this.apiService.createProduct(productData).pipe(
      catchError(() => {
        this.handleError('Erreur lors de la création du produit.');
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.handleSuccess('Produit créé avec succès.');
        this.createProductForm.reset();
      }
    });
  }

  onEditSubmit(): void {
    const { productId, name, stock } = this.editProductForm.value;

    const productData = { name, stock };
    this.apiService.updateProduct(productId, productData).pipe(
      catchError(() => {
        this.editErrorMessage = 'Erreur lors de la modification du produit.';
        return of(null);
      })
    ).subscribe(() => {
      this.editSuccessMessage = 'Produit modifié avec succès.';
      this.editErrorMessage = '';
      this.editProductForm.reset();
    });
  }
  onDelProduct(): void {
    const productId = this.editProductForm.get('productId')?.value;
  
    if (!productId) {
      this.editErrorMessage = 'Erreur : aucun produit sélectionné pour annulation.';
      return;
    }
  
    this.apiService.deleteProduct(productId).pipe(
      catchError(() => {
        this.editErrorMessage = 'Erreur lors de l\'annulation du produit.';
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.editSuccessMessage = 'Produit et commandes associées annulés avec succès.';
        this.editErrorMessage = '';
        this.editProductForm.reset();
      }
    });
  }
  
  

  onCreerClick(event: Event): void {
    event.preventDefault();
    window.location.href = `formulaire-produit?formu=0`;
  }
}
