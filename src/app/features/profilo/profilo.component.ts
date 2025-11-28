import { Component, signal, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { CampagneService } from '../../services/campagne.service';
import { Campagna } from '../../models/campagna';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="profilo-container">
      <div class="profile-header">
        <div class="avatar">{{ getInitials() }}</div>
        <div class="user-info">
          <h1>{{ user()?.nome }}</h1>
          <span class="role-badge" [class.gm-badge]="user()?.ruolo === 'GM'" [class.player-badge]="user()?.ruolo === 'Giocatore'">
            {{ user()?.ruolo }}
          </span>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-number">{{ getMyCampagnesCount() }}</div>
          <div class="stat-label">
            {{ user()?.ruolo === 'GM' ? 'Campagne Create' : 'Campagne Partecipate' }}
          </div>
        </div>
      </div>

      @if (user()?.ruolo === 'GM') {
        <div class="campaigns-section">
          <h2>🎲 Le Mie Campagne (Game Master)</h2>
          @if (getCreatedCampagnes().length === 0) {
            <div class="empty-state">
              <p>Non hai ancora creato campagne.</p>
              <a [routerLink]="['/nuova']">
                <button class="btn-primary">Crea la tua prima campagna</button>
              </a>
            </div>
          } @else {
            <div class="campaigns-grid">
              @for (campagna of getCreatedCampagnes(); track campagna.id) {
                <div class="campaign-card">
                  <h3>{{ campagna.nome }}</h3>
                  <p class="description">{{ campagna.descrizione }}</p>
                  <div class="campaign-meta">
                    <span class="badge">👥 {{ campagna.giocatori.length }} giocatori</span>
                  </div>
                  <a [routerLink]="['/campagna', campagna.id]" class="view-link">
                    Vai alla campagna →
                  </a>
                </div>
              }
            </div>
          }
        </div>
      }

      @if (user()?.ruolo === 'Giocatore') {
        <div class="campaigns-section">
          <h2>⚔️ Campagne a cui Partecipo</h2>
          @if (getJoinedCampagnes().length === 0) {
            <div class="empty-state">
              <p>Non ti sei ancora unito a nessuna campagna.</p>
              <a [routerLink]="['/campagne']">
                <button class="btn-primary">Esplora le campagne disponibili</button>
              </a>
            </div>
          } @else {
            <div class="campaigns-grid">
              @for (campagna of getJoinedCampagnes(); track campagna.id) {
                <div class="campaign-card">
                  <h3>{{ campagna.nome }}</h3>
                  <p class="description">{{ campagna.descrizione }}</p>
                  <div class="campaign-meta">
                    <span class="badge">👥 {{ campagna.giocatori.length }} giocatori</span>
                  </div>
                  <a [routerLink]="['/campagna', campagna.id]" class="view-link">
                    Vai alla campagna →
                  </a>
                </div>
              }
            </div>
          }
        </div>
      }

      <div class="actions">
        <a [routerLink]="['/']">
          <button class="btn-secondary">🏠 Torna alla Home</button>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./profilo.component.scss']
})
export class ProfiloComponent {
  user: Signal<User | null>;
  campagne = signal<Campagna[]>([]);

  constructor(
    private userService: UserService,
    private campagneService: CampagneService,
    private router: Router
  ) {
    this.user = this.userService.currentUser;

    // Redirect al login se non autenticato
    if (!this.user()) {
      this.router.navigate(['/login']);
      return;
    }

    // Carica le campagne
    this.campagneService.campagne$.subscribe(campagne => {
      this.campagne.set(campagne);
    });
  }

  getInitials(): string {
    const nome = this.user()?.nome || '';
    return nome.charAt(0).toUpperCase();
  }

  getCreatedCampagnes(): Campagna[] {
    const userId = this.user()?.id;
    if (!userId) return [];
    return this.campagne().filter(c => c.gmId === userId);
  }

  getJoinedCampagnes(): Campagna[] {
    const userId = this.user()?.id;
    if (!userId) return [];
    return this.campagne().filter(c => c.giocatori.includes(userId));
  }

  getMyCampagnesCount(): number {
    return this.user()?.ruolo === 'GM' 
      ? this.getCreatedCampagnes().length 
      : this.getJoinedCampagnes().length;
  }
}
