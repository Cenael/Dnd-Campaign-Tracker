import { Component, signal } from '@angular/core';
import { Campagna } from '../../models/campagna';
import { CampagneService } from '../../services/campagne.service';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-campagne-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="campagna-list-container">
      <h2>Campagne Disponibili</h2>

      @if (user()?.ruolo === 'GM') {
        <a [routerLink]="['/nuova']">
          <button class="add-campagna-btn">+ Nuova Campagna</button>
        </a>
      }

      @if (campagne().length === 0) {
        <div class="empty-state">Nessuna campagna disponibile.</div>
      } @else {
        @for (c of campagne(); track c.id) {
          <div class="card">
            <h3>{{ c.nome }}</h3>
            <p>{{ c.descrizione }}</p>
            <div class="card-meta">
              <span class="players-count">👥 {{ c.giocatori.length }} giocatori</span>
            </div>
            <div class="card-links">
              <a [routerLink]="['/campagna', c.id]" class="btn-detail">📖 Dettagli</a>
              <a [routerLink]="['/personaggi', c.id]">👥 Personaggi</a>
              <a [routerLink]="['/aggiornamenti', c.id]">📜 Aggiornamenti</a>
            </div>
          </div>
        }
      }
    </div>
  `,
  styleUrls: ['./campagna-list.component.scss']
})
export class CampagnaListComponent {
  campagne = signal<Campagna[]>([]);
  user;

  constructor(private cs: CampagneService, private userService: UserService) {
    this.user = this.userService.currentUser;
    // sottoscrizione ai dati reattivi
    this.cs.campagne$.subscribe(data => this.campagne.set(data));
  }
}
