import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequetesApiService } from '../services/requetes-api.service'; // Adjust the import path as needed
import { ActivatedRoute, Router } from '@angular/router';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = getCookie('token');
    this.checkAuth();

    this.requetesApiService.getCustomerProfil().subscribe({
      next: (data) => {
        this.user = data.profil;
        console.log('User profil:', this.user); // Ajout du console log
      },
      error: () => this.user = null
    });

    this.requetesApiService.getCustomerOrderHistory().subscribe({
      next: (orders) => this.orderHistory = orders,
      error: () => this.orderHistory = []
    });
  }

  onSubmit() {
    // Appelle ton service pour mettre à jour les infos modifiables
    this.requetesApiService.updateCustomerProfil(this.user).subscribe({
      next: () => alert('Profil mis à jour !'),
      error: () => alert('Erreur lors de la mise à jour.')
    });
  }
   // Méthodes header
  checkAuth(): void {
    const token = getCookie('token');
    this.isLoggedIn = !!token;
  }
  handleUserProfile() {
    if (this.isLoggedIn) {
      this.router.navigate(['/profil']);
    } else {
      this.router.navigate(['/auth']);
    }
  }
  clickLougout() {
    this.lougoutVisible = true;
  }
  onClickToHome(): void {
    this.router.navigate(['/home']);
  }
}
