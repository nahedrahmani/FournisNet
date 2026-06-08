import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  username = '';
  password = '';
  fullName = '';
  error: string | null = null;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) this.router.navigate(['/home']);
  }

  submit(): void {
    this.error = null;
    if (!this.username || !this.password) { this.error = 'Veuillez remplir tous les champs.'; return; }
    this.loading = true;

    const obs = this.mode === 'login'
      ? this.auth.login(this.username, this.password)
      : this.auth.register(this.username, this.password, this.fullName);

    obs.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/home']); },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Une erreur est survenue. Verifiez vos identifiants.';
      }
    });
  }

  toggle(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.error = null;
  }
}
