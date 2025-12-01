import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PersonaggiService } from '../../services/personaggi.service';
import { UserService } from '../../services/user.service';
import { CampagneService } from '../../services/campagne.service';
import { Personaggio } from '../../models/personaggio';

@Component({
  selector: 'app-personaggi-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="personaggio-list-container">
      <h2>👥 Personaggi della Campagna</h2>

      @if (personaggi().length === 0) {
        <div class="empty-state">Nessun personaggio presente.</div>
      }

      @for (p of personaggi(); track p.id) {
        <div class="card character-card">
          <div class="character-header">
            @if (p.avatar) {
              <div class="character-avatar">
                <img [src]="p.avatar" [alt]="p.nome" />
              </div>
            }
            <div class="character-title">
              <h3>{{ p.nome }}</h3>
              <span class="level-badge">Liv. {{ p.livello }}</span>
            </div>
          </div>
          
          <div class="character-info">
            <div class="info-row">
              <span class="label">Classe:</span>
              <span class="value">{{ p.classe }}</span>
            </div>
            <div class="info-row">
              <span class="label">Razza:</span>
              <span class="value">{{ p.razza }}</span>
            </div>
            @if (p.background) {
              <div class="info-row">
                <span class="label">Background:</span>
                <span class="value">{{ p.background }}</span>
              </div>
            }
          </div>

          @if (p.abilityScores) {
            <div class="stats-row">
              <div class="stat-mini">
                <span class="stat-label">HP</span>
                <span class="stat-value">{{ p.puntiFerita }}/{{ p.puntiFeritaMax }}</span>
              </div>
              <div class="stat-mini">
                <span class="stat-label">AC</span>
                <span class="stat-value">{{ p.classeArmatura }}</span>
              </div>
              <div class="stat-mini">
                <span class="stat-label">Init</span>
                <span class="stat-value">{{ formatModifier(p.iniziativa) }}</span>
              </div>
              <div class="stat-mini">
                <span class="stat-label">Speed</span>
                <span class="stat-value">{{ p.velocita }}ft</span>
              </div>
            </div>
          }

          <a [routerLink]="['/aggiornamenti', p.campagnaId]">📜 Vedi Aggiornamenti</a>
        </div>
      }

      <div class="actions">
        @if (canAddPersonaggio()) {
          <a [routerLink]="['/personaggi/nuovo', campagnaId]">
            <button class="add-button">+ Aggiungi Personaggio</button>
          </a>
        }
        <a [routerLink]="['/']">
          <button class="btn-secondary">🏠 Torna alla Home</button>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./personaggio-list.component.scss']
})
export class PersonaggioListComponent {
  personaggi = signal<Personaggio[]>([]);
  campagnaId: number;
  user;

  constructor(
    private ps: PersonaggiService,
    private route: ActivatedRoute,
    private userService: UserService,
    private campagneService: CampagneService
  ) {
    this.user = this.userService.currentUser;
    this.campagnaId = Number(this.route.snapshot.paramMap.get('campagnaId'));
    this.loadPersonaggi();
  }

  loadPersonaggi() {
    this.ps.getByCampagna(this.campagnaId).subscribe({
      next: (personaggi) => this.personaggi.set(personaggi),
      error: (err) => console.error('Errore caricamento personaggi:', err)
    });
  }

  canAddPersonaggio(): boolean {
    const currentUser = this.user();
    if (!currentUser) return false;
    
    // Il GM può sempre aggiungere personaggi
    if (currentUser.ruolo === 'GM') return true;
    
    // Il Giocatore può aggiungere solo se partecipa alla campagna
    const campagna = this.campagneService.getCampagnaByIdSync(this.campagnaId);
    return campagna ? campagna.giocatori.includes(currentUser.id) : false;
  }

  formatModifier(value: number | undefined): string {
    if (value === undefined) return '+0';
    return value >= 0 ? `+${value}` : `${value}`;
  }
}
