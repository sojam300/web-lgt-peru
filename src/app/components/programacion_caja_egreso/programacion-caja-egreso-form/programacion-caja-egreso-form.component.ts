import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../modules/material/material.module';
import { ProgramacionPagosDialog, ProgramacionSolicitudes } from '../../../interfaces/programacion-solicitudes';
import moment from 'moment';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CatalogoEstado } from '../../../interfaces/catalogo-estado';
import { ProveedorSelect } from '../../../interfaces/proveedor';
import { ToastService } from '../../../services/error.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { Observable, catchError, concatMap, finalize, forkJoin, map, of, startWith, tap } from 'rxjs';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ComprobanteSelect } from '../../../interfaces/comprobante';
import { ComprobanteService } from '../../../services/comprobante.service';
import { BancoService } from '../../../services/banco.service';
import { BancoSelect } from '../../../interfaces/banco';
import { CatalogoEstadoService } from '../../../services/catalogo-estado.service';
import { ButtonIconComponent } from '../../../shared/button-icon/button-icon.component';
import { AwsService } from '../../../services/aws.service';
import { ProgramacionPagosService } from '../../../services/programacion-pagos.service';
import { DialogConfirmComponent } from '../../../shared/dialog-confirm/dialog-confirm.component';
import { EmpresaSelect } from '../../../interfaces/empresa';
import { SedeSelect } from '../../../interfaces/sede';
import { EmpresaBancoCuentaSelect } from '../../../interfaces/empresa';
import { EmpresaService } from '../../../services/empresa.service';
import { User, UserSelect } from '../../../interfaces/user';

@Component({
  selector: 'app-programacion-caja-egreso-form',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonIconComponent,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, provideNativeDateAdapter()],
  templateUrl: './programacion-caja-egreso-form.component.html',
  styleUrl: './programacion-caja-egreso-form.component.css',
})
export class ProgramacionCajaEgresoFormComponent implements OnInit {
  isDataloading: boolean = false;
  resetForm: boolean = true;
  myControlProveedor = new FormControl('');
  myControlTrabajador = new FormControl('');
  optionsProveedores: string[] = [];
  proveedores: ProveedorSelect[] = [];
  filteredProveedor!: Observable<string[]>;
  isProveedorLoading = false;

  myControlTipoDocumento = new FormControl('');
  optionsTipoDocumentos: string[] = [];
  tipoDocumentos: ComprobanteSelect[] = [];
  filteredTipoDocumento!: Observable<string[]>;
  isTipoDocumentoLoading = false;

  programacionPagoForm: FormGroup;
  isEditMode: boolean;
  tipoSolicitudes: CatalogoEstado[] = [];
  tipo: string[] = [
    'RxH',
    'Servicios Publicos',
    'Compras Mercaderia nacionales',
    'Importaciones',
    'Pagos al personal',
    'Seguros',
    'Trans entre cuentas',
    'Leasing',
    'Reembolsos',
    'Viaticos',
    'Compra de Suministros',
    'Pasajes Aereos',
  ];
  meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  comprobantes: ComprobanteSelect[] = [];
  bancos: BancoSelect[] = [];
  empresas: EmpresaSelect[] = [];
  empresaBancoCuentas: string[] = [];
  empresaBancoCuentasOrigen: string[] = [];
  empresaBancoCuentasDestino: string[] = [];
  sedes: SedeSelect[] = [];
  paises: CatalogoEstado[] = [];
  tiposPago: CatalogoEstado[] = [];
  tiposSeguros: CatalogoEstado[] = [];
  tiposAfp: CatalogoEstado[] = [];
  tiposMoneda: CatalogoEstado[] = [];
  tiposSolicitudProgramacion: CatalogoEstado[] = [];
  estadosSolicitudProgramacion: CatalogoEstado[] = [];
  currEstado!: CatalogoEstado;
  proveedorNumerosCuenta: string[] = [];
  trabajadores: UserSelect[] = [];
  params = new HttpParams();

  images: string[] = [];
  files: File[] = [];
  esSolicitud: boolean = false;
  esProgramacion: boolean = false;
  constructor(
    private fb: FormBuilder,
    private _toastService: ToastService,
    private _proveedorService: ProveedorService,
    private _awsService: AwsService,
    private _programacionPagoService: ProgramacionPagosService,
    private _empresaService: EmpresaService,
    public dialogRef: MatDialogRef<ProgramacionCajaEgresoFormComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataAll: ProgramacionPagosDialog
  ) {
    console.log(dataAll, 'ALL DATA DESDE LISTADO');
    const data = dataAll.form as ProgramacionSolicitudes;
    this.esSolicitud = dataAll.esSolicitud;
    this.esProgramacion = dataAll.esProgramacion;
    this.isEditMode = !!data.id;
    this.comprobantes = dataAll.comprobantes;
    this.empresas = dataAll.empresas;
    this.bancos = dataAll.bancos;
    this.sedes = dataAll.sedes;
    this.tiposMoneda = dataAll.tiposMoneda;
    this.tiposPago = dataAll.tiposPago;
    this.tiposSeguros = dataAll.tiposSeguros;
    this.tiposAfp = dataAll.tiposAfp;
    this.paises = dataAll.paises;
    this.tiposSolicitudProgramacion = dataAll.tiposSolicitudProgramacion;
    this.estadosSolicitudProgramacion = dataAll.estadosSolicitudProgramacion;
    this.trabajadores = dataAll.trabajadores;
    if (data?.numero_cuenta_proveedor) {
      this.proveedorNumerosCuenta.push(data?.numero_cuenta_proveedor);
    }
    data?.numero_cuenta ? this.empresaBancoCuentas.push(data?.numero_cuenta) : null;
    data?.numero_cuenta_origen ? this.empresaBancoCuentasOrigen.push(data?.numero_cuenta_origen) : null;
    data?.numero_cuenta_destino ? this.empresaBancoCuentasDestino.push(data?.numero_cuenta_destino) : null;
    this.programacionPagoForm = this.fb.group({
      id: [data.id || ''],
      codigo: [data.codigo || 'AUTOGEN'],
      fecha_solicitud: [data.fecha_solicitud || new Date()],
      estado: [data.estado || ''],
      tipo: [data.tipo || ''],
      usuario_solicitud: [data.usuario_solicitud || ''],
      fecha_tentativa_pago: [data.fecha_tentativa_pago || ''],
      tipo_pago: [data.tipo_pago || ''],
      tipo_seguro: [data.tipo_seguro || ''],
      tipo_afp: [data.tipo_afp || ''],
      comprobante: [data.comprobante || ''],
      proveedor: [data.proveedor || ''],
      sede: [data.sede || ''],
      moneda: [data.moneda || ''],
      banco: [data.banco || ''],
      empresa: [data.empresa || ''],
      banco_origen: [data.banco_origen || ''],
      banco_destino: [data.banco_destino || ''],
      empresa_origen: [data.empresa_origen || ''],
      empresa_destino: [data.empresa_destino || ''],
      numero_cuenta: [data.numero_cuenta || ''],
      numero_cuenta_origen: [data.numero_cuenta_origen || ''],
      numero_cuenta_destino: [data.numero_cuenta_destino || ''],
      numero_cuenta_proveedor: [data.numero_cuenta_proveedor || ''],
      numero_contrato: [data.numero_contrato || ''],
      numero_cuota: [data.numero_cuota || ''],
      trabajador: [data.trabajador || ''],
      numero_cuenta_trabajador: [data.numero_cuenta_trabajador || ''],
      tipo_deposito: [data.tipo_deposito || ''],
      numero_requerimiento: [data.numero_requerimiento || ''],
      ruc: [data.ruc || ''],
      ruta: [data.ruta || ''],
      origen_viaje: [data.origen_viaje || ''],
      destino_viaje: [data.destino_viaje || ''],
      codigo_pago_viaje: [data.codigo_pago_viaje || ''],
      serie: [data.serie || ''],
      numero: [data.numero || ''],
      pais: [data.pais || ''],
      mes: [data.mes || ''],
      total: [data.total || ''],
      tasa_detraccion: [data.tasa_detraccion || ''],
      total_detraccion: [data.total_detraccion || ''],
      tasa_retencion: [data.tasa_retencion || ''],
      total_retencion: [data.total_retencion || ''],
      total_igv: [data.total_igv || ''],
      a_pagar: [data.a_pagar || ''],
      glosa: [data.glosa || ''],
      files: new FormControl([]),
      // detalleTipo: this.fb.group({}),
      archivos: [data.archivos || []],
    });
  }

  resetToNumerosCuenta(event: any, label: string) {
    console.log('SELECCIONADNO MONEDA');
    if (event.isUserInput) {
      if (label === 'banco_origen') {
        this.programacionPagoForm.get('numero_cuenta_origen')?.reset();
        this.programacionPagoForm.get('empresa_origen')?.reset();
      } else if (label === 'banco_destino') {
        this.programacionPagoForm.get('empresa_destino')?.reset();
        this.programacionPagoForm.get('numero_cuenta_destino')?.reset();
      } else {
        this.myControlProveedor.reset();
        this.programacionPagoForm.get('proveedor')?.reset();
        this.programacionPagoForm.get('ruc')?.reset();
        this.programacionPagoForm.get('numero_cuenta')?.reset();
        this.programacionPagoForm.get('empresa')?.reset();
        this.programacionPagoForm.get('banco_destino')?.reset();
        this.programacionPagoForm.get('banco_origen')?.reset();
        this.programacionPagoForm.get('empresa_destino')?.reset();
        this.programacionPagoForm.get('numero_cuenta_destino')?.reset();
        this.programacionPagoForm.get('numero_cuenta_origen')?.reset();
        this.programacionPagoForm.get('empresa_origen')?.reset();
      }
    }
  }

  getEmpresaBancoCuentas(event: any, empresaSelect: EmpresaSelect, inputForm: string) {
    console.log(inputForm);
    if (event.isUserInput) {
      const empresa = empresaSelect;
      let banco = this.programacionPagoForm.get('banco')?.getRawValue();
      const moneda = this.programacionPagoForm.get('moneda')?.getRawValue();

      if (inputForm === 'empresa_origen') {
        banco = this.programacionPagoForm.get('banco_origen')?.getRawValue();
      }
      if (inputForm === 'empresa_destino') {
        banco = this.programacionPagoForm.get('banco_destino')?.getRawValue();
      }

      if (empresa && banco && moneda) {
        this._empresaService.getNumeroCuentas(empresa.id, banco.id, moneda.id).subscribe({
          next: (numeroCuentas) => {
            switch (inputForm) {
              case 'empresa':
                this.programacionPagoForm.get('numero_cuenta')?.reset();
                this.empresaBancoCuentas = numeroCuentas.map((cuenta) => cuenta.numero_cuenta);
                break;
              case 'empresa_origen':
                this.programacionPagoForm.get('numero_cuenta_origen')?.reset();
                this.empresaBancoCuentasOrigen = numeroCuentas.map((cuenta) => cuenta.numero_cuenta);
                break;
              case 'empresa_destino':
                this.programacionPagoForm.get('numero_destino')?.reset();
                this.empresaBancoCuentasDestino = numeroCuentas.map((cuenta) => cuenta.numero_cuenta);
                break;
              default:
                break;
            }
          },
          error: (error: HttpErrorResponse) => {
            return this._toastService.msgError(error);
          },
        });
      }
    }
  }

  ngOnInit(): void {
    const dataEditTipo = this.programacionPagoForm.get('tipo')?.getRawValue();
    if (dataEditTipo) {
      this.resetForm = false;
      this.onTipoGastoChange(dataEditTipo);
      this.resetForm = true;
    }

    this.myControlProveedor.setValue(this.programacionPagoForm.get('proveedor')?.getRawValue()?.razon_social ?? '');
    this.currEstado = this.programacionPagoForm.get('estado')?.value;
    this.filteredProveedor = this.myControlProveedor.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.programacionPagoForm.get('tipo')?.setValidators([Validators.required]);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsProveedores.filter((option) => option.toLowerCase().includes(filterValue));
  }

  close(): void {
    console.log('cerrando');
    this.dialogRef.close();
  }

  deleteItem(): void {
    this.dialogRef.close('delete');
  }
  formatearFecha(date: Date) {
    return moment(date).format('DD/MM/YYYY');
  }
  save(): void {
    this.programacionPagoForm.updateValueAndValidity();
    console.log(this.programacionPagoForm.getRawValue(), 'FORM ****');
    console.log(this.programacionPagoForm.valid, 'ES VALIDO ???');
    if (this.programacionPagoForm.valid) {
      this.isDataloading = true;
      const formGroup = this.programacionPagoForm.getRawValue();
      const formData = new FormData();
      for (let i = 0; i < formGroup.files.length; i++) {
        formData.append('files', formGroup.files[i]);
      }

      this._awsService
        .guardarArchivos(formData)
        .pipe(
          concatMap((archivos) => {
            const currArchivos = this.programacionPagoForm.get('archivos')?.value;
            const nuevaListaArchivos = currArchivos.concat(archivos);
            this.programacionPagoForm.get('archivos')?.patchValue(nuevaListaArchivos);
            return this._programacionPagoService.crear(this.programacionPagoForm.getRawValue());
          }),
          finalize(() => {
            this.isDataloading = false;
          })
        )
        .subscribe({
          next: (programacion) => {
            this.programacionPagoForm.get('codigo')?.patchValue(programacion.codigo);
            this.dialogRef.close(this.programacionPagoForm.value);
            this.programacionPagoForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            this._toastService.msgError(error);
          },
        });
    } else {
      this.programacionPagoForm.markAllAsTouched();
    }
  }

  resetFormululario() {
    const excludedKeys = ['id', 'estado', 'codigo', 'fecha_solicitud', 'tipo', 'files', 'archivos'];
    Object.keys(this.programacionPagoForm.controls).forEach((key) => {
      const control = this.programacionPagoForm.get(key);

      if (control) {
        // Limpiar validadores y actualizar validez
        control.clearValidators();
        control.updateValueAndValidity();

        // Restablecer el valor del control si no está en la lista de excluidos
        if (this.resetForm === true && !excludedKeys.includes(key)) {
          console.log(`Restableciendo campo: ${key}`);
          control.reset();
        }
      }
    });
    // Restablecer el control proveedor si `resetForm` es verdadero
    if (this.resetForm === true) {
      this.myControlProveedor.reset();
    }
  }

  onEnterProveedor(event: any) {
    event.preventDefault();
    this.isProveedorLoading = true;
    if (typeof this.myControlProveedor.value === 'string') {
      this._proveedorService.buscarPorRazonSocial2(this.myControlProveedor.value).subscribe({
        next: (proveedores) => {
          this.proveedores = proveedores;
          const provs = proveedores.map((p) => p.razon_social);
          this.optionsProveedores = provs;
          this.myControlProveedor.setValue(this.myControlProveedor.value);
          this.isProveedorLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
          this.isProveedorLoading = false;
        },
      });
    }
  }
  onSelectEstado(event: any, estado: CatalogoEstado) {
    if (event.isUserInput) {
      // hacer un put para cambiar el estado
      this.isDataloading = true;
      const dialogRef = this.dialog.open(DialogConfirmComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this._programacionPagoService
            .updateEstado({
              id: this.programacionPagoForm.get('id')?.value,
              estado: this.programacionPagoForm.get('estado')?.value,
            })
            .subscribe({
              next: (response) => {
                this.currEstado = estado;
                this.isDataloading = false;
              },
              error: (error: HttpErrorResponse) => {
                this._toastService.msgError(error);
                this.isDataloading = true;
              },
            });
        } else {
          this.programacionPagoForm.get('estado')?.patchValue(this.currEstado);
        }
      });
    }
  }

  onSelectProveedor(event: any, option: string) {
    if (event.isUserInput) {
      const findProveedor = this.proveedores.find((p) => p.razon_social === option);

      if (findProveedor) {
        this.programacionPagoForm.get('numero_cuenta_proveedor')?.reset();
        this.programacionPagoForm.get('proveedor')?.setValue(findProveedor);
        this.programacionPagoForm.get('ruc')?.setValue(findProveedor.ruc);

        this.getProveedorNumeroCuenta();
      }
    }
  }
  onSelectTrabajador(event: any, trabajador: UserSelect) {
    if (event.isUserInput && trabajador) {
      this.programacionPagoForm.get('numero_cuenta_trabajador')?.setValue(trabajador.numero_cuenta);
    }
  }

  onEnterTipoDocumento(event: any) {
    event.preventDefault();
    this.isTipoDocumentoLoading = true;
    if (typeof this.myControlTipoDocumento.value === 'string') {
      this._proveedorService.buscarPorRazonSocial2(this.myControlTipoDocumento.value).subscribe({
        next: (proveedores) => {
          this.proveedores = proveedores;
          const provs = proveedores.map((p) => p.razon_social);
          this.optionsTipoDocumentos = provs;
          this.myControlTipoDocumento.setValue(this.myControlTipoDocumento.value);
          this.isTipoDocumentoLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
          this.isTipoDocumentoLoading = false;
        },
      });
    }
  }
  onSelectTipoDocumento(event: any, option: string) {
    if (event.isUserInput) {
      const findProveedor = this.proveedores.find((p) => p.razon_social === 'PROVEEDOR 1');

      if (findProveedor) {
        this.programacionPagoForm.get('proveedor')?.setValue(findProveedor);
      }
    }
  }
  isRequired(controlName: string): boolean {
    const control = this.programacionPagoForm.get(controlName);
    if (control && control.validator) {
      const validator = control.validator({} as FormGroup);
      return validator && validator['required'];
    }
    return false;
  }

  onTipoGastoChange(idTipo: CatalogoEstado) {
    this.resetFormululario();
    if (idTipo && idTipo.nombre) {
      // Campos comunes
      this.setCommonValidators();

      // Campos adicionales para programaciones
      if (this.esProgramacion) {
        this.setProgramacionValidators();
      }

      // Campos específicos según el tipo
      const tipo = idTipo.nombre.toUpperCase();
      this.setTipoSpecificValidators(tipo);
    }
  }

  setCommonValidators() {
    const commonFields = ['tipo', 'fecha_solicitud', 'moneda', 'total', 'glosa'];
    commonFields.forEach((field) => {
      this.programacionPagoForm.get(field)?.setValidators([Validators.required]);
      this.programacionPagoForm.get(field)?.updateValueAndValidity();
    });
  }
  setProgramacionValidators() {
    const programacionFields = [
      'tasa_detraccion',
      'total_detraccion',
      'tasa_retencion',
      'total_retencion',
      'total_igv',
      'a_pagar',
    ];
    programacionFields.forEach((field) => {
      this.programacionPagoForm.get(field)?.setValidators([Validators.required]);
      this.programacionPagoForm.get(field)?.updateValueAndValidity();
    });
  }

  setTipoSpecificValidators(tipo: string) {
    const tipoFieldsMap: { [key: string]: string[] } = {
      RXH: ['comprobante', 'proveedor', 'ruc', 'banco', 'numero_cuenta_proveedor', 'serie', 'numero'],
      'SERVICIOS PUBLICOS': [
        'comprobante',
        'proveedor',
        'ruc',
        'banco',
        'numero_cuenta_proveedor',
        'serie',
        'numero',
        'sede',
      ],
      'COMPRAS MERCADERIA NACIONAL': [
        'comprobante',
        'banco',
        'proveedor',
        'numero_cuenta_proveedor',
        'ruc',
        'serie',
        'numero',
      ],
      IMPORTACIONES: ['pais', 'tipo', 'serie', 'numero'],
      'PAGOS AL PERSONAL': ['tipo_pago', 'mes', 'sede', 'tipo_afp', 'trabajador', 'numero_cuenta_trabajador'],
      SEGUROS: ['comprobante', 'tipo_pago', 'mes', 'sede', 'serie', 'numero'],
      'TRANS. ENTRE CUENTAS': [
        'banco_origen',
        'banco_destino',
        'empresa_origen',
        'empresa_destino',
        'numero_cuenta_origen',
        'numero_cuenta_destino',
      ],
      LEASING: ['empresa', 'banco', 'numero_cuenta', 'numero_contrato', 'numero_cuota'],
      REEMBOLSOS: ['comprobante', 'proveedor', 'ruc', 'trabajador', 'numero_cuenta_trabajador', 'serie', 'numero'],
      VIATICOS: ['tipo_deposito', 'numero_requerimiento', 'trabajador', 'numero_cuenta_trabajador', 'ruta'],
      'COMPRAS DE SUMINISTROS': [
        'comprobante',
        'banco',
        'proveedor',
        'ruc',
        'numero_cuenta_proveedor',
        'serie',
        'numero',
      ],
      'PASAJES AEREOS': ['trabajador', 'origen_viaje', 'destino_viaje', 'codigo_pago_viaje'],
    };

    const fields = tipoFieldsMap[tipo] || [];
    fields.forEach((field) => {
      this.programacionPagoForm.get(field)?.setValidators([Validators.required]);
      this.programacionPagoForm.get(field)?.updateValueAndValidity();
    });
  }

  getProveedorNumeroCuenta() {
    const proveedor = this.programacionPagoForm.get('proveedor')?.getRawValue();
    const banco = this.programacionPagoForm.get('banco')?.getRawValue();
    const moneda = this.programacionPagoForm.get('moneda')?.getRawValue();
    if (proveedor && banco && moneda) {
      this._proveedorService.getNumerosCuenta(proveedor.id, banco.id, moneda.id).subscribe({
        next: (numeros_cuenta) => {
          this.proveedorNumerosCuenta = numeros_cuenta.map((cuenta) => cuenta.numero_cuenta);
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }

  downloadFile(file: File): void {
    const url = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  downloadArchivo(fileId: string, nombre: string) {
    this._awsService.getArchivo(fileId).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/octet-stream' }); // Cambia el tipo de contenido según el tipo de archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
        // Maneja el error según tus necesidades
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      this.programacionPagoForm.controls['files'].setValue([
        ...this.programacionPagoForm.controls['files'].value,
        ...filesArray,
      ]);
    }
  }

  removeFile(index: number): void {
    const files = this.programacionPagoForm.controls['files'].value as File[];
    files.splice(index, 1);
    this.programacionPagoForm.controls['files'].setValue(files);
  }
  removeArchivo(id: string): void {
    console.log(id);
    const files = this.programacionPagoForm.controls['archivos'].value as { id: string; nombre: string }[];
    console.log(files);
    const index = files.findIndex((file) => file.id === id);
    console.log(index);
    files.splice(index, 1);
    this.programacionPagoForm.controls['archivos'].setValue(files);
  }
  onNoClick(): void {
    // this.dialogRef.close();
  }
}
