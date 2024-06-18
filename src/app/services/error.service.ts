import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}
  msgError(error: HttpErrorResponse) {
    if (error.error.message) {
      this.toastr.error(error.error.message, 'Error!');
    } else {
      this.toastr.error('Error inesperado, verifique conexion o comuniquese con el administrador.', 'Error!');
    }
  }
  messageAddOk(texto: string) {
    this.toastr.success(texto, 'ok!', {
      timeOut: 2500,
    });
  }
  messageInfo(texto: string) {
    this.toastr.info(texto, 'Info!', {
      timeOut: 2500,
    });
  }
  messageError(texto: string, title: string) {
    this.toastr.error(texto, title, {
      timeOut: 2500,
    });
  }
}
