import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule],
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Contact Manager</span>
      <span class="spacer"></span>
      <button *ngIf="authService.isAuthenticated()" 
              mat-button 
              (click)="logout()">
        Déconnexion
      </button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}