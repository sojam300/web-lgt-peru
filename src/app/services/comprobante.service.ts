import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sede } from '../interfaces/sede';
import { Comprobante, ComprobanteSelect } from '../interfaces/comprobante';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'comprobante';
  }

  getAll(): Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  getAllToSelect(): Observable<ComprobanteSelect[]> {
    return this.http.get<ComprobanteSelect[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
}
