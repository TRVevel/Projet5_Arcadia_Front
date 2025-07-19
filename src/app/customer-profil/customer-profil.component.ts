import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequetesApiService } from '../services/requetes-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-customer-profil',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-profil.component.html',
  styleUrl: './customer-profil.component.css'
})
export class CustomerProfilComponent {
  user: any = null;
  orderHistory: any[] = [];
  game: any;
  isLoggedIn: boolean = false;
  lougoutVisible: boolean = false;
  isLoading: boolean = true; // Loader
  currentOrders: any[] = [];

  constructor(
    public requetesApiService: RequetesApiService,
    private route: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.checkAuth();
    this.isLoading = true;

    this.requetesApiService.getCustomerProfil().subscribe({
      next: (data) => {
        this.user = data.profil;
        console.log('User profil:', this.user);
        this.isLoading = false;
      },
      error: () => {
        this.user = null;
        this.isLoading = false;
      }
    });

    // Récupère toutes les commandes livrées ou annulées pour l'historique
    this.requetesApiService.getOrder().subscribe({
      next: (orders) => {
        if (Array.isArray(orders)) {
          this.currentOrders = orders.filter((o: any) =>
            o.status &&
            o.status !== 'delivered' &&
            o.status !== 'cancelled'
          );
          this.orderHistory = orders.filter((o: any) =>
            o.status &&
            (o.status === 'delivered' || o.status === 'cancelled')
          );
        } else {
          this.currentOrders = [];
          this.orderHistory = [];
        }
      },
      error: () => {
        this.currentOrders = [];
        this.orderHistory = [];
      }
    });
  }

  onSubmit() {
    this.requetesApiService.updateCustomerProfil(this.user).subscribe({
      next: () => alert('Profil mis à jour !'),
      error: () => alert('Erreur lors de la mise à jour.')
    });
  }

  // Méthodes header via UtilsService
  checkAuth(): void {
    this.isLoggedIn = this.utilsService.checkAuth();
  }
  handleUserProfile() {
    this.utilsService.handleUserProfile(this.router, this.isLoggedIn);
  }
  clickLougout() {
    this.lougoutVisible = this.utilsService.clickLougout();
  }
  clickCrossLougout() {
    this.utilsService.clickCrossLougout();
    this.lougoutVisible = false;
  }
  onClickToHome(): void {
    this.router.navigate(['/home']);
  }
  clickBasket() {
    this.utilsService.clickBasket(this.router, this.isLoggedIn);
  }
  clickGamePlat(id: number) {
    if (id) {
      this.router.navigate(['/home/game-plat-details/', id]);
    }
  }

  cancelOrder(order_id: number) {
    if (!order_id) return;
    if (!confirm('Voulez-vous vraiment annuler cette commande ?')) return;
    this.isLoading = true;
    this.requetesApiService.cancelOrder(order_id.toString()).subscribe({
      next: () => {
        this.currentOrders = this.currentOrders.filter(o => o.id !== order_id);
        alert('Commande annulée avec succès.');
        this.isLoading = false;
      },
      error: () => {
        alert('Erreur lors de l\'annulation de la commande.');
        this.isLoading = false;
      }
    });
  }
}
