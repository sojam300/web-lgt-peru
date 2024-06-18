import { Injectable } from '@angular/core';
import { Liquidacion } from '../interfaces/liquidacion';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService {
  private myAppUrl: string;
  private myApiUrl: string;
  // private requerimiento: Requerimiento;
  constructor(private http: HttpClient, private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'caja-detalle';
  }
  guardar() {
    // console.log(this.id_caja);
    console.log('GUARDANDO LIQUIDACION');
  }
  crearLiquidacion(liquidacion: Liquidacion): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.myAppUrl}${this.myApiUrl}`, liquidacion);
  }
  editarLiquidacion(liquidacion: Liquidacion, id_liquidacion: string): Observable<Liquidacion> {
    return this.http.put<Liquidacion>(`${this.myAppUrl}${this.myApiUrl}/${id_liquidacion}`, liquidacion);
  }
  updateArchivos(liquidacion: Liquidacion, id_liquidacion: string): Observable<Liquidacion> {
    return this.http.put<Liquidacion>(`${this.myAppUrl}${this.myApiUrl}/archivos/${id_liquidacion}`, liquidacion);
  }
  findLiquidaciones(): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  findLiquidacionesByQuery(params: HttpParams): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(`${this.myAppUrl}${this.myApiUrl}`, {
      params: params,
    });
  }
  findLiquidacionesByRequerimiento(id_requerimiento: string): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(`${this.myAppUrl}${this.myApiUrl}/requerimiento/${id_requerimiento}`);
  }
  findLiquidacionesBySolicitud(id_solicitud: string): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(`${this.myAppUrl}${this.myApiUrl}/solicitud/${id_solicitud}`);
  }
  findArchivos(
    id: string
  ): Observable<{ contenido: { data: ArrayBuffer }; etag: string; tipo: string; nombre_original: string }[]> {
    return this.http.get<{ contenido: { data: ArrayBuffer }; etag: string; tipo: string; nombre_original: string }[]>(
      `${this.myAppUrl}${this.myApiUrl}/archivos/${id}`
    );
  }
}
