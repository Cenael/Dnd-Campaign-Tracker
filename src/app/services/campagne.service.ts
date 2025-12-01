import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Campagna } from '../models/campagna';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CampagneService {
  private readonly API_URL = `${environment.apiUrl}/campagne`;
  private campagneSubject = new BehaviorSubject<Campagna[]>([]);
  campagne$ = this.campagneSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCampagne();
  }

  private loadCampagne() {
    this.http.get<Campagna[]>(this.API_URL).subscribe({
      next: (campagne) => this.campagneSubject.next(campagne),
      error: (err) => console.error('Errore caricamento campagne:', err),
    });
  }

  refreshCampagne() {
    this.loadCampagne();
  }

  addCampagna(c: Omit<Campagna, 'id'>): Observable<Campagna> {
    return this.http.post<Campagna>(this.API_URL, c).pipe(tap(() => this.loadCampagne()));
  }

  getCampagnaById(id: number): Observable<Campagna> {
    return this.http.get<Campagna>(`${this.API_URL}/${id}`);
  }

  getCampagnaByIdSync(id: number): Campagna | undefined {
    return this.campagneSubject.value.find((c) => c.id === id);
  }

  joinCampagna(campagnaId: number, userId: number): Observable<any> {
    return this.http
      .post(`${this.API_URL}/${campagnaId}/join`, { userId })
      .pipe(tap(() => this.loadCampagne()));
  }

  leaveCampagna(campagnaId: number, userId: number): Observable<any> {
    return this.http
      .post(`${this.API_URL}/${campagnaId}/leave`, { userId })
      .pipe(tap(() => this.loadCampagne()));
  }

  deleteCampagna(campagnaId: number, gmId: number): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/${campagnaId}`, {
        body: { gmId },
      })
      .pipe(tap(() => this.loadCampagne()));
  }
}
