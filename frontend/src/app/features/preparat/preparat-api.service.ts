import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Preparat } from '../../core/models/domain.models';

@Injectable({ providedIn: 'root' })
export class PreparatApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/preparati`;

  ucitajSve(): Observable<Preparat[]> {
    return this.http.get<Preparat[]>(this.baseUrl);
  }
}
