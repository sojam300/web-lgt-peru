import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Detalles, Requerimiento } from '../interfaces/requerimiento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequerimientoService {
  private myAppUrl: string;
  private myApiUrl: string;
  // private requerimiento: Requerimiento;
  constructor(private http: HttpClient, private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'requerimiento';
  }
  crearRequerimiento(requerimiento: Requerimiento): Observable<Requerimiento> {
    return this.http.post<Requerimiento>(`${this.myAppUrl}${this.myApiUrl}`, requerimiento);
  }

  editarRequerimiento(id: string, requerimiento: Requerimiento): Observable<Requerimiento> {
    return this.http.put<Requerimiento>(`${this.myAppUrl}${this.myApiUrl}/${id}`, requerimiento);
  }
  buscarRequerimientos(params: HttpParams): Observable<{ data: Requerimiento[]; totalRows: number }> {
    return this.http.get<{ data: Requerimiento[]; totalRows: number }>(`${this.myAppUrl}${this.myApiUrl}`, {
      params: params,
    });
  }
  findRequermientoById(id: string): Observable<Requerimiento> {
    return this.http.get<Requerimiento>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
  addDetalleRequerimiento(detalle: Detalles): Observable<Detalles> {
    return this.http.post<Detalles>(`${this.myAppUrl}${this.myApiUrl}/detalle`, detalle);
  }
  editarDetalleRequerimiento(detalle: Detalles): Observable<Detalles> {
    return this.http.put<Detalles>(`${this.myAppUrl}${this.myApiUrl}/detalle`, detalle);
  }
  eliminarDetalleRequerimiento(id: string): Observable<Detalles> {
    return this.http.delete<Detalles>(`${this.myAppUrl}${this.myApiUrl}/detalle/${id}`);
  }
  patchObsevacionDetalle(id: string, observacion: string): Observable<Requerimiento> {
    return this.http.patch<Requerimiento>(`${this.myAppUrl}${this.myApiUrl}/observacion/${id}`, { observacion });
  }
  patchEstadoRequerimiento(id: string, data: Requerimiento): Observable<Requerimiento> {
    return this.http.patch<Requerimiento>(`${this.myAppUrl}${this.myApiUrl}/estado/${id}`, data);
  }
}
