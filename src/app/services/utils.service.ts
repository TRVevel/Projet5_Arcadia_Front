import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  // Méthodes header
  checkAuth(): boolean {
    const token = this.getCookie('token');
    return !!token;
  }

  handleUserProfile(router: Router, isLoggedIn: boolean): void {
    if (isLoggedIn) {
      router.navigate(['/profil']);
    } else {
      router.navigate(['/auth']);
    }
  }
 onClickToHome(router: Router): void {
    router.navigate(['/home']);
  }
  clickLougout(): boolean {
    return true;
  }

  clickCrossLougout(): void {
    const deconnexion = document.querySelector(".deconnexion") as HTMLElement;
    if (deconnexion) {
      deconnexion.style.display = "none";
    }
    // lougoutVisible doit être géré dans le composant, pas ici
  }
  clickBasket(router: Router, isLoggedIn: boolean): void {
    if (isLoggedIn) {
      router.navigate(['/basket']);
    } else {
      router.navigate(['/auth']);
    }
  }
  // Ajoute d'autres fonctions utilitaires ici
}