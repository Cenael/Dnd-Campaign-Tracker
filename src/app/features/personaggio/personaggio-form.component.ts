import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonaggiService } from '../../services/personaggi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Personaggio } from '../../models/personaggio';

@Component({
  selector: 'app-personaggio-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>🗡️ Nuovo Personaggio</h2>

      <form [formGroup]="personaggioForm" (ngSubmit)="onSubmit()">

        <label>
          Nome del Personaggio
          <input type="text" formControlName="nome" placeholder="Es: Thorin Manto di Quercia" />
        </label>
        @if (personaggioForm.controls.nome.invalid && personaggioForm.controls.nome.touched) {
          <p class="error">Il nome è obbligatorio</p>
        }

        <div class="form-row">
          <label>
            Classe
            <input type="text" formControlName="classe" placeholder="Es: Guerriero" />
          </label>
          <label>
            Razza
            <input type="text" formControlName="razza" placeholder="Es: Nano" />
          </label>
        </div>
        @if (personaggioForm.controls.classe.invalid && personaggioForm.controls.classe.touched) {
          <p class="error">La classe è obbligatoria</p>
        }
        @if (personaggioForm.controls.razza.invalid && personaggioForm.controls.razza.touched) {
          <p class="error">La razza è obbligatoria</p>
        }

        <label>
          Livello
          <input type="number" formControlName="livello" min="1" />
        </label>
        @if (personaggioForm.controls.livello.invalid && personaggioForm.controls.livello.touched) {
          <p class="error">Il livello è obbligatorio e deve essere ≥1</p>
        }

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="goBack()">Annulla</button>
          <button type="submit" [disabled]="personaggioForm.invalid">Salva Personaggio</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./personaggio-form.component.scss']
})
export class PersonaggioFormComponent {
  personaggioForm;
  campagnaId: number;

  constructor(
    private fb: FormBuilder,
    private ps: PersonaggiService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private userService: UserService
  ) {
    this.campagnaId = Number(this.route.snapshot.paramMap.get('campagnaId'));
    this.personaggioForm = this.fb.group({
      nome: ['', Validators.required],
      classe: ['', Validators.required],
      razza: ['', Validators.required],
      livello: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.personaggioForm.valid) {
      const formValue = this.personaggioForm.value;
      const currentUser = this.userService.currentUser();
      const nuovoPersonaggio: Omit<Personaggio, 'id'> = {
        nome: formValue.nome!,
        classe: formValue.classe!,
        razza: formValue.razza!,
        livello: formValue.livello!,
        campagnaId: this.campagnaId,
        userId: currentUser?.id || 0
      };
      this.ps.addPersonaggio(nuovoPersonaggio).subscribe({
        next: () => this.router.navigate(['/personaggi', this.campagnaId]),
        error: (err) => console.error('Errore salvataggio personaggio:', err)
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
