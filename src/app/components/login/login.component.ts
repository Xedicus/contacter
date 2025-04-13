import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  photo = '';
  loading = false;
  isRegisterMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.', 'Fermer', { duration: 3000 });
      return;
    }

    this.loading = true;

    if (this.isRegisterMode) {
      this.authService.register(this.email, this.password, this.photo).subscribe({
        next: () => {
          this.snackBar.open('Inscription réussie ! Connectez-vous.', 'Fermer', { duration: 3000 });
          this.isRegisterMode = false;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          const errorMessage = err.error?.errorMessage || "Erreur lors de l'inscription";
          this.snackBar.open(errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    } else {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          const errorMessage = err.error?.errorMessage || "Email ou mot de passe incorrect";
          this.snackBar.open(errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }
}
