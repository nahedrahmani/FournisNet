import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  form = { nom: '', email: '', sujet: '', message: '' };
  submitted = false;
  error = false;

  send(): void {
    if (!this.form.nom || !this.form.email || !this.form.message) return;
    // Frontend-only: simulate send
    this.submitted = true;
  }

  reset(): void {
    this.form = { nom: '', email: '', sujet: '', message: '' };
    this.submitted = false;
  }
}