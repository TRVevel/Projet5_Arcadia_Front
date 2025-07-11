import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequetesApiService {
  constructor(private httpClient: HttpClient) { }
  private baseUrl = 'http://localhost:3000/api';

  private get token(): string | null {
    return localStorage.getItem("token");
  }

  private getHeaders(): HttpHeaders {
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token');
    }
    // Retourner un objet HttpHeaders
    return new HttpHeaders({
      Authorization: `${token}`
    });
  }
  
  customerLogin(body: any) {
    return this.httpClient.post<any>(`${this.baseUrl}/auth/login`, body, { withCredentials: true });
  }
  customerRegister(body: any) {
    return this.httpClient.post<any>(`${this.baseUrl}/auth/register`, body, { withCredentials: true });
  }
  staffLogin(body: any) {
    return this.httpClient.post<any>(`${this.baseUrl}/auth/erp/login`, body, { withCredentials: true });
  }
  staffRegister(body: any) {
    return this.httpClient.post<any>(`${this.baseUrl}/auth/erp/register`, body, { withCredentials: true });
  }
  getCustomers() {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/customers`, { headers, withCredentials: true });
  }
  getGamesPlatform() {
    return this.httpClient.get<any>(`${this.baseUrl}/gameplatforms`, { withCredentials: true });
  }
  getGamePlatformDetails(id: number) {
    return this.httpClient.get<any>(`${this.baseUrl}/gameplatforms/${id}`, {  withCredentials: true });
  }
  getOrders() {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/orders`, { headers, withCredentials: true });
  }
  getUsers() {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/users`, { headers, withCredentials: true });
  }

  getOrderById(orderId: number): Observable<any> {
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/orders/${orderId}`, {headers});
  }

  getCustomerById(customerId: number): Observable<any> {
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/customers/${customerId}`, { headers });
  }
  
  getProductById(productId: number): Observable<any> {
    const headers= this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/products/${productId}`, { headers });
  }

  createOrder(orderData: any): Observable<any> {
    const headers= this.getHeaders();
    return this.httpClient.post<any>(`${this.baseUrl}/orders`, orderData, {headers});
  }

  updateOrder(orderId: number, orderData: any): Observable<any> {
    const headers= this.getHeaders();
    return this.httpClient.put<any>(`${this.baseUrl}/orders/${orderId}`, orderData, {headers});
  }

  updateCustomerOrders(customerId: number, customer: any): Observable<any> {
    const headers= this.getHeaders();
    return this.httpClient.put(`${this.baseUrl}/customers/${customerId}`, customer, {headers});
  }
  createCustomer(customerData: any): Observable<any> {
    this.ensureToken();
    const headers= this.getHeaders();
    return this.httpClient.post<any>(`${this.baseUrl}/customers`, customerData, {headers});
  }
  updateCustomer(customerId: number, customer: any): Observable<any> {
    const headers= this.getHeaders();
    return this.httpClient.put(`${this.baseUrl}/customers/${customerId}`, customer, {headers});
  }
  deleteCustomer(customerId: number): Observable<any> {
    this.ensureToken();
    const headers= this.getHeaders();
    return this.httpClient.delete<any>(`${this.baseUrl}/customers/${customerId}`, {headers});
  }
  updateProductStock(productId: number, updatedProduct: any): Observable<any> {
    const headers= this.getHeaders();
    return this.httpClient.put<any>(`${this.baseUrl}/products/${productId}`, updatedProduct, {headers});
  }
  deleteOrder(orderId: number): Observable<any> {
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
 deconnexion(): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true });
  }
  // Utilitaires
  private ensureToken(): void {
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token');
    }
  }
}
