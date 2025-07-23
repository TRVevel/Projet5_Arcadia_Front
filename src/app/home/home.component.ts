import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RequetesApiService } from '../services/requetes-api.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // --- État principal ---
  gamePlatData: any[] = [];
  filteredGamePlatData: any[] = [];
  isLoading = true;
  isLoggedIn = false;
  lougoutVisible = false;

  // --- Filtres & options ---
  showPlatformDropdown = false;
  showDeviceDropdown = false;
  showPegiDropdown = false;
  showGenreDropdown = false;
  showSortDropdown = false;
  showSensitiveDropdown = false;

  selectedPlatform = '';
  selectedDevice = '';
  selectedPegi = '';
  selectedGenre = '';
  sortOption = '';
  searchTerm = '';
  hiddenSensitive: string[] = [];

  availablePlatforms: string[] = [];
  availableDevices: string[] = [];
  availablePegis: string[] = [];
  availableGenres: string[] = [];
  availableSensitive: string[] = [];

  // --- Pagination ---
  currentPage = 1;
  pageSize = 12;

  constructor(
    private router: Router,
    private requeteApiService: RequetesApiService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.checkAuth();
    this.requeteApiService.getGamesPlatform().subscribe({
      next: (gamesPlat: any[]) => {
        this.gamePlatData = gamesPlat.map((g: any) => ({ ...g, quantity: 1 }));
        const detailRequests = gamesPlat.map((game: any) =>
          this.requeteApiService.getGamePlatformDetails(game.id)
        );
        forkJoin(detailRequests).subscribe(
          (details: any[]) => {
            details.forEach((detail, idx) => {
              this.gamePlatData[idx].details = detail;
            });
            this.filteredGamePlatData = [...this.gamePlatData];
            this.availablePlatforms = [
              ...new Set(this.gamePlatData.map((g: any) => g.details?.platform?.name || g.platform_id))
            ];
            this.availablePegis = [
              ...new Set(this.gamePlatData.map((g: any) => g.details?.game?.pegi).filter(Boolean))
            ].sort((a, b) => Number(b) - Number(a));
            this.availableGenres = [
              ...new Set(this.gamePlatData.map((g: any) => g.details?.game?.genre).filter(Boolean))
            ];
            this.availableSensitive = [
              ...new Set(
                this.gamePlatData
                  .map((g: any) => g.details?.game?.sensitive_content)
                  .filter(Boolean)
                  .flatMap((s: string) => s.split(',').map(x => x.trim()))
              )
            ];
            this.updateAvailableDevices();
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          }
        );
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // --- Auth & navigation ---
  checkAuth(): void {
    this.isLoggedIn = this.utilsService.checkAuth();
  }
  handleUserProfile() {
    this.utilsService.handleUserProfile(this.router, this.isLoggedIn);
  }
  clickLougout() {
    const deconnexion = document.querySelector(".deconnexion") as HTMLElement;
    deconnexion.style.display = "block";
    this.lougoutVisible = this.utilsService.clickLougout();
  }
  clickCrossLougout() {
    this.utilsService.clickCrossLougout();
    this.lougoutVisible = false;
  }
  logout() {
    this.requeteApiService.deconnexion().subscribe({
      next: () => {
        alert("Déconnexion réussie");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
        this.isLoggedIn = false;
      }
    });
  }
  onClickToHome(): void {
    this.utilsService.onClickToHome(this.router);
  }
  clickBasket() {
    this.utilsService.clickBasket(this.router, this.isLoggedIn);
  }

  // --- Filtres & changements ---
  onPlatformChange() {
    this.selectedDevice = '';
    this.updateAvailableDevices();
    this.applyFilters();
  }
  onDeviceChange() { this.applyFilters(); }
  onPegiChange() { this.applyFilters(); }
  onGenreChange() { this.applyFilters(); }
  onSensitiveChange() { this.applyFilters(); }
  onSearchChange() { this.applyFilters(); }
  onSortChange() { this.applyFilters(); }

  // --- Application des filtres et tri ---
  applyFilters() {
    this.currentPage = 1;
    this.filteredGamePlatData = this.gamePlatData.filter(g => {
      const platformMatch = (g.details?.platform?.name || g.platform_id) === this.selectedPlatform || this.selectedPlatform === '';
      const deviceMatch = (g.details?.game_platform?.compatible_device || g.compatible_devices) === this.selectedDevice || this.selectedDevice === '';
      const pegiMatch = this.selectedPegi === '' || Number(g.details?.game?.pegi) === Number(this.selectedPegi);
      const genreMatch = this.selectedGenre === '' || g.details?.game?.genre === this.selectedGenre;
      const title = g.details?.game?.title || g.name || g.title || '';
      const searchMatch = this.searchTerm.trim() === '' || title.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
      const sensitive = g.details?.game?.sensitive_content || '';
      const sensitiveList = sensitive.split(',').map((x: string) => x.trim());
      const sensitiveMatch = !this.hiddenSensitive.some(hide => sensitiveList.includes(hide));
      return platformMatch && deviceMatch && pegiMatch && genreMatch && searchMatch && sensitiveMatch;
    });

    switch (this.sortOption) {
      case 'date-desc':
        this.filteredGamePlatData.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        break;
      case 'date-asc':
        this.filteredGamePlatData.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        break;
      case 'price-asc':
        this.filteredGamePlatData.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        this.filteredGamePlatData.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'alpha-asc':
        this.filteredGamePlatData.sort((a, b) => {
          const ta = (a.details?.game?.title || a.name || a.title || '').toLowerCase();
          const tb = (b.details?.game?.title || b.name || b.title || '').toLowerCase();
          return ta.localeCompare(tb);
        });
        break;
      case 'alpha-desc':
        this.filteredGamePlatData.sort((a, b) => {
          const ta = (a.details?.game?.title || a.name || a.title || '').toLowerCase();
          const tb = (b.details?.game?.title || b.name || b.title || '').toLowerCase();
          return tb.localeCompare(ta);
        });
        break;
    }

    this.updateAvailableDevices();
  }

  // --- Pagination ---
  get totalPages(): number {
    return Math.ceil(this.filteredGamePlatData.length / this.pageSize) || 1;
  }
  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  get paginatedGames() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredGamePlatData.slice(start, start + this.pageSize);
  }

  // --- Filtres dynamiques ---
  updateAvailableDevices() {
    if (!this.selectedPlatform) {
      this.availableDevices = [];
      this.selectedDevice = '';
      return;
    }
    const seen = new Set<string>();
    this.availableDevices = this.gamePlatData
      .filter(g => (g.details?.platform?.name || g.platform_id) === this.selectedPlatform)
      .map(g => g.details?.game_platform?.compatible_device || g.compatible_devices)
      .filter(dev => !!dev && !seen.has(dev) && seen.add(dev));
  }

  // --- Sélections filtres ---
  selectPlatform(plat: string) {
    this.selectedPlatform = plat;
    this.showPlatformDropdown = false;
    this.onPlatformChange();
  }
  selectDevice(dev: string) {
    this.selectedDevice = dev;
    this.showDeviceDropdown = false;
    this.onDeviceChange();
  }
  selectPegi(pegi: string) {
    this.selectedPegi = pegi;
    this.showPegiDropdown = false;
    this.onPegiChange();
  }
  selectGenre(genre: string) {
    this.selectedGenre = genre;
    this.showGenreDropdown = false;
    this.onGenreChange();
  }
  selectSort(sort: string) {
    this.sortOption = sort;
    this.showSortDropdown = false;
    this.onSortChange();
  }
  toggleSensitive(sens: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.hiddenSensitive = [...this.hiddenSensitive, sens];
    } else {
      this.hiddenSensitive = this.hiddenSensitive.filter(s => s !== sens);
    }
    this.onSensitiveChange();
  }

  // --- Utilitaires d'affichage ---
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
    const img = game.details?.game?.image || game.image;
    if (img) return img;
    const platform = (game.details?.platform?.name || game.platform_id || '').toLowerCase();
    switch (platform) {
      case 'playstation':
        return '../assets/platform-default-playstation.png';
      case 'xbox':
        return '../assets/platform-default-xbox.png';
      case 'pc':
        return '../assets/platform-default-pc.png';
      case 'nintendo':
        return '../assets/platform-default-nintendo.png';
      default:
        return '../assets/default_ofdefault.png';
    }
  }

  // --- Actions sur les jeux ---
  clickGamePlat(id: number) {
    this.router.navigate(['/home/game-plat-details/', id]);
  }
  clickToBasket(event: Event, game: any) {
    event.stopPropagation();
    if (!this.isLoggedIn) {
      this.utilsService.clickBasket(this.router, this.isLoggedIn);
      return;
    }

    // Envoie l'id de la plateforme de jeu et la quantité au panier
    this.requeteApiService.createBasket(game.id, game.quantity || 1).subscribe({
      next: () => {
        alert('Jeu ajouté au panier !');
      },
      error: (err) => {
        const message = err?.error?.message || err?.message || 'Erreur lors de l\'ajout au panier.';
        alert(message);
        console.error('Erreur ajout panier:', err);
      }
    });
  }
  clickPlus(event: Event, game: any) {
    event.stopPropagation();
    game.quantity++;
  }
  clickMinus(event: Event, game: any) {
    event.stopPropagation();
    if (game.quantity > 1) {
      game.quantity--;
    }
  }

  // --- Gestion des erreurs d'image ---
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-image.png';
  }
}



