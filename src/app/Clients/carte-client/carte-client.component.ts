import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../models/Order'; // Assurez-vous que la classe Order existe pour les commandes
import { Customer } from '../../models/Customer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carte-client',
  imports: [CommonModule],
  templateUrl: './carte-client.component.html',
  styleUrls: ['./carte-client.component.css']
})
export class CarteClientComponent implements OnInit {
  @Input() customer!: Customer; // Le client passé en entrée
  
  
  orderList: Order[] = [];

  ngOnInit() {
    // Vérifier si le client a des commandes associées
    if (this.customer && this.customer.orders && this.customer.orders.length > 0) {
      // Trouver les commandes liées à ce client, en filtrant selon l'ID dans le tableau des commandes de chaque client
      this.orderList = this.customer.orders
      
      // Si aucune commande n'est trouvée
      if (this.orderList.length === 0) {
        console.log('Aucune commande trouvée pour ce client');
      }
    } else {
      console.log('Le client n\'a pas de commandes');
    }
  }

  onModifierClick(event: Event): void {
    event.preventDefault(); // Empêche le comportement par défaut
    let whereClick: number = 1; // Vous pouvez définir d'autres valeurs si nécessaire

    // Créer l'URL pour la modification du client
    const url = `formulaire-client?formu=${whereClick}&id=${this.customer.id}&name=${this.customer.name}&email=${this.customer.email}&phone=${this.customer.phone}&address=${this.customer.address}`;
    window.open(url, '_blank');
    console.log(`Lien cliqué pour l'ID du client : ${this.customer.id}`);
  }
}