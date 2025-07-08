import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RequetesApiService } from '../services/requetes-api.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  gamePlatData: any[] = [];
  filteredGamePlatData: any[] = [];
  selectedPlatform: string = '';
  selectedDevice: string = '';
  selectedPegi: string = '';
  selectedGenre: string = '';
  availablePlatforms: string[] = [];
  availableDevices: string[] = [];
  availablePegis: string[] = [];
  availableGenres: string[] = [];
  availableSensitive: string[] = [];
  hiddenSensitive: string[] = [];
  searchTerm: string = '';
  showSensitiveDropdown = false;
  sortOption: string = '';

  constructor(
    private router: Router,
    private requeteApiService: RequetesApiService
  ) {}

  ngOnInit(): void {
    this.requeteApiService.getGamesPlatform().subscribe({
      next: (gamesPlat) => {
        this.gamePlatData = gamesPlat;
        const detailRequests = gamesPlat.map((game: any) => this.requeteApiService.getGamePlatformDetails(game.id));
        forkJoin(detailRequests).subscribe(
          (details) => {
            (details as any[]).forEach((detail, idx) => {
              this.gamePlatData[idx].details = detail;
            });
            this.filteredGamePlatData = [...this.gamePlatData];
            this.availablePlatforms = [
              ...new Set(this.gamePlatData.map(g => g.details?.platform?.name || g.platform_id))
            ];
            this.availablePegis = [
              ...new Set(this.gamePlatData.map(g => g.details?.game?.pegi).filter(Boolean))
            ].sort((a, b) => Number(b) - Number(a));
            this.availableGenres = [
              ...new Set(this.gamePlatData.map(g => g.details?.game?.genre).filter(Boolean))
            ];
            this.availableSensitive = [
              ...new Set(
                this.gamePlatData
                  .map(g => g.details?.game?.sensitive_content)
                  .filter(Boolean)
                  .flatMap((s: string) => s.split(',').map(x => x.trim()))
              )
            ];
            this.updateAvailableDevices();
          },
          (err) => {
            console.error('Erreur lors de la récupération des détails :', err);
          }
        );
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des jeux :', err);
      }
    });
  }

  onPlatformChange() {
    this.selectedDevice = '';
    this.updateAvailableDevices();
    this.applyFilters();
  }

  onDeviceChange() {
    this.applyFilters();
  }

  onPegiChange() {
    this.applyFilters();
  }

  onGenreChange() {
    this.applyFilters();
  }

  onSensitiveChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredGamePlatData = this.gamePlatData.filter(g => {
      const platformMatch = (g.details?.platform?.name || g.platform_id) === this.selectedPlatform || this.selectedPlatform === '';
      const deviceMatch = (g.details?.game_platform?.compatible_device || g.compatible_devices) === this.selectedDevice || this.selectedDevice === '';
      const pegiMatch = this.selectedPegi === '' || String(g.details?.game?.pegi) === this.selectedPegi;
      const genreMatch = this.selectedGenre === '' || g.details?.game?.genre === this.selectedGenre;
      const title = g.details?.game?.title || g.name || g.title || '';
      const searchMatch = this.searchTerm.trim() === '' || title.toLowerCase().includes(this.searchTerm.trim().toLowerCase());
      const sensitive = g.details?.game?.sensitive_content || '';
      const sensitiveList = sensitive.split(',').map((x: string) => x.trim());
      const sensitiveMatch = !this.hiddenSensitive.some(hide => sensitiveList.includes(hide));
      return platformMatch && deviceMatch && pegiMatch && genreMatch && searchMatch && sensitiveMatch;
    });

    // Ajoute le tri ici
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
    this.selectedDevice = '';
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

  getPlatformClass(platform: string): string {
    switch ((platform || '').toLowerCase()) {
      case 'playstation':
        return 'platform-playstation';
      case 'xbox':
        return 'platform-xbox';
      case 'pc':
        return 'platform-pc';
      case 'nintendo':
        return 'platform-nintendo';
      case 'steamdeck':
        return 'platform-steamdeck';
      case 'vr systems':
        return 'platform-vr';
      default:
        return 'platform-default';
    }
  }
}
