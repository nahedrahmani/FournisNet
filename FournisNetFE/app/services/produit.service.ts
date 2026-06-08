import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../classes/produit';
import { environment } from '../../environments/environment';

export interface PagedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // current page index
  size: number;
}

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private baseUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) {}

  // Paginated endpoint (used by catalogue)
  getPaged(page = 0, size = 12, search = '', categorieId?: number): Observable<PagedResult<Produit>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search);
    if (categorieId != null) params = params.set('categorieId', categorieId);
    return this.http.get<PagedResult<Produit>>(this.baseUrl, { params });
  }

  // Unpaginated endpoint (used by admin tables)
  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.baseUrl}/${id}`);
  }

  create(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.baseUrl, produit);
  }

  update(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.baseUrl}/${id}`, produit);
  }

  updateStock(id: number, quantite: number, quantiteMin?: number): Observable<Produit> {
    const body: any = { quantite };
    if (quantiteMin != null) body['quantiteMin'] = quantiteMin;
    return this.http.patch<Produit>(`${this.baseUrl}/${id}/stock`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  suggestCategory(nom: string, description: string): Observable<{ suggestion: string }> {
    return this.http.post<{ suggestion: string }>(
      `${environment.apiUrl}/ai/suggest-category`,
      { nom, description }
    );
  }
}
