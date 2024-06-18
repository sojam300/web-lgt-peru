import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Sede } from '../interfaces/sede';
import { Empresa } from '../interfaces/empresa';
import { EmpresaBancoCuentaSelect } from '../interfaces/empresa';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'empresa';
  }

  getAll(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  getNumeroCuentas(id_proveedor: string, id_banco: string, id_moneda: string): Observable<EmpresaBancoCuentaSelect[]> {
    const params = new HttpParams()
      .set('id_empresa', id_proveedor.toString())
      .set('id_banco', id_banco.toString())
      .set('id_moneda', id_moneda.toString());

    return this.http.get<EmpresaBancoCuentaSelect[]>(`${this.myAppUrl}${this.myApiUrl}/cuentas`, {
      params: params,
    });
  }
}
