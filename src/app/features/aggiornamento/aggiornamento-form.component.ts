import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AggiornamentiService } from '../../services/aggiornamenti.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Aggiornamento } from '../../models/aggiornamento';

@Component({
  selector: 'app-aggiornamento-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>📜 Nuovo Aggiornamento</h2>

      <form [formGroup]="aggiornamentoForm" (ngSubmit)="onSubmit()">

        <label>
          Descrivi l'aggiornamento
          <textarea formControlName="testo" placeholder="Racconta cosa è successo nella sessione..."></textarea>
        </label>
        @if (aggiornamentoForm.controls.testo.invalid && aggiornamentoForm.controls.testo.touched) {
          <p class="error">Il testo è obbligatorio</p>
        }

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="goBack()">Annulla</button>
          <button type="submit" [disabled]="aggiornamentoForm.invalid">Salva Aggiornamento</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./aggiornamento-form.component.scss']
})
export class AggiornamentoFormComponent {
  aggiornamentoForm;
  campagnaId: number;

  constructor(
    private fb: FormBuilder,
    private as: AggiornamentiService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.campagnaId = Number(this.route.snapshot.paramMap.get('campagnaId'));
    this.aggiornamentoForm = this.fb.group({
      testo: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.aggiornamentoForm.valid) {
      const nuovoAggiornamento: Omit<Aggiornamento, 'id'> = {
        testo: this.aggiornamentoForm.value.testo!,
        campagnaId: this.campagnaId
      };
      this.as.addAggiornamento(nuovoAggiornamento).subscribe({
        next: () => this.router.navigate(['/aggiornamenti', this.campagnaId]),
        error: (err) => console.error('Errore salvataggio aggiornamento:', err)
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
