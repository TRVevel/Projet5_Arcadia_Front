import { Component, Input } from '@angular/core';
import { Order } from '../../models/Order';
import { Product } from '../../models/Product';
import { Customer } from '../../models/Customer';

@Component({
  selector: 'app-carte-commande',
  imports: [],
  templateUrl: './carte-commande.component.html',
  styleUrl: './carte-commande.component.css'
})
export class CarteCommandeComponent {
  
  @Input() order!: Order;
  @Input() product!: Product[];
  @Input() customer!: Customer[];
  productRelier: Product | undefined;
  customerRelier: Customer | undefined;
  ngOnInit() {
    this.productRelier = this.product.find((product) => product.id == this.order.productId);
    if(this.productRelier === undefined) {
      console.log('Produit non trouvé');
    }else {
      this.productRelier
      console.log('Produit trouvé');
    }
    console.log(this.productRelier)
    this.customerRelier = this.customer.find((customer) => customer.orders.includes(this.order.id));
    if(this.customerRelier === undefined) {
      console.log('Client non trouvé');
    }else {
      this.customerRelier
      console.log('Produit trouvé');
    }
    console.log(this.customerRelier);
    
  }
  onModifierClick(
    orderId: number,
    orderQuantity: number,
    orderDate: Date, 
    customerId: number | undefined, 
    customerName: string|undefined, 
    customerAddress: string, 
    productId: number|undefined,
    productName: string|undefined, 
    event: Event
  ): void {
    event.preventDefault(); // Empêche le comportement par défaut
    let whereClick: number = 1; // Vous pouvez définir d'autres valeurs si nécessaire
    
    const url = `formulaire?formu=${whereClick}&id=${orderId}&quantity=${orderQuantity}&date=${orderDate}&customerId=${customerId}&name=${customerName}&address=${customerAddress}&productId=${productId}&productName=${productName}`;
    window.open(url, '_blank');
    console.log(`Lien cliqué pour l'ID : ${orderId}`);
  }
}
