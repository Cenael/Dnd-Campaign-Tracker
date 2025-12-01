import { Component, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-container">
      <h2>Benvenuto</h2>
      <p class="welcome-text">Accedi per gestire le tue avventure</p>
      
      @if (errorMessage()) {
        <div class="error-message">
          {{ errorMessage() }}
        </div>
      }

      @if (successMessage()) {
        <div class="success-message">
          {{ successMessage() }}
        </div>
      }
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label>
          Nome Avventuriero
          <input 
            type="text" 
            formControlName="nome" 
            placeholder="Inserisci il tuo nome"
            (blur)="onNomeBlur()" />
          @if (usernameStatus() === 'checking') {
            <span class="checking">Controllo disponibilità...</span>
          }
          @if (usernameStatus() === 'exists') {
            <span class="info-message">✓ Nome esistente - verrà effettuato il login</span>
          }
          @if (usernameStatus() === 'available') {
            <span class="info-message">✓ Nome disponibile - verrà creato un nuovo account</span>
          }
        </label>

        <label>
          Seleziona Ruolo
          <select formControlName="ruolo">
            <option value="Giocatore">Giocatore</option>
            <option value="GM">Game Master (GM)</option>
          </select>
        </label>

        <button 
          type="submit" 
          [disabled]="loginForm.invalid || isLoading()">
          @if (isLoading()) {
            Caricamento...
          } @else {
            Inizia l'Avventura
          }
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm;
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  usernameStatus = signal<'idle' | 'checking' | 'exists' | 'available'>('idle');

  constructor(private fb: FormBuilder, private us: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      ruolo: ['Giocatore', Validators.required]
    });
  }

  onNomeBlur() {
    const nome = this.loginForm.get('nome')?.value;
    if (nome && nome.length >= 3) {
      this.usernameStatus.set('checking');
      this.us.checkUsername(nome).subscribe({
        next: (result) => {
          this.usernameStatus.set(result.exists ? 'exists' : 'available');
        },
        error: (err) => {
          console.error('Errore controllo username:', err);
          this.usernameStatus.set('idle');
        }
      });
    }
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const formValue = this.loginForm.value;
      const nome = formValue.nome!;
      const ruolo = formValue.ruolo! as 'GM' | 'Giocatore';

      this.us.loginOrRegister(nome, ruolo).subscribe({
        next: (user) => {
          this.isLoading.set(false);
          this.successMessage.set('Login effettuato con successo!');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 500);
        },
        error: (err) => {
          this.isLoading.set(false);
          
          if (err.status === 409) {
            // Utente esiste con ruolo diverso
            this.errorMessage.set(
              `Il nome "${nome}" è già registrato come ${err.error.existingRole}. ` +
              `Per favore scegli un altro nome o seleziona il ruolo corretto.`
            );
          } else {
            this.errorMessage.set('Errore durante il login. Riprova.');
          }
        }
      });
    }
  }
}
