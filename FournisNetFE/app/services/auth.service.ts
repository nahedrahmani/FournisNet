import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  fullName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('fn_token', res.token);
        localStorage.setItem('fn_user', JSON.stringify({ username: res.username, role: res.role, fullName: res.fullName }));
      })
    );
  }

  register(username: string, password: string, fullName: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/register`, { username, password, fullName }).pipe(
      tap(res => {
        localStorage.setItem('fn_token', res.token);
        localStorage.setItem('fn_user', JSON.stringify({ username: res.username, role: res.role, fullName: res.fullName }));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('fn_token');
    localStorage.removeItem('fn_user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('fn_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): { username: string; role: string; fullName: string } | null {
    const u = localStorage.getItem('fn_user');
    return u ? JSON.parse(u) : null;
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'ADMIN';
  }
}
