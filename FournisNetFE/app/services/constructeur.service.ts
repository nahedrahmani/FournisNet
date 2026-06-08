import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Constructeur {
  id?: number;
  nom: string;
}

@Injectable({ providedIn: 'root' })
export class ConstructeurService {
  private baseUrl = `${environment.apiUrl}/constructeurs`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Constructeur[]> {
    return this.http.get<Constructeur[]>(this.baseUrl);
  }
}
