import { Routes } from '@angular/router';
import { GoComponent } from './go/go.component';
import { RecentlyAddedComponent } from './recently-added/recently-added.component';
import { SettingsComponent } from './settings/settings.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {path: 'go', component: GoComponent},
    {path: 'recently-added', component: RecentlyAddedComponent},
    {path: 'settings', component: SettingsComponent},
    {path: '', redirectTo: '/recently-added', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent},
];
