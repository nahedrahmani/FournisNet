export interface Categorie {
  id?: number;
  nom: string;
}

export interface Constructeur {
  id?: number;
  nom: string;
}

export interface Fournisseur {
  id?: number;
  nom: string;
}

export interface Produit {
  id?: number;
  nom: string;
  reference: string;
  description: string;
  prix: number;
  parentId?: number | null;
  dateAjout?: string;
  externalId?: number;
  groupNode?: boolean;
  imageUrl?: string;
  quantite?: number;
  quantiteMin?: number;
  // ID fields sent to backend (ProduitDto mapping)
  categorieId?: number | null;
  constructeurId?: number | null;
  fournisseurId?: number | null;
  // Nested objects returned by backend (read-only display)
  categorie?: Categorie;
  constructeur?: Constructeur;
  fournisseur?: Fournisseur;
  children?: Produit[];
}
