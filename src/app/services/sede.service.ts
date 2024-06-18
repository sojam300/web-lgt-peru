import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Sede, SedeSelect } from '../interfaces/sede';

@Injectable({
  providedIn: 'root',
})
export class SedeService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'sede';
  }

  getList(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  getList2(): Observable<SedeSelect[]> {
    return this.http.get<SedeSelect[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
}
