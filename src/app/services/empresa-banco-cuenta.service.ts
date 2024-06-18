import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { EmpresaBancoCuentaDto } from '../interfaces/empresa-banco-cuenta';

@Injectable({
  providedIn: 'root',
})
export class EmpresaBancoCuentaService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'empresa-banco-cuenta';
  }

  getNumerosCuenta(params: HttpParams): Observable<EmpresaBancoCuentaDto[]> {
    return this.http.get<EmpresaBancoCuentaDto[]>(`${this.myAppUrl}${this.myApiUrl}`, {
      params: params,
    });
  }
}
