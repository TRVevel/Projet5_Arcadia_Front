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
    // Utilitaires
  private ensureToken(): void {
    const token = this.token;
    if (!token) {
      throw new Error('No authentication token');
    }
  }
}
