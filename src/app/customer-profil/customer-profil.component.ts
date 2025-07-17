import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequetesApiService } from '../services/requetes-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../services/utils.service'; // Ajout de l'import

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

  constructor(
    public requetesApiService: RequetesApiService,
    private route: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService // Injection du service utilitaire
  ) {}

  ngOnInit(): void {
    this.checkAuth();

    this.requetesApiService.getCustomerProfil().subscribe({
      next: (data) => {
        this.user = data.profil;
        console.log('User profil:', this.user);
      },
      error: () => this.user = null
    });

    this.requetesApiService.getCustomerOrderHistory().subscribe({
      next: (orders) => this.orderHistory = orders,
      error: () => this.orderHistory = []
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
}
