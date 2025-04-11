import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../models/Customer';
import { RequetesApiService } from '../../services/requetes-api.service';
import { CarteClientComponent } from '../carte-client/carte-client.component';
  
@Component({
  selector: 'app-gestion-clients',
  imports: [CarteClientComponent,CommonModule],
  templateUrl: './gestion-clients.component.html',
  styleUrls: ['./gestion-clients.component.css']
})
export class GestionClientsComponent {
  customerList!: Customer[];

  constructor(private requetesApiService: RequetesApiService) {
    this.customerList = [];
  }

  ngOnInit() {
    // Connexion via l'API (utilisation d'un token pour l'authentification)
    let authBody = { "username": "admin", "password": "pwd" };
    this.requetesApiService.customerLogin(authBody).subscribe((value) => {
      console.log(value);
      localStorage.setItem("token", value.token);

      // Récupération de la liste des clients
      this.requetesApiService.getCustomers().subscribe((value) => {
        this.customerList = value.map((customer: any) => new Customer(
          customer.id, 
          customer.name, 
          customer.email, 
          customer.phone, 
          customer.address, 
          customer.orders
        ));
        console.log(this.customerList);
      });
    });
  }

  onCreerClick(event: Event) {
    event.preventDefault(); // Empêche le comportement par défaut
    let whereClick: number = 0; // Indicateur pour afficher le formulaire de création de client
    const url = `formulaire-client?formu=${whereClick}`;
    window.open(url, '_blank');
    console.log(`Lien Créer cliqué`);
  }
}
