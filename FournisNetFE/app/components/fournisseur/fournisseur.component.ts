import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FournisseurService } from '../../services/fournisseur.service';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css']
})
export class FournisseurComponent implements OnInit {
  fournisseurForm!: FormGroup;
  fournisseurs: any[] = [];
  selectedFournisseur: any = null;

  fournisseurTypes = ['PRINCIPAL', 'SOUS_TRAITANT']; // Enum values
  parentsList: any[] = []; // For dropdown of parent fournisseurs

  constructor(private fb: FormBuilder, private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllFournisseurs();
  }

  initializeForm(): void {
    this.fournisseurForm = this.fb.group({
      nom: ['', Validators.required],
      type: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
      parent: [null] // Can be null or a Fournisseur ID
    });
  }

 getAllFournisseurs(): void {
  this.fournisseurService.getAll().subscribe((data) => {
    this.fournisseurs = data;

    // faux
    // this.parentsList = data;

    // seulement ceux qui peuvent être des parents
    this.parentsList = data.filter(f => f.type === 'PRINCIPAL');
  });
}


  saveFournisseur(): void {
    if (this.fournisseurForm.valid) {
      const formValue = this.fournisseurForm.value;

      if (this.selectedFournisseur) {
        this.fournisseurService.update(this.selectedFournisseur.id, formValue).subscribe(() => {
          this.getAllFournisseurs();
          this.resetForm();
        });
      } else {
        this.fournisseurService.create(formValue).subscribe(() => {
          this.getAllFournisseurs();
          this.resetForm();
        });
      }
    } else {
      this.markFormAsTouched();
    }
  }

  selectForUpdate(fournisseur: any): void {
    this.selectedFournisseur = fournisseur;
    this.fournisseurForm.patchValue({
      nom: fournisseur.nom,
      type: fournisseur.type,
      adresse: fournisseur.adresse,
      telephone: fournisseur.telephone,
      parent: fournisseur.parent?.id || null
    });
  }

  cancelUpdate(): void {
    this.resetForm();
  }

  deleteFournisseur(id: number): void {
    if (confirm('Are you sure you want to delete this fournisseur?')) {
      this.fournisseurService.delete(id).subscribe(() => {
        this.getAllFournisseurs();
      });
    }
  }

  private resetForm(): void {
    this.fournisseurForm.reset();
    this.selectedFournisseur = null;
  }

  private markFormAsTouched(): void {
    Object.values(this.fournisseurForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
