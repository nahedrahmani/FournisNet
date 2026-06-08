import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Stats {
  fournisseurs: number;
  produits: number;
  categories: number;
  constructeurs: number;
  alertesStock: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  stats: Stats | null = null;
  loading = true;
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Stats>(`${environment.apiUrl}/stats`).subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }
}
