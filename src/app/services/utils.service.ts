import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  // --- Cookies ---
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  // --- Auth & Navigation Header ---
  checkAuth(): boolean {
    return !!this.getCookie('token');
  }

  handleUserProfile(router: Router, isLoggedIn: boolean): void {
    router.navigate([isLoggedIn ? '/profil' : '/auth']);
  }

  onClickToHome(router: Router): void {
    router.navigate(['/home']);
  }

  clickLougout(): boolean {
    return true;
  }

  clickCrossLougout(): void {
    const deconnexion = document.querySelector('.deconnexion') as HTMLElement;
    if (deconnexion) {
      deconnexion.style.display = 'none';
    }
    // lougoutVisible doit être géré dans le composant, pas ici
  }

  clickBasket(router: Router, isLoggedIn: boolean): void {
    router.navigate([isLoggedIn ? '/basket' : '/auth']);
  }

}