import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequetesApiService } from '../services/requetes-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  loginData= {
  email: '',
  password:''};

  registerData = {
    prenom: '',
    nom: '',
    age: '',
    email: '',
    telephone: '',
    adresse: '',
    password: ''
  };
  
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private requeteApiService: RequetesApiService
  ) {}

  onSubmitLogin(): void {
    const { email, password } = this.loginData;
  
    if (email && password) {
      this.isLoading = true;
      const authBody = { email, password };
      console.log('Tentative de connexion avec :', authBody);
  
      const loginObservable = email.includes('@arcadia.')
        ? this.requeteApiService.staffLogin(authBody)
        : this.requeteApiService.customerLogin(authBody);
  
      loginObservable.subscribe({
        next: (value) => {
          console.log('Connexion réussie :', value);
          document.cookie = `token=${value.token}; path=/; secure; samesite=strict`;
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Erreur de connexion :', err);
          this.isLoading = false;
        }
      });
    } else {
      console.log('Veuillez renseigner tous les champs.');
    }
  }
  
  onSubmitRegister(): void {
    const { prenom, nom, email, adresse, password } = this.registerData;

    if (email.includes('@arcadia.')) {
      console.log('Inscription interdite avec une adresse @arcadia.');
      return;
    }

    if (prenom && nom && email && adresse && password) {
      this.isLoading = true;
      const userToRegister = {
        first_name: prenom,
        last_name: nom,
        email,
        adress: adresse,
        password
      };

      this.requeteApiService.customerRegister(userToRegister).subscribe({
        next: (response) => {
          console.log('Inscription réussie :', response);
          this.isLoading = false;
          // Rediriger ou notifier l'utilisateur ici
        },
        error: (err) => {
          console.error('Erreur lors de l\'inscription :', err);
          this.isLoading = false;
        }
      });
    } else {
      console.log('Veuillez remplir tous les champs du formulaire.');
    }
  }
  onClickToHome(): void {
    this.router.navigate(['/home']);
  }
}
