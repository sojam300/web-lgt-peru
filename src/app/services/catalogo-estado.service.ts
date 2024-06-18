import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { CatalogoEstado } from '../interfaces/catalogo-estado';

@Injectable({
  providedIn: 'root',
})
export class CatalogoEstadoService {
  private myAppUrl: string;
  private myApiUrl: string;
  private ciudades: number;
  private estadosRequerimiento: number;
  private tiposRequerimiento: number;
  private tiposRequerimientoDetalle: number;
  private tipoGastoCaja: number;
  private metodoRembolsoCaja: number;
  private tipoCaja: number;
  private estadoCaja: number;
  private tipoMoneda: number;
  private estadosLiquidacion: number;
  public estadosSolicitud: number;
  public estadosSolicitudProgramacion: number;
  public tiposSolicitudProgramacion: number;
  public tiposPagos: number;
  public tiposSeguros: number;
  public tiposAfp: number;
  public paises: number;
  constructor(private http: HttpClient, private router: Router) {
    this.ciudades = 1000;
    this.estadosRequerimiento = 1400;
    this.tiposRequerimiento = 1500;
    this.tiposRequerimientoDetalle = 1510;
    this.tipoGastoCaja = 2000;
    this.tipoCaja = 2100;
    this.estadoCaja = 4100;
    this.tipoMoneda = 5000;
    this.metodoRembolsoCaja = 10000;
    this.estadosLiquidacion = 5200;
    this.estadosSolicitud = 5300;
    this.estadosSolicitudProgramacion = 6000;
    this.tiposSolicitudProgramacion = 6100;
    this.paises = 15000;
    this.tiposAfp = 16000;
    this.tiposSeguros = 17000;
    this.tiposPagos = 18000;
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'catalogo-estado';
  }

  getGrupo(numero_grupo: number): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${numero_grupo}`);
  }

  getCiudades(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.ciudades}`);
  }
  getEstadosRequerimiento(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.estadosRequerimiento}`);
  }
  getTiposRequerimiento(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.tiposRequerimiento}`);
  }
  getTiposRequerimientoDetalle(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.tiposRequerimientoDetalle}`);
  }
  getTiposGastosCaja(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.tipoGastoCaja}`);
  }
  getMetodosRembolsoCaja(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.metodoRembolsoCaja}`);
  }
  getTiposCaja(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.tipoCaja}`);
  }
  getEstadosCaja(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.estadoCaja}`);
  }
  getTiposMoneda(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.tipoMoneda}`);
  }
  getEstadosLiquidacion(): Observable<CatalogoEstado[]> {
    return this.http.get<CatalogoEstado[]>(`${this.myAppUrl}${this.myApiUrl}/grupo/${this.estadosLiquidacion}`);
  }
}
