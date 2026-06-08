import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../services/produit.service';
import { CategorieService, Categorie } from '../services/categorie.service';
import { FournisseurService } from '../services/fournisseur.service';
import { ConstructeurService, Constructeur } from '../services/constructeur.service';
import { Fournisseur } from '../classes/fournisseur';
import { Produit } from '../classes/produit';

@Component({
  selector: 'app-produit-admin',
  templateUrl: './produit-admin.component.html',
  styleUrls: ['./produit-admin.component.css']
})
export class ProduitAdminComponent implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  fournisseurs: Fournisseur[] = [];
  constructeurs: Constructeur[] = [];

  newProduit: Produit = this.emptyProduit();
  // Selected objects for the add-form dropdowns
  selectedCategorie: Categorie | null = null;
  selectedFournisseur: Fournisseur | null = null;
  selectedConstructeur: Constructeur | null = null;

  editingProduit: Produit | null = null;
  errorMessage: string | null = null;
  deletePending: number | null = null;

  suggesting = false;
  suggestionResult: string | null = null;

  stockEditing: number | null = null;
  stockValue = 0;
  stockMinValue = 5;

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private fournisseurService: FournisseurService,
    private constructeurService: ConstructeurService
  ) {}

  ngOnInit(): void {
    this.load();
    this.categorieService.getAll().subscribe(cats => this.categories = cats);
    this.fournisseurService.getAll().subscribe(f => this.fournisseurs = f);
    this.constructeurService.getAll().subscribe(c => this.constructeurs = c);
  }

  load(): void {
    this.produitService.getAll().subscribe({
      next: (data) => this.produits = data,
      error: () => this.errorMessage = 'Erreur lors du chargement des produits.'
    });
  }

  add(): void {
    if (!this.newProduit.nom || !this.newProduit.reference) {
      this.errorMessage = 'Nom et référence sont obligatoires.';
      return;
    }
    // Map selected dropdown objects to IDs for the backend DTO
    this.newProduit.categorieId    = this.selectedCategorie?.id    ?? null;
    this.newProduit.fournisseurId  = this.selectedFournisseur?.id  ?? null;
    this.newProduit.constructeurId = this.selectedConstructeur?.id ?? null;
    if (!this.newProduit.parentId || this.newProduit.parentId <= 0) {
      this.newProduit.parentId = null;
    }
    this.produitService.create(this.newProduit).subscribe({
      next: () => {
        this.newProduit = this.emptyProduit();
        this.selectedCategorie = null;
        this.selectedFournisseur = null;
        this.selectedConstructeur = null;
        this.suggestionResult = null;
        this.load();
        this.errorMessage = null;
      },
      error: () => this.errorMessage = 'Erreur lors de l\'ajout du produit.'
    });
  }

  suggestCategory(): void {
    const nom = this.newProduit.nom || '';
    const desc = this.newProduit.description || '';
    if (!nom && !desc) {
      this.errorMessage = 'Saisissez un nom ou une description avant de demander une suggestion.';
      return;
    }
    this.suggesting = true;
    this.suggestionResult = null;
    this.produitService.suggestCategory(nom, desc).subscribe({
      next: (res) => {
        this.suggesting = false;
        if (res.suggestion) {
          this.suggestionResult = res.suggestion;
          const match = this.categories.find(c =>
            c.nom.toLowerCase() === res.suggestion.toLowerCase()
          );
          if (match) this.selectedCategorie = match;
        } else {
          this.suggestionResult = 'Ollama non disponible.';
        }
      },
      error: () => {
        this.suggesting = false;
        this.suggestionResult = 'Erreur IA — Ollama peut ne pas être démarré.';
      }
    });
  }

  startEdit(produit: Produit): void {
    this.editingProduit = { ...produit };
    // Pre-populate ID fields from nested objects so select binds by ID (primitives, not references)
    this.editingProduit.categorieId    = produit.categorie?.id    ?? null;
    this.editingProduit.constructeurId = produit.constructeur?.id ?? null;
    this.editingProduit.fournisseurId  = produit.fournisseur?.id  ?? null;
  }

  saveEdit(): void {
    if (!this.editingProduit?.id) return;
    // categorieId/constructeurId/fournisseurId already set by the ID-bound selects
    this.produitService.update(this.editingProduit.id, this.editingProduit).subscribe({
      next: () => { this.editingProduit = null; this.load(); this.errorMessage = null; },
      error: () => this.errorMessage = 'Erreur lors de la mise à jour du produit.'
    });
  }

  cancelEdit(): void {
    this.editingProduit = null;
  }

  remove(id: number): void {
    this.deletePending = id;
  }

  confirmDelete(): void {
    if (this.deletePending == null) return;
    this.produitService.delete(this.deletePending).subscribe({
      next: () => { this.deletePending = null; this.load(); },
      error: () => this.errorMessage = 'Erreur lors de la suppression du produit.'
    });
  }

  cancelDelete(): void {
    this.deletePending = null;
  }

  openStockEdit(produit: Produit): void {
    this.stockEditing = produit.id ?? null;
    this.stockValue = produit.quantite ?? 0;
    this.stockMinValue = produit.quantiteMin ?? 5;
  }

  saveStock(): void {
    if (this.stockEditing == null) return;
    this.produitService.updateStock(this.stockEditing, this.stockValue, this.stockMinValue).subscribe({
      next: () => { this.stockEditing = null; this.load(); },
      error: () => this.errorMessage = 'Erreur lors de la mise à jour du stock.'
    });
  }

  cancelStockEdit(): void {
    this.stockEditing = null;
  }

  isLowStock(p: Produit): boolean {
    return (p.quantite ?? 0) <= (p.quantiteMin ?? 5);
  }

  private emptyProduit(): Produit {
    return { nom: '', prix: 0, reference: '', description: '', parentId: null, quantite: 0, quantiteMin: 5 } as Produit;
  }
}
