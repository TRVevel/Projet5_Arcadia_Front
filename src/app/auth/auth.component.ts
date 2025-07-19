import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequetesApiService } from '../services/requetes-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoading = false;

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    prenom: '',
    nom: '',
    age: '',
    email: '',
    telephone: '',
    adresse: '',
    password: ''
  };

  constructor(
    private router: Router,
    private requeteApiService: RequetesApiService
  ) {}

  onSubmitLogin(): void {
    const { email, password } = this.loginData;
    if (!email || !password) {
      alert('Veuillez renseigner tous les champs.');
      return;
    }
    this.isLoading = true;
    const authBody = { email, password };
    const loginObservable = email.includes('@arcadia.')
      ? this.requeteApiService.staffLogin(authBody)
      : this.requeteApiService.customerLogin(authBody);

    loginObservable.subscribe({
      next: (value) => {
        document.cookie = `token=${value.token}; path=/; secure; samesite=strict`;
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Erreur de connexion.');
        this.isLoading = false;
      }
    });
  }

  onSubmitRegister(): void {
    const { prenom, nom, email, adresse, password } = this.registerData;
    if (email.includes('@arcadia.')) {
      alert('Inscription interdite avec une adresse @arcadia.');
      return;
    }
    if (!prenom || !nom || !email || !adresse || !password) {
      alert('Veuillez remplir tous les champs du formulaire.');
      return;
    }
    this.isLoading = true;
    const userToRegister = {
      first_name: prenom,
      last_name: nom,
      email,
      adress: adresse,
      password
    };
    this.requeteApiService.customerRegister(userToRegister).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Inscription réussie !');
        // Rediriger ou notifier l'utilisateur ici si besoin
      },
      error: () => {
        alert('Erreur lors de l\'inscription.');
        this.isLoading = false;
      }
    });
  }

  onClickToHome(): void {
    this.router.navigate(['/home']);
  }
}
