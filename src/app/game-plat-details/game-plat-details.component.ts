import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequetesApiService } from '../services/requetes-api.service';
import { UtilsService } from '../services/utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-plat-details',
  imports: [CommonModule],
  templateUrl: './game-plat-details.component.html',
  styleUrl: './game-plat-details.component.css'
})
export class GamePlatDetailsComponent {
  game: any;
  isLoggedIn = false;
  lougoutVisible = false;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requeteApiService: RequetesApiService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.checkAuth();
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requeteApiService.getGamePlatformDetails(Number(id)).subscribe({
        next: (game) => {
          this.game = game;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  // --- Méthodes header via UtilsService ---
  checkAuth(): void {
    this.isLoggedIn = this.utilsService.checkAuth();
  }
  handleUserProfile(): void {
    this.utilsService.handleUserProfile(this.router, this.isLoggedIn);
  }
  clickLougout(): void {
    this.lougoutVisible = this.utilsService.clickLougout();
  }
  clickCrossLougout(): void {
    this.utilsService.clickCrossLougout();
    this.lougoutVisible = false;
  }
  onClickToHome(): void {
    this.utilsService.onClickToHome(this.router);
  }
  clickBasket(): void {
    this.utilsService.clickBasket(this.router, this.isLoggedIn);
  }

  // --- Méthodes utilitaires d'affichage ---
  getPlatformClass(platform: string): string {
    switch ((platform || '').toLowerCase()) {
      case 'playstation': return 'platform-playstation';
      case 'xbox': return 'platform-xbox';
      case 'pc': return 'platform-pc';
      case 'nintendo': return 'platform-nintendo';
      default: return 'platform-default';
    }
  }

  getPegiClass(pegi: string | number): string {
    const n = Number(pegi);
    if (n === 3 || n === 7) return 'pegi-green';
    if (n === 12 || n === 16) return 'pegi-yellow';
    if (n === 18) return 'pegi-red';
    return '';
  }

  getGameImage(game: any): string {
    const img = game?.game?.image || game?.image;
    if (img) return img;
    const platform = (game?.platform?.name || game?.platform_id || '').toLowerCase();
    switch (platform) {
      case 'playstation': return '/assets/platform-default-playstation.png';
      case 'xbox': return '/assets/platform-default-xbox.png';
      case 'pc': return '/assets/platform-default-pc.png';
      case 'nintendo': return '/assets/platform-default-nintendo.png';
      default: return '/assets/default_ofdefault.png';
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/no-image.png';
  }
}
