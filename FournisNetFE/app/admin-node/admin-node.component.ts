import { Component, Input } from '@angular/core';
import { FournisseurTreeNode } from '../classes/fournisseur-tree-node';

@Component({
  selector: 'app-admin-node',
  templateUrl: './admin-node.component.html',
  styleUrls: ['./admin-node.component.css']
})
export class AdminNodeComponent {
  @Input() node!: FournisseurTreeNode;
  expanded = true;

  get hasChildren(): boolean {
    return this.node.children && this.node.children.length > 0;
  }

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
