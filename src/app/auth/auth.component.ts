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
  showLoginPassword = false;
  showRegisterPassword = false;
  errorMessages = {
    login: '',
    register: ''
  };

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

  validateRegisterForm(): string {
    const { prenom, nom, email, adresse, password } = this.registerData;
    // Prénom
    if (!prenom || prenom.length < 2 || prenom.length > 100 || !/^[a-zA-Z\s]+$/.test(prenom)) {
      return 'Le prénom doit contenir uniquement des lettres et des espaces (2-100 caractères).';
    }
    // Nom
    if (!nom || nom.length < 2 || nom.length > 100 || !/^[a-zA-Z\s]+$/.test(nom)) {
      return 'Le nom doit contenir uniquement des lettres et des espaces (2-100 caractères).';
    }
    // Email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Veuillez saisir une adresse email valide.';
    }
    if (email.includes('@arcadia.')) {
      return 'Inscription interdite avec une adresse @arcadia.';
    }
    // Adresse
    if (!adresse || adresse.length < 10 || adresse.length > 255) {
      return 'L\'adresse doit comporter entre 10 et 255 caractères.';
    }
    // Mot de passe
    if (!password || password.length < 8) {
      return 'Le mot de passe doit comporter au moins 8 caractères.';
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.';
    }
    return '';
  }

  validateLoginForm(): string {
    const { email, password } = this.loginData;
    if (!email || !password) {
      return 'Veuillez renseigner tous les champs.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Veuillez saisir une adresse email valide.';
    }
    if (email.includes('@arcadia.')) {
      if (password.length < 8) {
        return 'Le mot de passe doit comporter au moins 8 caractères pour le staff.';
      }
    } else {
      if (password.length < 2) {
        return 'Le mot de passe doit comporter au moins 2 caractères.';
      }
    }
    return '';
  }

  onSubmitLogin(): void {
    this.errorMessages.login = this.validateLoginForm();
    if (this.errorMessages.login) return;

    const { email, password } = this.loginData;
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
      error: (err) => {
        this.errorMessages.login = 'Erreur de connexion. Vérifiez vos identifiants.';
        this.isLoading = false;
      }
    });
  }

  onSubmitRegister(): void {
    this.errorMessages.register = this.validateRegisterForm();
    if (this.errorMessages.register) return;

    const { prenom, nom, email, adresse, password } = this.registerData;
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
      },
      error: (err) => {
        this.errorMessages.register = 'Erreur lors de l\'inscription.';
        this.isLoading = false;
      }
    });
  }

  onClickToHome(): void {
    this.router.navigate(['/home']);
  }
}
