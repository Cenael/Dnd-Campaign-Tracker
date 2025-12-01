import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export type Role = 'GM' | 'Giocatore';

export interface User {
  id: number;
  nome: string;
  ruolo: Role;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'dnd_current_user';
  private readonly API_URL = 'http://localhost:3000/api/users';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Stato globale con signal
  currentUser = signal<User | null>(this.loadFromStorage());

  constructor(private http: HttpClient) {}

  private loadFromStorage(): User | null {
    if (!this.isBrowser) return null;
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Verifica se nome utente esiste già
  checkUsername(nome: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.API_URL}/check/${nome}`);
  }

  // Login o registrazione utente
  loginOrRegister(nome: string, ruolo: Role): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login`, { nome, ruolo }).pipe(
      tap(user => {
        this.currentUser.set(user);
        if (this.isBrowser) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        }
      })
    );
  }

  // Login locale (fallback se backend non disponibile)
  loginLocal(user: User) {
    this.currentUser.set(user);
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  logout() {
    this.currentUser.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
