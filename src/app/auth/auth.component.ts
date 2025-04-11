import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequetesApiService } from '../services/requetes-api.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
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
  
  constructor(
    private router: Router,
    private requeteApiService: RequetesApiService
  ) {}

  onSubmitLogin(): void {
    const { email, password } = this.loginData;
  
    if (email && password) {
      const authBody = { email, password };
  
      const loginObservable = email.includes('@arcadia.')
        ? this.requeteApiService.staffLogin(authBody)
        : this.requeteApiService.customerLogin(authBody);
  
      loginObservable.subscribe({
        next: (value) => {
          console.log('Connexion réussie :', value);
          localStorage.setItem('token', value.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erreur de connexion :', err);
        }
      });
    } else {
      console.log('Veuillez renseigner tous les champs.');
    }
  }
  
  onSubmitRegister(): void {
    const { prenom, nom, email, adresse, password } = this.registerData;
  
    if (prenom && nom && email && adresse && password) {
      const userToRegister = { prenom, nom, email, adresse, password };
  
      this.requeteApiService.customerRegister(userToRegister).subscribe({
        next: (response) => {
          console.log('Inscription réussie :', response);
          // Rediriger ou notifier l'utilisateur ici
        },
        error: (err) => {
          console.error('Erreur lors de l\'inscription :', err);
        }
      });
    } else {
      console.log('Veuillez remplir tous les champs du formulaire.');
    }
  }
  
}
