import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequetesApiService {
  constructor(private httpClient: HttpClient) { }
  private baseUrl = 'http://localhost:3000/api';
  private token = localStorage.getItem("token")

  private getHeaders(): HttpHeaders {
    if (!this.token) {
      throw new Error('No authentication token');
    }
    // Retourner un objet HttpHeaders
    return new HttpHeaders({
      Authorization: `${this.token}`
    });
  }
  
  customerLogin(body:any){
    return this.httpClient.post<any>((`${this.baseUrl}/auth/login`), body);
  }
  customerRegister(body:any){
    return this.httpClient.post<any>((`${this.baseUrl}/auth/register`), body);
  }
  staffLogin(body:any){
    return this.httpClient.post<any>((`${this.baseUrl}/auth/erp/login`), body);
  }
  staffRegister(body:any){
    return this.httpClient.post<any>((`${this.baseUrl}/auth/erp/register`), body);
  }
  getCustomers(){
   if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/customers`, {headers});
  }
  getProduct(){
    if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/products`, {headers});
  }
  getOrders(){
    if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/orders`, {headers});
  }
  getUsers(){
    if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/users`, {headers});
  }

  getOrderById(orderId: number): Observable<any> {
    if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/orders/${orderId}`, {headers});
  }

  getCustomerById(customerId: number): Observable<any> {
    if (!this.token) {
      throw new Error('No authentication token');
    }
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/customers/${customerId}`, { headers });
  }
  
  getProductById(productId: number): Observable<any> {
    if (!this.token) {
      throw new Error('No authentication token');
    }
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/products/${productId}`, { headers });
  }

  createOrder(orderData: any): Observable<any> {
    if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.post<any>(`${this.baseUrl}/orders`, orderData, {headers});
  }

  updateOrder(orderId: number, orderData: any): Observable<any> {
    if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.put<any>(`${this.baseUrl}/orders/${orderId}`, orderData, {headers});
  }

  updateCustomerOrders(customerId: number, customer: any): Observable<any> {
    if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.put(`${this.baseUrl}/customers/${customerId}`, customer, {headers});
  }
  createCustomer(customerData: any): Observable<any> {
    this.ensureToken();
    const headers= this.getHeaders();
    return this.httpClient.post<any>(`${this.baseUrl}/customers`, customerData, {headers});
  }
  updateCustomer(customerId: number, customer: any): Observable<any> {
    if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.put(`${this.baseUrl}/customers/${customerId}`, customer, {headers});
  }
  deleteCustomer(customerId: number): Observable<any> {
    this.ensureToken();
    const headers= this.getHeaders();
    return this.httpClient.delete<any>(`${this.baseUrl}/customers/${customerId}`, {headers});
  }
  updateProductStock(productId: number, updatedProduct: any): Observable<any> {
    if(!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.put<any>(`${this.baseUrl}/products/${productId}`, updatedProduct, {headers});
  }
  deleteOrder(orderId: number): Observable<any> {
    if (!this.token) {
      throw new Error('No authentification');
    }
    const headers= this.getHeaders();
    return this.httpClient.delete(`${this.baseUrl}/orders/${orderId}`, { headers });
  }
   // Méthodes pour les produits
   createProduct(productData: any): Observable<any> {
    this.ensureToken();
    const headers= this.getHeaders();
    return this.httpClient.post<any>(`${this.baseUrl}/products`, productData, { headers });
  }

  updateProduct(productId: number, productData: any): Observable<any> {
    this.ensureToken();
    const headers= this.getHeaders();
    return this.httpClient.put<any>(`${this.baseUrl}/products/${productId}`, productData, { headers });
  }

  deleteProduct(productId: number): Observable<any> {
    this.ensureToken();
    const headers= this.getHeaders();
    return this.httpClient.delete<any>(`${this.baseUrl}/products/${productId}`, { headers });
  }

  // Utilitaires
  private ensureToken(): void {
    if (!this.token) {
      throw new Error('No authentication token');
    }
  }
}
