export interface FournisseurTreeNode {
  id: number;
  nom: string;
  email?: string;
  adresse?: string;
  telephone?: string;
  type?: string;
  children: FournisseurTreeNode[];
}
