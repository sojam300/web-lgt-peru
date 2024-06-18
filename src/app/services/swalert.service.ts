import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class SwalertService {
  constructor() {}

  async confirmBox(id_estado: string, nombre_estado: string): Promise<boolean> {
    let respuesta = false;
    return Swal.fire({
      title: `Estado cambiara a ${nombre_estado}`,
      text: 'Esta seguro de cambiar el estado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#DC3545',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        console.log(result.value, 'RESULT VALUE');
        Swal.fire('Ok!', 'El estado fue editado.', 'success');
        respuesta = true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
      }
      return respuesta;
    });
  }
  async confirmBoxSwal(nombre_estado: string) {
    return Swal.fire({
      title: `Estado cambiara a ${nombre_estado}`,
      text: 'Esta seguro de cambiar el estado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#DC3545',
      cancelButtonText: 'Cancelar',
    });
  }
}
