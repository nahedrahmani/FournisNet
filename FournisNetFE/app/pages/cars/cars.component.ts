import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProduitService, PagedResult } from '../../services/produit.service';
import { CategorieService, Categorie } from '../../services/categorie.service';
import { Produit } from '../../classes/produit';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit, OnDestroy {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  loading = true;
  error = false;

  searchQuery = '';
  activeCategorieId: number | undefined = undefined;

  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  totalElements = 0;

  private searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.categorieService.getAll().subscribe(cats => this.categories = cats);
    this.searchSub = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.load();
    });
    this.load();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.produitService.getPaged(this.currentPage, this.pageSize, this.searchQuery, this.activeCategorieId).subscribe({
      next: (page: PagedResult<Produit>) => {
        this.produits = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  setCategory(id: number | undefined): void {
    this.activeCategorieId = id;
    this.currentPage = 0;
    this.load();
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  prevPage(): void {
    if (this.currentPage > 0) { this.currentPage--; this.load(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) { this.currentPage++; this.load(); }
  }

  goToPage(p: number): void {
    this.currentPage = p;
    this.load();
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const cur = this.currentPage;
    const pages: number[] = [];
    const start = Math.max(0, cur - 2);
    const end = Math.min(total - 1, cur + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  stockStatus(p: Produit): 'ok' | 'low' | 'out' {
    const q = p.quantite ?? 0;
    const min = p.quantiteMin ?? 5;
    if (q === 0) return 'out';
    if (q <= min) return 'low';
    return 'ok';
  }

  getIcon(p: Produit): string {
    const nom = (p.nom || '').toLowerCase();
    if (nom.includes('moteur'))      return 'bi-gear-wide-connected';
    if (nom.includes('alternateur')) return 'bi-lightning-charge';
    if (nom.includes('radiateur') || nom.includes('refroid')) return 'bi-thermometer-snow';
    if (nom.includes('filtre'))      return 'bi-funnel';
    if (nom.includes('frein') || nom.includes('disque')) return 'bi-circle';
    if (nom.includes('batterie'))    return 'bi-battery-charging';
    if (nom.includes('pneu') || nom.includes('roue')) return 'bi-circle-fill';
    if (nom.includes('amortisseur') || nom.includes('ressort')) return 'bi-arrows-vertical';
    return 'bi-tools';
  }

  getGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg,#1a1a3e,#e63946)',
      'linear-gradient(135deg,#ff6b35,#f7931e)',
      'linear-gradient(135deg,#0a9396,#94d2bd)',
      'linear-gradient(135deg,#606c38,#dda15e)',
      'linear-gradient(135deg,#2d1b69,#e63946)',
      'linear-gradient(135deg,#1a1a3e,#0a9396)',
    ];
    return gradients[index % gradients.length];
  }
}
