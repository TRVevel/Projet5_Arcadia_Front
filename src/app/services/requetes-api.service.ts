import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service'; // Assure-toi que le chemin est correct


@Injectable({
  providedIn: 'root'
})
export class RequetesApiService {
  constructor(
    private httpClient: HttpClient,
    @Inject(UtilsService) private utilsService: UtilsService // Injection du service utilitaire
  ) { }
  private baseUrl = 'http://localhost:3000/api';

  private get token(): string | null {
    return this.utilsService.getCookie('token'); // Utilisation de la méthode du service
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

  getGamesPlatform() {
    return this.httpClient.get<any>(`${this.baseUrl}/gameplatforms`, { withCredentials: true });
  }
  getGamePlatformDetails(id: number) {
    return this.httpClient.get<any>(`${this.baseUrl}/gameplatforms/${id}`, {  withCredentials: true });
  }

 deconnexion(): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true });
  }

  getCustomerProfil(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/customer/profil`, {  withCredentials: true });
  }
  updateCustomerProfil(userData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(`${this.baseUrl}/customer/account`, userData, { headers, withCredentials: true });
  }
  getCustomerOrderHistory(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/customer/order_history`, { withCredentials: true });
  }
  getBasket(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/baskets`, { headers, withCredentials: true });
  }
  createBasket(game_platform_id: number, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    const body = { game_platform_id, quantity };
    return this.httpClient.post<any>(`${this.baseUrl}/baskets`, body, { headers, withCredentials: true });
  }
  deleteBasket(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete<any>(`${this.baseUrl}/baskets/${id}`, { headers, withCredentials: true });
  }
  confirmBasket(card_name: string, card_number: string, card_expiry: string, card_cvc: string): Observable<any> {
    const headers = this.getHeaders();
    const body = { card_name, card_number, card_expiry, card_cvc };
    return this.httpClient.post<any>(`${this.baseUrl}/baskets/confirm`, body, { headers, withCredentials: true });
  }
  getOrder(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(`${this.baseUrl}/orders`, { headers, withCredentials: true });
  }
   cancelOrder(order_id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete<any>(`${this.baseUrl}/orders/${order_id}`, { headers, withCredentials: true });
  }
  
  
    // Utilitaires
  private ensureToken(): void {
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token');
    }
  }
}
