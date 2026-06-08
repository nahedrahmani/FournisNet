import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../services/categorie.service';

interface Categorie {
  id?: number;
  nom: string;
}

@Component({
  selector: 'app-categorie-admin',
  templateUrl: './categorie-admin.component.html',
  styleUrls: ['./categorie-admin.component.css']
})
export class CategorieAdminComponent implements OnInit {
  categories: Categorie[] = [];
  newCategorie: Categorie = { nom: '' };
  editingCategorie?: Categorie | null;
  errorMessage: string | null = null;
  deletePending: number | null = null;

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: () => { this.errorMessage = 'Erreur lors du chargement des categories.'; }
    });
  }

  addCategorie(): void {
    if (!this.newCategorie.nom.trim()) return;
    this.categorieService.create(this.newCategorie).subscribe({
      next: () => { this.newCategorie = { nom: '' }; this.loadCategories(); this.errorMessage = null; },
      error: () => { this.errorMessage = 'Erreur lors de l ajout de la categorie.'; }
    });
  }

  remove(id: number): void {
    this.deletePending = id;
  }

  confirmDelete(): void {
    if (this.deletePending == null) return;
    this.categorieService.delete(this.deletePending).subscribe({
      next: () => { this.deletePending = null; this.loadCategories(); },
      error: () => { this.errorMessage = 'Erreur lors de la suppression. La categorie est peut-etre utilisee par des produits.'; }
    });
  }

  cancelDelete(): void {
    this.deletePending = null;
  }

  editCategorie(cat: Categorie): void {
    this.editingCategorie = { ...cat };
  }

  updateCategorie(): void {
    if (this.editingCategorie && this.editingCategorie.id !== undefined) {
      this.categorieService.update(this.editingCategorie.id, this.editingCategorie).subscribe({
        next: () => { this.editingCategorie = undefined; this.loadCategories(); this.errorMessage = null; },
        error: () => { this.errorMessage = 'Erreur lors de la mise a jour de la categorie.'; }
      });
    }
  }

  cancelEdit(): void {
    this.editingCategorie = undefined;
  }
}
