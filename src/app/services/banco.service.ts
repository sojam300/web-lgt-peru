import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BancoDto, BancoSelect } from '../interfaces/banco';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BancoService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'banco';
  }

  getAll(): Observable<BancoDto[]> {
    return this.http.get<BancoDto[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  getAll2(): Observable<BancoSelect[]> {
    return this.http.get<BancoSelect[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
}
