export interface Fournisseur {
  id?: number;
  nom: string;
  email?: string;
  type: string;
  adresse: string;
  telephone: string;
  parentId?: number | null;
}
