import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personaggio } from '../models/personaggio';

@Injectable({ providedIn: 'root' })
export class PersonaggiService {
  private readonly API_URL = 'http://localhost:3000/api/personaggi';

  constructor(private http: HttpClient) {}

  // Ottieni tutti i personaggi o filtrati per campagna
  getAll(campagnaId?: number): Observable<Personaggio[]> {
    const url = campagnaId ? `${this.API_URL}?campagnaId=${campagnaId}` : this.API_URL;
    return this.http.get<Personaggio[]>(url);
  }

  // Filtra personaggi per campagna (sincrono per compatibilità)
  getByCampagna(campagnaId: number): Observable<Personaggio[]> {
    return this.getAll(campagnaId);
  }

  // Aggiungi nuovo personaggio
  addPersonaggio(p: Omit<Personaggio, 'id'>): Observable<Personaggio> {
    return this.http.post<Personaggio>(this.API_URL, p);
  }

  // Ottieni singolo personaggio
  getById(id: number): Observable<Personaggio> {
    return this.http.get<Personaggio>(`${this.API_URL}/${id}`);
  }

  // Modifica personaggio esistente
  updatePersonaggio(id: number, p: Partial<Personaggio>): Observable<Personaggio> {
    return this.http.put<Personaggio>(`${this.API_URL}/${id}`, p);
  }

  // Elimina personaggio
  deletePersonaggio(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
