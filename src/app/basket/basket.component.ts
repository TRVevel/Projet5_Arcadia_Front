import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service'; // Ajout de l'import

@Component({
  selector: 'app-basket',
  imports: [CommonModule, FormsModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent {

  isLoggedIn: boolean = false;
  lougoutVisible: boolean = false;

  constructor(
    private router: Router,
    private utilsService: UtilsService // Injection du service utilitaire
  ) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(): void {
    this.isLoggedIn = this.utilsService.checkAuth();
  }

  handleUserProfile() {
    this.utilsService.handleUserProfile(this.router, this.isLoggedIn);
  }

  clickLougout() {
    this.lougoutVisible = this.utilsService.clickLougout();
  }

  onClickToHome(): void {
    this.utilsService.onClickToHome(this.router);
  }
}
