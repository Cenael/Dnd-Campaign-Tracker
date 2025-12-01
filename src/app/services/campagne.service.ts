import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Campagna } from '../models/campagna';

@Injectable({ providedIn: 'root' })
export class CampagneService {
  private readonly API_URL = 'http://localhost:3000/api/campagne';
  private campagneSubject = new BehaviorSubject<Campagna[]>([]);
  campagne$ = this.campagneSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCampagne();
  }

  // Carica tutte le campagne dal backend
  private loadCampagne() {
    this.http.get<Campagna[]>(this.API_URL).subscribe({
      next: (campagne) => this.campagneSubject.next(campagne),
      error: (err) => console.error('Errore caricamento campagne:', err)
    });
  }

  // Ricarica le campagne (utile dopo operazioni)
  refreshCampagne() {
    this.loadCampagne();
  }

  // Aggiunge una nuova campagna
  addCampagna(c: Omit<Campagna, 'id'>): Observable<Campagna> {
    return this.http.post<Campagna>(this.API_URL, c).pipe(
      tap(() => this.loadCampagne())
    );
  }

  // Ottieni campagna per ID
  getCampagnaById(id: number): Observable<Campagna> {
    return this.http.get<Campagna>(`${this.API_URL}/${id}`);
  }

  // Ottieni campagna per ID dal cache locale (sincrono)
  getCampagnaByIdSync(id: number): Campagna | undefined {
    return this.campagneSubject.value.find(c => c.id === id);
  }

  // Giocatore si unisce alla campagna
  joinCampagna(campagnaId: number, userId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${campagnaId}/join`, { userId }).pipe(
      tap(() => this.loadCampagne())
    );
  }

  // Giocatore lascia la campagna
  leaveCampagna(campagnaId: number, userId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${campagnaId}/leave`, { userId }).pipe(
      tap(() => this.loadCampagne())
    );
  }

  // Elimina campagna (solo GM che l'ha creata)
  deleteCampagna(campagnaId: number, gmId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${campagnaId}`, { 
      body: { gmId } 
    }).pipe(
      tap(() => this.loadCampagne())
    );
  }
}
