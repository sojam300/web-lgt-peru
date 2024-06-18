import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AreasByUser,
  AreasByUsuario,
  LoginResponse,
  LoginUser,
  User,
  UserSelect,
  UsuariosLista,
} from '../interfaces/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GastosViatico } from '../interfaces/gastos-viatico';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private myAppUrl: string;
  private myApiUrl: string;
  private myApiUserUrl: string;
  private myApiAreaUrl: string;
  constructor(private http: HttpClient, private router: Router) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'auth';
    this.myApiUserUrl = 'users';
    this.myApiAreaUrl = 'area';
  }

  signIn(user: User): Observable<any> {
    // const token = localStorage.getItem('token');
    // const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/register`, user);
  }

  login(loginUser: LoginUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.myAppUrl}${this.myApiUrl}/login`, loginUser);
  }

  logOut() {
    localStorage.removeItem(`token`);
    this.router.navigate(['/login']);
  }

  getAreasByIdUsuario(idUsuario: string): Observable<AreasByUsuario[]> {
    return this.http.get<AreasByUsuario[]>(`${this.myAppUrl}${this.myApiUserUrl}/areas/${idUsuario}`);
  }
  getAllActives(): Observable<UsuariosLista[]> {
    return this.http.get<UsuariosLista[]>(`${this.myAppUrl}${this.myApiUserUrl}/actives`);
  }
  getTrabajadores(): Observable<UserSelect[]> {
    return this.http.get<UserSelect[]>(`${this.myAppUrl}${this.myApiUserUrl}/actives`);
  }
  getAreasByUsuario(): Observable<AreasByUser[]> {
    return this.http.get<AreasByUser[]>(`${this.myAppUrl}${this.myApiAreaUrl}/usuario`);
  }
  getUsuarioById(id: string): Observable<UsuariosLista> {
    return this.http.get<UsuariosLista>(`${this.myAppUrl}${this.myApiUserUrl}/${id}`);
  }
}
