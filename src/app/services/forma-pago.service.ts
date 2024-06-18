import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FormaPago } from '../interfaces/forma_pago';

@Injectable({
  providedIn: 'root',
})
export class FormaPagoService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'forma-pago';
  }

  getAll(): Observable<FormaPago[]> {
    return this.http.get<FormaPago[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
}
