import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RecentlyAddedComponent } from './recently-added/recently-added.component';
import { GoComponent } from './go/go.component';
import { SettingsComponent } from './settings/settings.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RecentlyAddedComponent, 
    GoComponent, 
    SettingsComponent, 
    RouterLink, 
    RouterLinkActive,
    PageNotFoundComponent, 
    MatToolbarModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Typescript38';
}
