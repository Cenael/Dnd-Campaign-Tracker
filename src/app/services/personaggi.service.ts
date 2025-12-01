import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personaggio } from '../models/personaggio';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonaggiService {
  private readonly API_URL = `${environment.apiUrl}/personaggi`;

  constructor(private http: HttpClient) {}

  getAll(campagnaId?: number): Observable<Personaggio[]> {
    const url = campagnaId ? `${this.API_URL}?campagnaId=${campagnaId}` : this.API_URL;
    return this.http.get<Personaggio[]>(url);
  }

  getByCampagna(campagnaId: number): Observable<Personaggio[]> {
    return this.getAll(campagnaId);
  }

  addPersonaggio(p: Omit<Personaggio, 'id'>): Observable<Personaggio> {
    return this.http.post<Personaggio>(this.API_URL, p);
  }

  getById(id: number): Observable<Personaggio> {
    return this.http.get<Personaggio>(`${this.API_URL}/${id}`);
  }

  updatePersonaggio(id: number, p: Partial<Personaggio>): Observable<Personaggio> {
    return this.http.put<Personaggio>(`${this.API_URL}/${id}`, p);
  }

  deletePersonaggio(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
