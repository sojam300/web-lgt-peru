import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ToastService } from '../../../services/error.service';
import { CatalogoEstadoService } from '../../../services/catalogo-estado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MyErrorStateMatcher } from '../../../common/helpers';
import { Observable, Subject, fromEvent, merge, of } from 'rxjs';
import { catchError, debounceTime, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Proveedor } from '../../../interfaces/proveedor';
import { ProveedorService } from '../../../services/proveedor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { UsuariosLista } from '../../../interfaces/user';
import { PlanillaMovilidad, PlanillaMovilidadDetalle } from '../../../interfaces/planilla-movilidad';
import { PlanillaMovilidadDetalleModalComponent } from '../planilla-movilidad-detalle-modal/planilla-movilidad-detalle-modal.component';
import moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { PlanillaMovilidadService } from '../../../services/planilla-movilidad.service';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-planilla-movilidad-form',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, NavbarComponent, ReactiveFormsModule, SidenavComponent],
  templateUrl: './planilla-movilidad-form.component.html',
  styleUrl: './planilla-movilidad-form.component.css',
})
export class PlanillaMovilidadFormComponent implements OnInit {
  @ViewChild('input') inputElement!: ElementRef;
  isSubmitting: boolean = false;
  myControl = new FormControl<string | Proveedor>('');
  buscarProveedor = '';
  id_planilla_movilidad = '';
  proveedores: Proveedor[] = [];
  isProveedorLoading = false;

  filteredOptions2!: Observable<Proveedor[]>;
  planillaMovilidadForm: FormGroup;

  planillaMovilidadDetalles: PlanillaMovilidadDetalle[] = [];
  usuariosActives: UsuariosLista[] = [];

  dataSource = new MatTableDataSource<PlanillaMovilidadDetalle>();

  constructor(
    private _toastService: ToastService,
    private _usuarioService: UserService,
    private _catalogoEstadoService: CatalogoEstadoService,
    private router: Router,
    private route: ActivatedRoute,

    private fb: FormBuilder,
    public dialog: MatDialog,
    private _proveedorService: ProveedorService,
    private _planillaMovilidadService: PlanillaMovilidadService
  ) {
    // usuario: [{ id: '', nombres: '', apellidos: '', correo: '' }, Validators.required],
    this.planillaMovilidadForm = this.fb.group({
      id: [''],
      codigo: ['AUTOGEN'],
      id_estado: [''],
      proveedor: ['', Validators.required],
      fecha_emicion: ['', Validators.required],
      usuario: [null, Validators.required],
      planilla_movilidad_detalle: this.fb.array([]),
    });
  }
  displayedColumns = ['N°', 'Fecha de Gasto', 'Lugar Origen', 'Lugar Destino', 'Motivo', 'Monto'];
  matcher = new MyErrorStateMatcher();

  ngOnInit() {
    this.planillaMovilidadForm.patchValue({ id: this.route.snapshot.paramMap.get('id') });
    if (this.planillaMovilidadForm.get('id')?.value) {
      this.findById(this.planillaMovilidadForm.get('id')?.value);
    }
    this.filteredOptions2 = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.razon_social;
        return name ? this._filter(name as string) : this.proveedores.slice();
      })
    );

    this._usuarioService.getAllActives().subscribe({
      next: (usuariosActives) => {
        this.usuariosActives = usuariosActives;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
  }

  private _filter(name: string): Proveedor[] {
    const filterValue = name.toLowerCase();
    console.log(name, ' FILTRANDO');
    return this.proveedores.filter((option) => option.razon_social.toLowerCase().includes(filterValue));
  }

  onEnterProveedor(event: any): void {
    event.preventDefault();
    this.isProveedorLoading = true;
    const currentValue = this.planillaMovilidadForm.get('proveedor')?.value;

    if (!currentValue || (typeof currentValue === 'string' && currentValue.length <= 3)) {
      this._toastService.messageInfo('El campo debe contener almenos 4 letras.');
      this.isProveedorLoading = false;
      return;
    }
    if (typeof currentValue === 'string' && currentValue.length > 3) {
      this._proveedorService
        .buscarPorRazonSocial(currentValue)
        .pipe(
          tap((proveedores) => {
            if (proveedores.length > 0) {
              this._toastService.messageAddOk('Búsqueda completa.');
              this.proveedores = proveedores; // Actualizar las opciones con los resultados de la API
              this.myControl.setValue('');
              this.myControl.setValue(currentValue);
            } else {
              this._toastService.messageInfo('Búsqueda sin resultados.');
            }
          }),
          catchError((error: HttpErrorResponse) => {
            this._toastService.msgError(error);
            return of([]); // Manejo de errores
          })
        )
        .subscribe({
          complete: () => {
            this.isProveedorLoading = false;
          },
        });
    } else {
      this.isProveedorLoading = false;
    }
  }
  displayFn(proveedor: Proveedor): string {
    return proveedor && proveedor.razon_social ? proveedor.razon_social : '';
  }

  openDialog(item?: PlanillaMovilidadDetalle): void {
    const dialogRef = this.dialog.open(PlanillaMovilidadDetalleModalComponent, {
      data: item ? { ...item } : { fecha_gasto: '', lugar_origen: '', lugar_destino: '', motivo: '', monto: 0 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        if (item) {
          const index = this.detalles.controls.findIndex((detalle: AbstractControl) => {
            return detalle.value === item; // Comparar por el id del detalle
          });
          this.removeDetalle(index);
        }
      } else if (result) {
        if (item) {
          const index = this.detalles.controls.findIndex((detalle: AbstractControl) => {
            return detalle.value === item; // Comparar por el id del detalle
          });
          if (index !== -1) {
            this.detalles.at(index).patchValue(result);
            this.updateDataSource();
          }
        } else {
          console.log(result);
          // this.planillaMovilidadDetalles = [...this.planillaMovilidadDetalles.filter((i) => i !== item), result];
          this.addDetalle(result);
        }
      }
    });
  }

  formatearFecha(date: Date) {
    return moment(date).format('DD/MM/YYYY');
  }

  createDetalleFormGroup(detalle?: PlanillaMovilidadDetalle): FormGroup {
    return this.fb.group({
      id: [detalle?.id || ''],
      fecha_gasto: [detalle?.fecha_gasto || '', Validators.required],
      lugar_origen: [detalle?.lugar_origen || '', Validators.required],
      lugar_destino: [detalle?.lugar_destino || '', Validators.required],
      motivo: [detalle?.motivo || '', Validators.required],
      monto: [detalle?.monto || 0, [Validators.required, Validators.min(0)]],
    });
  }
  createArrayDetalleFormGrup(detalles: PlanillaMovilidadDetalle[]): FormArray {
    const formArray = this.fb.array([] as FormGroup[]);
    detalles.forEach((detalle) => {
      detalle.monto = +detalle.monto;
      formArray.push(this.createDetalleFormGroup(detalle));
    });
    console.log(formArray, 'ARRAY GENERADO');
    return formArray;
  }
  get detalles(): FormArray {
    return this.planillaMovilidadForm.get('planilla_movilidad_detalle') as FormArray;
  }
  updateDataSource(): void {
    this.dataSource.data = this.detalles.controls.map((detalle: any) => detalle.value);
  }
  addDetalle(detalle?: PlanillaMovilidadDetalle): void {
    console.log(detalle, 'EN ADD DETALLE');
    this.detalles.push(this.createDetalleFormGroup(detalle));
    this.updateDataSource();
  }
  editDetalle(index: number): void {
    this.detalles.at(index);
    this.updateDataSource();
  }
  removeDetalle(index: number): void {
    this.detalles.removeAt(index);
    this.updateDataSource();
  }
  onSubmit() {
    if (this.planillaMovilidadForm.valid) {
      this.isSubmitting = true;
      if (this.planillaMovilidadForm.get('id')?.value) {
        this._planillaMovilidadService
          .editarCaja(this.planillaMovilidadForm.getRawValue(), this.planillaMovilidadForm.get('id')?.value)
          .subscribe({
            next: () => {
              this._toastService.messageAddOk('Se guardo Planilla Movilidad.');
              this.isSubmitting = false;
            },
            error: (error: HttpErrorResponse) => {
              console.log(error, 'ERROR');
              this._toastService.msgError(error);
              this.isSubmitting = false;
            },
          });
      } else {
        this._planillaMovilidadService.crear(this.planillaMovilidadForm.getRawValue()).subscribe({
          next: (data) => {
            this.router.navigateByUrl(`/planilla_movilidad_form/${data.id}`);
            this._toastService.messageAddOk('Se guardo Planilla Movilidad.');
            this.isSubmitting = false;
          },
          error: (error: HttpErrorResponse) => {
            console.log(error, 'ERROR');
            this._toastService.msgError(error);
            this.isSubmitting = false;
          },
        });
      }
    }
  }

  findById(id: string) {
    this.isSubmitting = true;
    this._planillaMovilidadService.findById(id).subscribe({
      next: (data) => {
        const usuario = this.usuariosActives.find((u) => u.id === data.usuario.id);
        this.planillaMovilidadForm.patchValue(data);

        this.planillaMovilidadForm.setControl(
          'planilla_movilidad_detalle',
          this.createArrayDetalleFormGrup(data.planilla_movilidad_detalle)
        );
        this.updateDataSource();
        if (usuario) {
          this.planillaMovilidadForm.patchValue({ usuario: usuario });
        }
        this.isSubmitting = false;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
        this.isSubmitting = false;
      },
    });
  }
}
