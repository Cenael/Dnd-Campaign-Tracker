import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CampagneService } from '../../services/campagne.service';
import { UserService } from '../../services/user.service';
import { Campagna } from '../../models/campagna';
import { Location } from '@angular/common';

@Component({
  selector: 'app-campagna-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './campagna-detail.component.html',
  styleUrls: ['./campagna-detail.component.scss']
})
export class CampagnaDetailComponent {
  campagna = signal<Campagna | undefined>(undefined);
  user;
  campagnaId: number;

  constructor(
    private cs: CampagneService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.user = this.userService.currentUser;
    this.campagnaId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCampagna();

    // Subscribe to updates
    this.cs.campagne$.subscribe(() => {
      this.loadCampagna();
    });
  }

  loadCampagna() {
    this.cs.getCampagnaById(this.campagnaId).subscribe({
      next: (c) => this.campagna.set(c),
      error: (err) => console.error('Errore caricamento campagna:', err)
    });
  }

  isGM(): boolean {
    return this.campagna()?.gmId === this.user()?.id;
  }

  isJoined(): boolean {
    const currentUserId = this.user()?.id;
    return currentUserId ? this.campagna()?.giocatori.includes(currentUserId) || false : false;
  }

  joinCampagna() {
    const currentUserId = this.user()?.id;
    if (currentUserId && this.campagna()) {
      this.cs.joinCampagna(this.campagnaId, currentUserId).subscribe({
        next: () => this.loadCampagna(),
        error: (err) => console.error('Errore join campagna:', err)
      });
    }
  }

  leaveCampagna() {
    const currentUserId = this.user()?.id;
    if (currentUserId && this.campagna()) {
      this.cs.leaveCampagna(this.campagnaId, currentUserId).subscribe({
        next: () => this.loadCampagna(),
        error: (err) => console.error('Errore leave campagna:', err)
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
