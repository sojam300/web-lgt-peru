import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/error.service';

@Component({
  selector: 'app-guardarusuario',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule, SpinnerComponent],
  templateUrl: './guardarusuario.component.html',
  styleUrl: './guardarusuario.component.css',
})
export class GuardarusuarioComponent implements OnInit {
  nombres: string = '';
  apellidos: string = '';
  correo: string = '';
  tipo: number = 0;
  estado: number = 0;
  password: string = '';
  confirmpassword: string = '';
  loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _userService: UserService,
    private _toastService: ToastService,
    private router: Router
  ) {}
  ngOnInit(): void {}

  saveUsuario() {
    console.log(this);
    if (
      this.nombres == '' ||
      this.apellidos == '' ||
      this.correo == '' ||
      this.tipo == 0 ||
      this.estado == 0 ||
      this.password == '' ||
      this.confirmpassword == ''
    ) {
      this.toastr.error('Todos los campos son obligatorios!', 'Error!');
      return;
    }

    if (this.password !== this.confirmpassword) {
      this.toastr.error('Las contraseñas deben ser iguales.', 'Error!');
      return;
    }

    const user: User = {
      nombres: this.nombres,
      apellidos: this.apellidos,
      tipo: this.tipo * 1,
      estado: this.estado * 1,
      correo: this.correo,
      password: this.password,
    };

    this.loading = true;
    this._userService.signIn(user).subscribe({
      next: (v) => {
        this.loading = false;
        this.toastr.success('El usuario fue registrado con exito.', 'Usuario Guardado!');
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this._toastService.msgError(error);
      },
      complete: () => console.log('Complete'),
    });
  }
}
