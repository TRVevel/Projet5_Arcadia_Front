import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

@Injectable({
  providedIn: 'root'
})
export class RequetesApiService {
  constructor(private httpClient: HttpClient) { }
  private baseUrl = 'http://localhost:3000/api';

  private get token(): string | null {
    return getCookie('token');
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
