import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GastosViatico } from '../interfaces/gastos-viatico';
import { Gastos, GastosGrupo } from '../interfaces/gastos';

@Injectable({
  providedIn: 'root',
})
export class GastosService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'gastos';
  }

  getAllGastosGrupo1(): Observable<Gastos[]> {
    return this.http.get<Gastos[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  getAllGastosGrupo2byGrupo1(id_grupo: string): Observable<GastosGrupo[]> {
    return this.http.get<GastosGrupo[]>(`${this.myAppUrl}${this.myApiUrl}/grupo2/${id_grupo}`);
  }
  getAllGastosGrupo3byGrupo2(id_grupo: string): Observable<GastosGrupo[]> {
    return this.http.get<GastosGrupo[]>(`${this.myAppUrl}${this.myApiUrl}/grupo3/${id_grupo}`);
  }
}
