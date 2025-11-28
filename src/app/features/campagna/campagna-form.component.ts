import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampagneService } from '../../services/campagne.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Campagna } from '../../models/campagna';

@Component({
  selector: 'app-campagna-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>⚔️ Nuova Campagna</h2>

      <form [formGroup]="campagnaForm" (ngSubmit)="onSubmit()">

        <label>
          Nome della Campagna
          <input type="text" formControlName="nome" placeholder="Es: La Minaccia del Drago" />
        </label>
        @if (campagnaForm.controls.nome.invalid && campagnaForm.controls.nome.touched) {
          <p class="error">Il nome è obbligatorio</p>
        }

        <label>
          Descrizione
          <textarea formControlName="descrizione" placeholder="Descrivi la tua campagna..."></textarea>
        </label>
        @if (campagnaForm.controls.descrizione.invalid && campagnaForm.controls.descrizione.touched) {
          <p class="error">La descrizione è obbligatoria</p>
        }

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="goBack()">Annulla</button>
          <button type="submit" [disabled]="campagnaForm.invalid">Salva Campagna</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./campagna-form.component.scss']
})
export class CampagnaFormComponent {
  campagnaForm;

  constructor(
    private fb: FormBuilder,
    private cs: CampagneService,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {
    this.campagnaForm = this.fb.group({
      nome: ['', Validators.required],
      descrizione: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.campagnaForm.valid) {
      const currentUser = this.userService.currentUser();
      const nuovaCampagna: Omit<Campagna, 'id'> = {
        nome: this.campagnaForm.value.nome || '',
        descrizione: this.campagnaForm.value.descrizione || '',
        gmId: currentUser?.id || 0,
        giocatori: []
      };
      this.cs.addCampagna(nuovaCampagna).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Errore salvataggio campagna:', err)
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
