import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { 
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'contacts/new',
    loadComponent: () => import('./components/contact-form/contact-form.component').then(m => m.ContactFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'contacts/:id',
    loadComponent: () => import('./components/contact-details/contact-details.component').then(m => m.ContactDetailsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'contacts/:id/edit',
    loadComponent: () => import('./components/contact-form/contact-form.component').then(m => m.ContactFormComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
