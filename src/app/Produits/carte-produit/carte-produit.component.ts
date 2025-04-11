import { Component, Input } from '@angular/core';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-carte-produit',
  imports: [],
  templateUrl: './carte-produit.component.html',
  styleUrl: './carte-produit.component.css'
})
export class CarteProduitComponent {

  @Input() product!: Product;

  ngOnInit() {
    // Vérification du produit chargé
    if (!this.product) {
      console.error('Produit non trouvé ou non chargé');
    } else {
      console.log('Produit chargé :', this.product);
    }
  }

  onModifierClick(
    productId: number,
    productName: string,
    productStock: number,
    event: Event
  ): void {
    event.preventDefault(); // Empêche le comportement par défaut

    const whereClick: number = 1; // Code pour indiquer une modification
    const url = `formulaire-produit?formu=${whereClick}&productId=${productId}&name=${productName}&stock=${productStock}`;
    window.open(url, '_blank');
    console.log(`Lien cliqué pour le produit ID : ${productId}`);
  }
}
