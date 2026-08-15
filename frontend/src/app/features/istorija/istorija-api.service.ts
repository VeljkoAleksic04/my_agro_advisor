import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IstorijaParcele } from '../../core/models/domain.models';

@Injectable({ providedIn: 'root' })
export class IstorijaApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/istorija`;

  ucitaj(godina?: number): Observable<IstorijaParcele[]> {
    let params = new HttpParams();
    if (godina) {
      params = params.set('godina', godina);
    }
    return this.http.get<IstorijaParcele[]>(this.baseUrl, { params });
  }
}
