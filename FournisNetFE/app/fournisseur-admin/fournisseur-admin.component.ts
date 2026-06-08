import { Component, OnInit } from '@angular/core';
import { Fournisseur } from '../classes/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';

@Component({
  selector: 'app-fournisseur-admin',
  templateUrl: './fournisseur-admin.component.html',
  styleUrls: ['./fournisseur-admin.component.css']
})
export class FournisseurAdminComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  newFournisseur: Fournisseur = this.emptyFournisseur();
  editingFournisseur: Fournisseur | null = null;
  errorMessage: string | null = null;

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.fournisseurService.getAll().subscribe({
      next: (data) => this.fournisseurs = data,
      error: () => this.errorMessage = 'Erreur lors du chargement des fournisseurs.'
    });
  }

  add(): void {
    if (!this.newFournisseur.nom || !this.newFournisseur.type) {
      this.errorMessage = 'Nom et type sont obligatoires.';
      return;
    }
    this.fournisseurService.create(this.newFournisseur).subscribe({
      next: () => { this.newFournisseur = this.emptyFournisseur(); this.load(); this.errorMessage = null; },
      error: () => this.errorMessage = 'Erreur lors de l\'ajout du fournisseur.'
    });
  }

  startEdit(f: Fournisseur): void {
    this.editingFournisseur = { ...f };
  }

  saveEdit(): void {
    if (!this.editingFournisseur?.id) return;
    this.fournisseurService.update(this.editingFournisseur.id, this.editingFournisseur).subscribe({
      next: () => { this.editingFournisseur = null; this.load(); this.errorMessage = null; },
      error: () => this.errorMessage = 'Erreur lors de la mise à jour du fournisseur.'
    });
  }

  cancelEdit(): void {
    this.editingFournisseur = null;
  }

  remove(id: number): void {
    this.deletePending = id;
  }

  confirmDelete(): void {
    if (this.deletePending == null) return;
    this.fournisseurService.delete(this.deletePending).subscribe({
      next: () => { this.deletePending = null; this.load(); },
      error: () => this.errorMessage = 'Erreur lors de la suppression du fournisseur.'
    });
  }

  cancelDelete(): void {
    this.deletePending = null;
  }

  deletePending: number | null = null;

  private emptyFournisseur(): Fournisseur {
    return { nom: '', type: 'SOUS_TRAITANT', adresse: '', telephone: '' } as Fournisseur;
  }
}
