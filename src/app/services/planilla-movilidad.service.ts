import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { PlanillaMovilidad } from '../interfaces/planilla-movilidad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanillaMovilidadService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'planilla-movilidad';
  }
  crear(planillaMovilidad: PlanillaMovilidad): Observable<PlanillaMovilidad> {
    return this.http.post<PlanillaMovilidad>(`${this.myAppUrl}${this.myApiUrl}`, planillaMovilidad);
  }
  findById(id: string): Observable<PlanillaMovilidad> {
    return this.http.get<PlanillaMovilidad>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
  editarCaja(data: Partial<PlanillaMovilidad>, id: string): Observable<PlanillaMovilidad> {
    return this.http.put<PlanillaMovilidad>(`${this.myAppUrl}${this.myApiUrl}/${id}`, data);
  }
  findAll(): Observable<PlanillaMovilidad[]> {
    return this.http.get<PlanillaMovilidad[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
}
