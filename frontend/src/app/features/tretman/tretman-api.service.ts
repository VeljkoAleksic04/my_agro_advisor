import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tretman } from '../../core/models/domain.models';

export interface NoviTretman {
  parcelaId: number;
  biljkaId?: number;
  preparatId: number;
  doza: string;
}

@Injectable({ providedIn: 'root' })
export class TretmanApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tretmani`;

  kreiraj(dto: NoviTretman): Observable<Tretman> {
    return this.http.post<Tretman>(this.baseUrl, dto);
  }
}
