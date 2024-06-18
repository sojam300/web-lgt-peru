import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Caja, CajaChica } from '../interfaces/caja';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  private myAppUrl: string;
  private myApiUrl: string;
  idCaja: string | null = null;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'caja';
  }

  guardarCajaChica(caja: Partial<Caja>): Observable<CajaChica> {
    return this.http.post<CajaChica>(`${this.myAppUrl}${this.myApiUrl}`, caja);
  }
  guardarCajaEgresos(caja: Partial<Caja>): Observable<CajaChica> {
    return this.http.post<CajaChica>(`${this.myAppUrl}${this.myApiUrl}`, caja);
  }
  enviarIdCaja(idCaja: string) {
    this.idCaja = idCaja;
  }
  findCajaById(id_caja: string): Observable<Caja> {
    return this.http.get<Caja>(`${this.myAppUrl}${this.myApiUrl}/${id_caja}`);
  }
  editarCaja(caja: Partial<Caja>, id_caja: string): Observable<Caja> {
    return this.http.put<Caja>(`${this.myAppUrl}${this.myApiUrl}/${id_caja}`, caja);
  }
  editarEstado(caja: Partial<Caja>, id_caja: string): Observable<Caja> {
    return this.http.put<Caja>(`${this.myAppUrl}${this.myApiUrl}/estado/${id_caja}`, caja);
  }
  buscarCajas(params: HttpParams): Observable<{ cajas: Caja[]; totalRows: number }> {
    return this.http.get<{ cajas: Caja[]; totalRows: number }>(`${this.myAppUrl}${this.myApiUrl}`, {
      params: params,
    });
  }
  buscarCajaChicaPorSede(id_sede: string): Observable<Caja> {
    return this.http.get<Caja>(`${this.myAppUrl}${this.myApiUrl}/sede/${id_sede}`);
  }
}
