import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categorie {
  id?: number;
  nom: string;
}

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.baseUrl);
  }

  getById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.baseUrl}/${id}`);
  }

  create(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.baseUrl, categorie);
  }

  update(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.baseUrl}/${id}`, categorie);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
