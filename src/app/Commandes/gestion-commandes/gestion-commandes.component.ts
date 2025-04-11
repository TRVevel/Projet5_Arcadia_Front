import { Component } from '@angular/core';
import { CarteCommandeComponent } from "../carte-commande/carte-commande.component";
import { CommonModule } from '@angular/common';
import { Order } from '../../models/Order';
import { Product } from '../../models/Product';
import { Customer } from '../../models/Customer';
import { RequetesApiService } from '../../services/requetes-api.service';

@Component({
  selector: 'app-gestion-commandes',
  imports: [CarteCommandeComponent, CommonModule],
  templateUrl: './gestion-commandes.component.html',
  styleUrl: './gestion-commandes.component.css'
})
export class GestionCommandesComponent {
  orderList!: Order[]
  productList!: Product[]
  customerList!: Customer[];

  constructor(private requetesApiService: RequetesApiService) {
    this.orderList = [];
    this.productList = [];
    this.customerList=[];
   }
  ngOnInit() {
    let authBody = {"username": "admin", "password": "pwd" };
    this.requetesApiService.customerLogin(authBody).subscribe((value)=>{
      console.log(value);
      localStorage.setItem("token", value.token)

      this.requetesApiService.getOrders().subscribe((value)=>{
        this.orderList = value.map((order: any) => new Order(order.id, order.productId, order.quantity, order.userId, order.createdAt));
        console.log(this.orderList);
      })
        this.requetesApiService.getProduct().subscribe((value)=>{
          this.productList = value.map((product: any) => new Product(product.id, product.name, product.stock));
          console.log(this.productList);
      
    })
    this.requetesApiService.getCustomers().subscribe((value)=>{
      this.customerList = value.map((customer: any) => new Customer(customer.id, customer.name, customer.email, customer.phone, customer.address, customer.orders));
      console.log(this.customerList);
    });
    
  }
  
)}
onCreerClick(
  event: Event
) {
  event.preventDefault(); // Empêche le comportement par défaut
  let whereClick: number = 0; // Vous pouvez définir d'autres valeurs si nécessaire
  const url = `formulaire?formu=${whereClick}`;
  window.open(url, '_blank');
  console.log(`Lien Creer cliqué`);
}
}
