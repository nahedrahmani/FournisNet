import { Component, Input } from '@angular/core';
import { Produit } from '../../classes/produit';

@Component({
  selector: 'app-produit-node',
  templateUrl: './produit-node.component.html',
  styleUrls: ['./produit-node.component.css']
})
export class ProduitNodeComponent {
  @Input() node!: Produit;

  // Controls whether the children of this node are visible
  expanded = true;

  get hasChildren(): boolean {
    return !!(this.node.children && this.node.children.length > 0);
  }

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
