import { Component, signal } from '@angular/core';
import { Campagna } from '../../models/campagna';
import { CampagneService } from '../../services/campagne.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-campagne-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Campagne Disponibili</h2>

    @if (campagne().length === 0) {
    <p>Nessuna campagna disponibile.</p>
    } @else { @for (c of campagne(); track c.id) {
    <div class="card">
      <h3>{{ c.nome }}</h3>
      <p>{{ c.descrizione }}</p>
      <a [routerLink]="['/personaggi', c.id]">Personaggi</a> |
      <a [routerLink]="['/aggiornamenti', c.id]">Aggiornamenti</a>
    </div>
    } }
  `,
  styles: [
    `
      .card {
        padding: 12px;
        margin: 8px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      a {
        margin-right: 8px;
      }
    `,
  ],
})
export class CampagneListComponent {
  campagne = signal<Campagna[]>([]);

  constructor(private cs: CampagneService) {
    this.cs.campagne$.subscribe((data) => this.campagne.set(data));
  }
}
