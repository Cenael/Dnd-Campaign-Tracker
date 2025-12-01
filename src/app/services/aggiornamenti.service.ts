import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aggiornamento } from '../models/aggiornamento';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AggiornamentiService {
  private readonly API_URL = `${environment.apiUrl}/aggiornamenti`;

  constructor(private http: HttpClient) {}

  getAll(campagnaId?: number): Observable<Aggiornamento[]> {
    const url = campagnaId ? `${this.API_URL}?campagnaId=${campagnaId}` : this.API_URL;
    return this.http.get<Aggiornamento[]>(url);
  }

  getByCampagna(campagnaId: number): Observable<Aggiornamento[]> {
    return this.getAll(campagnaId);
  }

  addAggiornamento(a: Omit<Aggiornamento, 'id'>): Observable<Aggiornamento> {
    return this.http.post<Aggiornamento>(this.API_URL, a);
  }
}
