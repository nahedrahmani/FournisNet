import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produit } from '../../classes/produit';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-arborescence',
  templateUrl: './arborescence.component.html',
  styleUrls: ['./arborescence.component.css']
})
export class ArborescenceComponent implements OnInit {
  // The tree: root nodes returned by GET /api/arbo; each node has nested children
  tree: Produit[] = [];

  // Catalog import (TSV, 4-level hierarchy)
  catalogFile: File | null = null;
  catalogLoading = false;

  // Legacy import (simple CSV)
  legacyFile: File | null = null;
  legacyLoading = false;

  treeLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private arboUrl = `${environment.apiUrl}/arbo`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTree();
  }

  loadTree(): void {
    this.treeLoading = true;
    this.errorMessage = null;
    this.http.get<Produit[]>(this.arboUrl).subscribe({
      next: (data) => { this.tree = data; this.treeLoading = false; },
      error: () => { this.errorMessage = 'Erreur lors du chargement de l\'arborescence.'; this.treeLoading = false; }
    });
  }

  // ── Catalog upload (TSV, 4-level group hierarchy) ────────────────────────

  onCatalogFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.catalogFile = input.files?.[0] ?? null;
  }

  uploadCatalog(): void {
    if (!this.catalogFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier TSV.';
      return;
    }
    this.catalogLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formData = new FormData();
    formData.append('file', this.catalogFile);

    this.http.post<Produit[]>(`${this.arboUrl}/upload-catalog`, formData).subscribe({
      next: (roots) => {
        this.catalogLoading = false;
        this.catalogFile = null;
        this.successMessage = `Catalogue importé avec succès — ${roots.length} catégorie(s) racine créées.`;
        this.loadTree();
      },
      error: () => {
        this.catalogLoading = false;
        this.errorMessage = 'Erreur lors de l\'import du catalogue.';
      }
    });
  }

  // ── Legacy upload (CSV: id,nom,category,parentId) ────────────────────────

  onLegacyFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.legacyFile = input.files?.[0] ?? null;
  }

  uploadLegacy(): void {
    if (!this.legacyFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier CSV.';
      return;
    }
    this.legacyLoading = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('file', this.legacyFile);

    this.http.post<Produit[]>(`${this.arboUrl}/upload`, formData).subscribe({
      next: () => { this.legacyLoading = false; this.legacyFile = null; this.loadTree(); },
      error: () => { this.legacyLoading = false; this.errorMessage = 'Erreur lors de l\'import du fichier.'; }
    });
  }
}
