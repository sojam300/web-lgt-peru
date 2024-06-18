import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { GastosViatico } from '../interfaces/gastos-viatico';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GastosViaticoService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'gastos-viatico';
  }

  getGastosViatico(): Observable<GastosViatico[]> {
    return this.http.get<GastosViatico[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  getGastosViaticoByCiudad(idCiudad: string): Observable<GastosViatico[]> {
    return this.http.get<GastosViatico[]>(
      `${this.myAppUrl}${this.myApiUrl}/ciudad/${idCiudad}`
    );
  }
}
