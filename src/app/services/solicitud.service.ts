import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Solicitud, SolicitudDetalle } from '../interfaces/solicitud';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'solicitud';
  }
  buscarSolicitudes(params: HttpParams): Observable<{ solicitudes: Solicitud[]; totalRows: number }> {
    return this.http.get<{ solicitudes: Solicitud[]; totalRows: number }>(`${this.myAppUrl}${this.myApiUrl}`, {
      params: params,
    });
  }
  guardarSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(`${this.myAppUrl}${this.myApiUrl}`, solicitud);
  }
  editarSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.myAppUrl}${this.myApiUrl}/${solicitud.id}`, solicitud);
  }
  findOneById(id_solicitud: string): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.myAppUrl}${this.myApiUrl}/${id_solicitud}`);
  }

  guardarDetalle(solicitud_detalle: SolicitudDetalle): Observable<Solicitud> {
    return this.http.post<Solicitud>(`${this.myAppUrl}${this.myApiUrl}/detalle`, solicitud_detalle);
  }
  editarDetalle(solicitud_detalle: SolicitudDetalle, id_solicitud_detalle: string): Observable<Solicitud> {
    return this.http.put<Solicitud>(
      `${this.myAppUrl}${this.myApiUrl}/detalle/${id_solicitud_detalle}`,
      solicitud_detalle
    );
  }
  eliminarDetalle(id_solicitud_detalle: string): Observable<Solicitud> {
    return this.http.delete<Solicitud>(`${this.myAppUrl}${this.myApiUrl}/detalle/${id_solicitud_detalle}`);
  }

  editarEstado(solicitud: Partial<Solicitud>, id_solicitud: string): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.myAppUrl}${this.myApiUrl}/estado/${id_solicitud}`, solicitud);
  }
}
