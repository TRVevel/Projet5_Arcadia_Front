import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { RequetesApiService } from '../services/requetes-api.service';

@Component({
  selector: 'app-basket',
  imports: [CommonModule, FormsModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent {
  isLoading = true;
  isLoggedIn = false;
  lougoutVisible = false;
  basket: any[] = [];
  basketTotal = 0;

  payment = {
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvc: ''
  };

  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private requetesApiService: RequetesApiService
  ) {}

  ngOnInit(): void {
    this.checkAuth();
    this.isLoading = true;
    this.loadBasket();
  }

  // --- Auth & Navigation ---
  checkAuth(): void {
    this.isLoggedIn = this.utilsService.checkAuth();
  }
  handleUserProfile(): void {
    this.utilsService.handleUserProfile(this.router, this.isLoggedIn);
  }
  clickLougout(): void {
    this.lougoutVisible = this.utilsService.clickLougout();
  }
  onClickToHome(): void {
    this.utilsService.onClickToHome(this.router);
  }

  // --- Panier ---
  loadBasket(): void {
    this.isLoading = true;
    this.requetesApiService.getBasket().subscribe({
      next: (data) => {
        this.basket = Array.isArray(data) ? data : [];
        this.basketTotal = this.basket.reduce((acc, item) => acc + parseFloat(item.total_price), 0);
        this.isLoading = false;
      },
      error: () => {
        this.basket = [];
        this.basketTotal = 0;
        this.isLoading = false;
      }
    });
  }

  deleteBasket(id: string): void {
    this.isLoading = true;
    this.requetesApiService.deleteBasket(id).subscribe({
      next: () => {
        this.loadBasket();
        this.isLoading = false;
      },
      error: () => {
        alert('Erreur lors de la suppression du panier.');
        this.isLoading = false;
      }
    });
  }

  // --- Paiement ---
  onPay(): void {
    this.isLoading = true;
    this.requetesApiService.confirmBasket(
      this.payment.cardName,
      this.payment.cardNumber,
      this.payment.expDate,
      this.payment.cvc
    ).subscribe({
      next: () => {
        alert('Paiement effectué ! Commande confirmée.');
        this.loadBasket();
        this.payment = {
          cardName: '',
          cardNumber: '',
          expDate: '',
          cvc: ''
        };
        this.isLoading = false;
      },
      error: () => {
        alert('Erreur lors de la validation du panier.');
        this.isLoading = false;
      }
    });
  }
}
