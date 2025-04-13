import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    photo: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://www.api.4gul.kanemia.com';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
       
        console.log('Réponse login brute :', response);

        const token = response.token || response.user?.token; 
        const user = response.user || response;

        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          console.warn('Token ou user manquant dans la réponse');
        }
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  checkTokenValidity(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/auth/check-token`,
      null,
      { headers: { Authorization: this.getAuthorizationHeader() } }
    );
  }

  getAuthorizationHeader(): string {
    const token = localStorage.getItem('token');
    console.log('Token utilisé pour l’appel API :', token);
    return token ? `Bearer ${token}` : '';
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  register(email: string, password: string, photo: string = ''): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users`, {
      email,
      password,
      photo
    });
  }
}
