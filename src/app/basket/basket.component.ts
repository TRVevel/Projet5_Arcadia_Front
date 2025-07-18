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
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  lougoutVisible: boolean = false;
  basket: any[] = [];
  basketTotal: number = 0;

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

  checkAuth(): void {
    this.isLoggedIn = this.utilsService.checkAuth();
  }

  handleUserProfile() {
    this.utilsService.handleUserProfile(this.router, this.isLoggedIn);
  }

  clickLougout() {
    this.lougoutVisible = this.utilsService.clickLougout();
  }

  onClickToHome(): void {
    this.utilsService.onClickToHome(this.router);
  }

 loadBasket() {
  this.isLoading = true;
  this.requetesApiService.getBasket().subscribe({
    next: (data) => {
      console.log('Contenu du panier reçu :', data);
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

onPay() {
  this.isLoading = true;
  this.requetesApiService.confirmBasket(
    this.payment.cardName,
    this.payment.cardNumber,
    this.payment.expDate,
    this.payment.cvc
  ).subscribe({
    next: (res) => {
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
    error: (err) => {
      alert('Erreur lors de la validation du panier.');
      console.error(err);
      this.isLoading = false;
    }
  });
}

deleteBasket(id: string) {
  this.isLoading = true;
  this.requetesApiService.deleteBasket(id).subscribe({
    next: () => {
      this.loadBasket();
      this.isLoading = false;
    },
    error: (err) => {
      alert('Erreur lors de la suppression du panier.');
      console.error(err);
      this.isLoading = false;
    }
  });
  }
}
