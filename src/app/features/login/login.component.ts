import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-container">
      <h2>Benvenuto</h2>
      <p class="welcome-text">Accedi per gestire le tue avventure</p>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label>
          Nome Avventuriero
          <input type="text" formControlName="nome" placeholder="Inserisci il tuo nome" />
        </label>

        <label>
          Seleziona Ruolo
          <select formControlName="ruolo">
            <option value="Giocatore">Giocatore</option>
            <option value="GM">Game Master (GM)</option>
          </select>
        </label>

        <button type="submit" [disabled]="loginForm.invalid">Inizia l'Avventura</button>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm;

  constructor(private fb: FormBuilder, private us: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      nome: ['', Validators.required],
      ruolo: ['Giocatore', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      this.us.login({
        id: Date.now(), // ID temporaneo
        nome: formValue.nome!,
        ruolo: formValue.ruolo! as 'GM' | 'Giocatore'
      });
      this.router.navigate(['/']); // vai alla lista campagne
    }
  }
}
