import { Component, OnInit } from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { FournisseurTreeNode } from '../classes/fournisseur-tree-node';

@Component({
  selector: 'app-admin-tree',
  templateUrl: './admin-tree.component.html',
  styleUrls: ['./admin-tree.component.css']
})
export class AdminTreeComponent implements OnInit {
  tree: FournisseurTreeNode[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.loadTree();
  }

  loadTree(): void {
    this.loading = true;
    this.errorMessage = null;
    this.fournisseurService.getTree().subscribe({
      next: (data) => { this.tree = data; this.loading = false; },
      error: () => { this.errorMessage = 'Impossible de charger l\'arborescence des fournisseurs.'; this.loading = false; }
    });
  }
}
