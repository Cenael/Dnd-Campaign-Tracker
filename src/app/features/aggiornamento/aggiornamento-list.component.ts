import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AggiornamentiService } from '../../services/aggiornamenti.service';
import { UserService } from '../../services/user.service';
import { Aggiornamento } from '../../models/aggiornamento';

@Component({
  selector: 'app-aggiornamenti-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="aggiornamento-list-container">
      <h2>📜 Aggiornamenti della Campagna</h2>

      @if (aggiornamenti().length === 0) {
        <div class="empty-state">Nessun aggiornamento presente.</div>
      }

      @for (a of aggiornamenti(); track a) {
        <div class="card">
          <p>{{ a.testo }}</p>
        </div>
      }

      <div class="actions">
        @if (user()?.ruolo === 'GM') {
          <a [routerLink]="['/aggiornamenti/nuovo', campagnaId]">
            <button class="add-button">+ Aggiungi Aggiornamento</button>
          </a>
        }
        <a [routerLink]="['/']">
          <button class="btn-secondary">🏠 Torna alla Home</button>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./aggiornamento-list.component.scss']
})
export class AggiornamentoListComponent {
  aggiornamenti = signal<Aggiornamento[]>([]);
  campagnaId: number;
  user;

  constructor(
    private as: AggiornamentiService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.user = this.userService.currentUser;
    this.campagnaId = Number(this.route.snapshot.paramMap.get('campagnaId'));
    this.loadAggiornamenti();
  }

  loadAggiornamenti() {
    this.as.getByCampagna(this.campagnaId).subscribe({
      next: (aggiornamenti) => this.aggiornamenti.set(aggiornamenti),
      error: (err) => console.error('Errore caricamento aggiornamenti:', err)
    });
  }
}
