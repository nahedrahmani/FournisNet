import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '../classes/fournisseur';
import { FournisseurTreeNode } from '../classes/fournisseur-tree-node';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FournisseurService {
  private baseUrl = `${environment.apiUrl}/fournisseurs`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.baseUrl);
  }

  getTree(): Observable<FournisseurTreeNode[]> {
    return this.http.get<FournisseurTreeNode[]>(`${this.baseUrl}/tree`);
  }

  getById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.baseUrl}/${id}`);
  }

  create(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.baseUrl, fournisseur);
  }

  update(id: number, fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.baseUrl}/${id}`, fournisseur);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
