import { Injectable } from '@angular/core';  // ← promeni import
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({                    // ← promeni @Service u @Injectable
  providedIn: 'root'
})
export class AuthService {       // ← klasa ostaje ista
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}  // ← konstruktor sada radi

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ access_token: string }>(
      `${this.apiUrl}/login`,
      { username, password }
    ).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}