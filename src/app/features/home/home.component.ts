import { Component, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <div class="hero-icon">🐉</div>
        <h1>D&D Campaign Tracker</h1>
        <p class="subtitle">Il tuo compagno digitale per avventure epiche</p>
      </div>

      <div class="welcome-card">
        <h2>👋 Benvenuto, {{ user()?.nome || 'Avventuriero' }}!</h2>
        <p class="role-badge" [class.gm-badge]="user()?.ruolo === 'GM'" [class.player-badge]="user()?.ruolo === 'Giocatore'">
          {{ user()?.ruolo || 'Ospite' }}
        </p>
      </div>

      <div class="info-section">
        <h3>📖 Cosa puoi fare qui?</h3>
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🎲</span>
            <h4>Gestisci Campagne</h4>
            <p>Crea e organizza le tue avventure di D&D con descrizioni dettagliate</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">👥</span>
            <h4>Personaggi</h4>
            <p>Tieni traccia di tutti i personaggi con statistiche complete</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">📜</span>
            <h4>Aggiornamenti</h4>
            <p>Documenta le sessioni e gli eventi delle tue campagne</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">⚔️</span>
            <h4>Unisciti</h4>
            <p>Partecipa alle campagne create dai Game Master</p>
          </div>
        </div>
      </div>

      @if (user()) {
        <div class="actions-section">
          <a [routerLink]="['/campagne']" class="action-button primary">
            <span>🗺️</span>
            <span>Tutte le Campagne</span>
          </a>
          <a [routerLink]="['/profilo']" class="action-button secondary">
            <span>👤</span>
            <span>Il Mio Profilo</span>
          </a>
        </div>

        @if (user()?.ruolo === 'GM') {
          <div class="quick-action">
            <a [routerLink]="['/nuova']" class="btn-create-campaign">
              ✨ Crea Nuova Campagna
            </a>
          </div>
        }
      } @else {
        <div class="guest-actions">
          <p class="guest-message">Effettua il login per accedere a tutte le funzionalità</p>
          <a [routerLink]="['/login']" class="action-button primary">
            <span>🔑</span>
            <span>Accedi</span>
          </a>
        </div>
      }
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: Signal<User | null>;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.user = this.userService.currentUser;
  }
}
