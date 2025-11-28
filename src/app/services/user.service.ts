import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Stato globale con signal
  currentUser = signal<User | null>(this.loadFromStorage());

  private loadFromStorage(): User | null {
    if (!this.isBrowser) return null;
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  login(user: User) {
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
