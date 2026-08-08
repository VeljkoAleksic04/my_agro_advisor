import { Injectable } from '@angular/core';

const TOKEN_KEY = 'agro_token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  sacuvajToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  ucitajToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  obrisiToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
