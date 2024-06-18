import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Proveedor, ProveedorNumeroCuenta, ProveedorSelect } from '../interfaces/proveedor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private myAppUrl: string;
  private myApiUrl: string;
  // private requerimiento: Requerimiento;
  constructor(private http: HttpClient, private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'proveedor';
  }
  buscarPorRazonSocial(razon_social: string): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.myAppUrl}${this.myApiUrl}/rason_social/${razon_social}`);
  }
  buscarPorRazonSocial2(razon_social: string): Observable<ProveedorSelect[]> {
    return this.http.get<ProveedorSelect[]>(`${this.myAppUrl}${this.myApiUrl}/rason_social/${razon_social}`);
  }
  getNumerosCuenta(id_proveedor: string, id_banco: string, id_moneda: string): Observable<ProveedorNumeroCuenta[]> {
    const params = new HttpParams()
      .set('id_proveedor', id_proveedor.toString())
      .set('id_banco', id_banco.toString())
      .set('id_moneda', id_moneda.toString());

    return this.http.get<ProveedorNumeroCuenta[]>(`${this.myAppUrl}${this.myApiUrl}/numero_cuenta`, {
      params: params,
    });
  }
}
