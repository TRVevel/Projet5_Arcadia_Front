import { Routes } from '@angular/router';
import { GestionCommandesComponent } from './Commandes/gestion-commandes/gestion-commandes.component';
import { FormulaireComponent } from './Commandes/formulaire/formulaire.component';
import { GestionProduitsComponent } from './Produits/gestion-produits/gestion-produits.component';
import { FormulaireProduitComponent } from './Produits/formulaire-produit/formulaire-produit.component';
import { GestionClientsComponent } from './Clients/gestion-clients/gestion-clients.component';
import { FormulaireClientComponent } from './Clients/formulaire-client/formulaire-client.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path:'orders',
        component: GestionCommandesComponent,
        pathMatch: 'full'

    },
    {
        path:'form',
        component: FormulaireComponent,
        pathMatch: 'full'

    },{
        path:'games',
        component: GestionProduitsComponent,
        pathMatch: 'full'

    },
    {
        path:'game-form',
        component: FormulaireProduitComponent,
        pathMatch: 'full'

    },
    {
        path:'customers',
        component: GestionClientsComponent,
        pathMatch: 'full'

    },
    {
        path:'customer-form',
        component: FormulaireClientComponent,
        pathMatch: 'full'

    },
    
    
];
