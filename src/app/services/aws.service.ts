import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaveArchivo } from '../interfaces/archivos';

@Injectable({
  providedIn: 'root',
})
export class AwsService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'aws';
  }

  guardarArchivos(files: FormData): Observable<SaveArchivo[]> {
    return this.http.post<SaveArchivo[]>(`${this.myAppUrl}${this.myApiUrl}/upload-files`, files);
  }
  getArchivo(id: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.myAppUrl}${this.myApiUrl}/download-file/${id}`, {
      responseType: 'blob' as 'json',
    });
  }
}
