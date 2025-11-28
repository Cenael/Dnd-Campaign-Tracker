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
        <div class="card">
          <h3>{{ p.nome }}</h3>
          <div class="character-info">
            <span class="stat">Classe: {{ p.classe }}</span>
            <span class="stat">Razza: {{ p.razza }}</span>
            <span class="stat">Livello: {{ p.livello }}</span>
          </div>
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
}
