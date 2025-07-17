import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { GamePlatDetailsComponent } from './game-plat-details/game-plat-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { Customer } from './models/Customer';
import { CustomerProfilComponent } from './customer-profil/customer-profil.component';
import { BasketComponent } from './basket/basket.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },{
        path: 'auth',
        component: AuthComponent,
    },{
        path: 'home',
        component: HomeComponent,
    },{
        path: 'home/game-plat-details/:id',
        component: GamePlatDetailsComponent
    },{
        path: 'basket',
        component: BasketComponent
    },
    {
        path: 'profil',
        component: CustomerProfilComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
