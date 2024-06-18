import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BusquedaSolicitudProgramacion, ProgramacionSolicitudes } from '../interfaces/programacion-solicitudes';

@Injectable({
  providedIn: 'root',
})
export class ProgramacionPagosService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'programacion-pagos';
  }
  crear(data: ProgramacionSolicitudes): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, data);
  }
  crearData(files: ProgramacionSolicitudes): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}/data `, files);
  }
  findAll(
    data: BusquedaSolicitudProgramacion
  ): Observable<{ total: number; transformData: ProgramacionSolicitudes[] }> {
    const params = new HttpParams()
      .set('page_index', data.page_index.toString())
      .set('page_size', data.page_size.toString())
      .set('fecha_desde', data.fecha_desde ?? '')
      .set('fecha_hasta', data.fecha_hasta ?? '')
      .set('id_tipo', data.id_tipo.toString())
      .set('id_estado', data.id_estado.toString())
      .set('codigo', data.codigo.toString());
    return this.http.get<{ total: number; transformData: ProgramacionSolicitudes[] }>(
      `${this.myAppUrl}${this.myApiUrl}`,
      {
        params: params,
      }
    );
  }
  updateEstado(data: Partial<ProgramacionSolicitudes>): Observable<Partial<ProgramacionSolicitudes>> {
    return this.http.patch<Partial<ProgramacionSolicitudes>>(`${this.myAppUrl}${this.myApiUrl}/estado`, data);
  }
}
