import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { RequerimientoService } from '../../../services/requerimiento.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-requerimiento-viaticos-form-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './requerimiento-viaticos-form-edit.component.html',
  styleUrl: './requerimiento-viaticos-form-edit.component.css',
})
export class RequerimientoViaticosFormEditComponent implements OnInit {
  myModalHospedaje!: any;
  modalHospedajeElement: any;
  requerimiento: any = [];

  constructor(private router: Router, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.myModalHospedaje = new bootstrap.Modal(this.elementRef.nativeElement.querySelector('#modalFormHospedaje'));
  }

  crearRequerimiento() {
    this.router.navigate(['/requerimiento_viaticos_form/12']);
  }

  openModal() {
    this.myModalHospedaje.show();
  }

  guardarModal() {
    alert('Modal guardado');
  }
}
// export class RequerimientoViaticosFormEditComponent implements OnInit {
//   myModalHospedaje!: any;
//   requerimiento: any = [];
//   constructor(private _requerimientoService: RequerimientoService, private router: Router) {}
//   ngOnInit(): void {
//     this.myModalHospedaje = new window.bootstrap.Modal('#modalFormHospedaje');
//   }
//   crearRequerimiento() {
//     this.router.navigate([`/requerimiento_viaticos_form/12`]);
//   }
//   openModal() {
//     this.myModalHospedaje.show();
//   }
//   guardarModal() {
//     alert('modal guardar');
//   }
// }
