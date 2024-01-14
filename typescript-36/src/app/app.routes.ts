import { Routes } from '@angular/router';

export const routes: Routes = [    
    {path: 'go', loadComponent: () => import('./go/go.component').then((m) => m.GoComponent)},
    {path: 'recently-added', loadComponent: () => import('./recently-added/recently-added.component').then((m) => m.RecentlyAddedComponent)},
    {path: 'settings', loadComponent: () => import('./settings/settings.component').then((m) => m.SettingsComponent)},
    {path: '', redirectTo: '/recently-added', pathMatch: 'full'},
    {path: '**', loadComponent: () => import('./page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent)},
];
