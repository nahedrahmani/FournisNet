import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public auth: AuthService,
    public lang: LanguageService,
    private router: Router
  ) {}

  logout(): void {
    this.auth.logout();
  }
}
