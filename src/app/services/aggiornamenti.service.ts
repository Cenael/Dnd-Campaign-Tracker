import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aggiornamento } from '../models/aggiornamento';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AggiornamentiService {
  private readonly API_URL = `${environment.apiUrl}/aggiornamenti`;

  constructor(private http: HttpClient) {}

  // Ottieni tutti gli aggiornamenti o filtrati per campagna
  getAll(campagnaId?: number): Observable<Aggiornamento[]> {
    const url = campagnaId ? `${this.API_URL}?campagnaId=${campagnaId}` : this.API_URL;
    return this.http.get<Aggiornamento[]>(url);
  }

  // Filtra aggiornamenti per campagna (sincrono per compatibilità)
  getByCampagna(campagnaId: number): Observable<Aggiornamento[]> {
    return this.getAll(campagnaId);
  }

  // Aggiungi nuovo aggiornamento
  addAggiornamento(a: Omit<Aggiornamento, 'id'>): Observable<Aggiornamento> {
    return this.http.post<Aggiornamento>(this.API_URL, a);
  }
}
