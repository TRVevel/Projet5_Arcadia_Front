import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/Product';
import { RequetesApiService } from '../../services/requetes-api.service';
import { CarteProduitComponent } from '../carte-produit/carte-produit.component';

@Component({
  selector: 'app-gestion-produits',
  imports: [CarteProduitComponent, CommonModule],
  templateUrl: './gestion-produits.component.html',
  styleUrl: './gestion-produits.component.css'
})
export class GestionProduitsComponent {
  productList!: Product[];

  constructor(private requetesApiService: RequetesApiService) {
    this.productList = [];
  }

  ngOnInit() {
    const authBody = { "username": "admin", "password": "pwd" };
    this.requetesApiService.customerLogin(authBody).subscribe((value) => {
      console.log(value);
      localStorage.setItem("token", value.token);

      this.requetesApiService.getProduct().subscribe((value) => {
        this.productList = value.map(
          (product: any) => new Product(product.id, product.name, product.stock)
        );
        console.log(this.productList);
      });
    });
  }

  onCreerClick(event: Event) {
    event.preventDefault(); // Empêche le comportement par défaut
    const whereClick: number = 0; // Vous pouvez définir d'autres valeurs si nécessaire
    const url = `formulaire-produit?formu=${whereClick}`;
    window.open(url, '_blank');
    console.log(`Lien Créer Produit cliqué`);
  }
}
