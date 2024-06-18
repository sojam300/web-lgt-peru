import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationExtras,
  Router,
  RouterModule,
} from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { QueryParams } from '../../../interfaces/requerimiento';
import { BUSCAR_TAKE } from '../../../../environments/environment';
import { ToastService } from '../../../services/error.service';
import { CatalogoEstadoService } from '../../../services/catalogo-estado.service';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../modules/material/material.module';
import { ButtonIconComponent } from '../../../shared/button-icon/button-icon.component';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import {
  BusquedaSolicitudProgramacion,
  ProgramacionSolicitudes,
} from '../../../interfaces/programacion-solicitudes';
import { ProgramacionCajaEgresoFormComponent } from '../programacion-caja-egreso-form/programacion-caja-egreso-form.component';
import { Observable, forkJoin, of } from 'rxjs';
import { ComprobanteSelect } from '../../../interfaces/comprobante';
import { ComprobanteService } from '../../../services/comprobante.service';
import { BancoService } from '../../../services/banco.service';
import { BancoSelect } from '../../../interfaces/banco';
import { CatalogoEstado } from '../../../interfaces/catalogo-estado';
import { ProveedorSelect } from '../../../interfaces/proveedor';
import { ProgramacionPagosService } from '../../../services/programacion-pagos.service';
import { AwsService } from '../../../services/aws.service';
import { formatNumber, formatNumberToString } from '../../../common/helpers';
import { EmpresaSelect } from '../../../interfaces/empresa';
import { EmpresaService } from '../../../services/empresa.service';
import { SedeSelect } from '../../../interfaces/sede';
import { SedeService } from '../../../services/sede.service';
import { UserSelect, UsuariosLista } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-programacion-caja-egreso-list',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    CommonModule,
    FormsModule,
    SpinnerComponent,
    MaterialModule,
    ButtonIconComponent,
    SidenavComponent,
  ],
  templateUrl: './programacion-caja-egreso-list.component.html',
  styleUrl: './programacion-caja-egreso-list.component.css',
})
export class ProgramacionCajaEgresoListComponent implements OnInit {
  isSubmitting: boolean = false;
  isDataloading: boolean = false;
  fechaDesde: Date = new Date();
  fechaHasta: Date = new Date();

  params = new HttpParams();
  queryParams: BusquedaSolicitudProgramacion = {
    page_index: 0,
    page_size: 5,
    codigo: '',
    fecha_desde: this.fechaDesde ? this.fechaDesde.toISOString() : undefined,
    fecha_hasta: this.fechaHasta ? this.fechaHasta.toISOString() : undefined,
    id_estado: '',
    id_tipo: '',
  };

  totalRows: number = 0;
  isNoMoreData: boolean = false;
  takeTamanio: number = BUSCAR_TAKE;

  loadingBuscar: boolean = false;
  loadingCargar: boolean = false;

  // programacionSolicitudForm: FormGroup;
  programacionSolicitudArray: FormArray;
  displayedColumns = ['codigo', 'estado', 'tipo', 'fecha_solicitud', 'total'];
  programacionSolicitudes: ProgramacionSolicitudes[] = [];

  dataSource = new MatTableDataSource<any>();

  tipoProgramacionSolicitud: string[] = [
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
  proveedores: ProveedorSelect[] = [];
  comprobantes: ComprobanteSelect[] = [];
  bancos: BancoSelect[] = [];
  empresas: EmpresaSelect[] = [];
  sedes: SedeSelect[] = [];
  paises: CatalogoEstado[] = [];
  estadosSolicitudProgramacon: CatalogoEstado[] = [];
  tiposMoneda: CatalogoEstado[] = [];
  tiposPago: CatalogoEstado[] = [];
  tiposSeguros: CatalogoEstado[] = [];
  tiposAfp: CatalogoEstado[] = [];
  tiposSolicitudProgramacion: CatalogoEstado[] = [];
  estadosSolicitudProgramacion: CatalogoEstado[] = [];
  trabajadores: UserSelect[] = [];
  esSolicitud: boolean = false;
  esProgramacion: boolean = false;
  displayedColumns2: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource2 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource2 = new MatTableDataSource<any>([]);
  totalItems = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _toastService: ToastService,
    private _catalogoEstadoService: CatalogoEstadoService,
    private _comprobanteService: ComprobanteService,
    private _bancoService: BancoService,
    private _empresaService: EmpresaService,
    private _sedeService: SedeService,
    private _programacionPagoService: ProgramacionPagosService,
    private _userService: UserService,
    private _awsService: AwsService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.programacionSolicitudArray = this.fb.array([]);
    moment.tz.setDefault('America/Lima');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.queryParams.page_index = params['page_index'] || 0;
      this.queryParams.page_size = params['page_size'] || 5;
      this.queryParams.codigo = params['codigo'] || '';
      this.queryParams.fecha_desde =
        params['fecha_desde'] || this.fechaDesde.toISOString();
      this.queryParams.fecha_hasta =
        params['fecha_hasta'] || this.fechaHasta.toISOString();
      this.queryParams.id_estado = params['id_estado'] || '';
      this.queryParams.id_tipo = params['id_tipo'] || '';
    });

    this._catalogoEstadoService
      .getGrupo(this._catalogoEstadoService.tiposSolicitudProgramacion)
      .subscribe({
        next: (tipos) => {
          this.tiposSolicitudProgramacion = tipos;
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    this._catalogoEstadoService
      .getGrupo(this._catalogoEstadoService.estadosSolicitudProgramacion)
      .subscribe({
        next: (estados) => {
          this.estadosSolicitudProgramacion = estados;
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    this.route.data.subscribe((data) => {
      console.log(data, 'data desde ruta');
      this.esSolicitud = data['esSolicitud'];
      this.esProgramacion = data['esProgramacion'];
    });

    // this.estadosSolicitudProgramacion = this.getEstadosSolicitudProgramacion();
    // this.tiposSolicitudProgramacion= this.getTiposSolicitudProgramacion(),

    this._catalogoEstadoService
      .getGrupo(this._catalogoEstadoService.estadosSolicitudProgramacion)
      .subscribe({
        next: (estados) => {
          console.log(estados, 'estados');
          this.estadosSolicitudProgramacion = estados;
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });

    this.loadData();
  }
  onFechaDesdeChange(event: any) {
    const fecha = moment(event.value).format('YYYY-MM-DDTHH:mm:ss.SSS');
    this.queryParams.fecha_desde = fecha;
  }
  onFechaHastaChange(event: any) {
    const fecha = moment(event.value).format('YYYY-MM-DDTHH:mm:ss.SSS');
    this.queryParams.fecha_hasta = fecha;
  }
  // Método para actualizar los queryParams y navegar a la misma ruta
  // actualizarQueryParams() {
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: this.queryParams,
  //   };
  //   // Navegar a la misma ruta pero con nuevos queryParams
  //   this.router.navigate([], navigationExtras);
  // }

  onPageChange(event: any) {
    this.loadData();
  }
  get items(): FormArray {
    return this.programacionSolicitudArray;
  }

  loadData() {
    this.isDataloading = true;
    // this.actualizarQueryParams();
    this.queryParams.page_index = this.paginator ? this.paginator.pageIndex : 0;
    this.queryParams.page_size = this.paginator ? this.paginator.pageSize : 5;

    this._programacionPagoService.findAll(this.queryParams).subscribe({
      next: (programaciones) => {
        console.log(programaciones);
        while (this.programacionSolicitudArray.length !== 0) {
          this.programacionSolicitudArray.removeAt(0);
        }
        if (programaciones.transformData.length > 0) {
          this.totalItems = programaciones.total;
          programaciones.transformData.forEach((programacion) => {
            this.items.push(this.createItemFormGroup(programacion));
          });
        }
        this.updateDataSource();
        this.isDataloading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isDataloading = false;
        return this._toastService.msgError(error);
      },
    });
  }
  formatearFecha(date: Date) {
    return moment(date).format('DD/MM/YYYY');
  }

  createItemFormGroup(data?: ProgramacionSolicitudes): FormGroup {
    return this.fb.group({
      id: [data?.id || ''],
      codigo: [data?.codigo || 'AUTOGENERADO'],
      estado: [data?.estado || ''],
      tipo: [data?.tipo || ''],
      usuario_solicitud: [data?.usuario_solicitud || ''],
      fecha_solicitud: [data?.fecha_solicitud || ''],
      fecha_tentativa_pago: [data?.fecha_tentativa_pago || ''],
      tipo_pago: [data?.tipo_pago || ''],
      tipo_seguro: [data?.tipo_seguro || ''],
      tipo_afp: [data?.tipo_afp || ''],
      comprobante: [data?.comprobante || ''],
      proveedor: [data?.proveedor || ''],
      sede: [data?.sede || ''],
      moneda: [data?.moneda || ''],
      banco: [data?.banco || ''],
      empresa: [data?.empresa || ''],
      banco_origen: [data?.banco_origen || ''],
      banco_destino: [data?.banco_destino || ''],
      empresa_origen: [data?.empresa_origen || ''],
      empresa_destino: [data?.empresa_destino || ''],
      numero_cuenta: [data?.numero_cuenta || ''],
      numero_cuenta_origen: [data?.numero_cuenta_origen || ''],
      numero_cuenta_destino: [data?.numero_cuenta_destino || ''],
      numero_cuenta_proveedor: [data?.numero_cuenta_proveedor || ''],
      numero_contrato: [data?.numero_contrato || ''],
      numero_cuota: [data?.numero_cuota || ''],
      trabajador: [data?.trabajador || ''],
      numero_cuenta_trabajador: [data?.numero_cuenta_trabajador || ''],
      tipo_deposito: [data?.tipo_deposito || ''],
      numero_requerimiento: [data?.numero_requerimiento || ''],
      ruc: [data?.ruc || ''],
      pais: [data?.pais || ''],
      mes: [data?.mes || ''],
      ruta: [data?.ruta || ''],
      origen_viaje: [data?.origen_viaje || ''],
      destino_viaje: [data?.destino_viaje || ''],
      codigo_pago_viaje: [data?.codigo_pago_viaje || ''],
      serie: [data?.serie || ''],
      numero: [data?.numero || ''],
      total: [data?.total || ''],
      tasa_detraccion: [data?.tasa_detraccion || ''],
      total_detraccion: [data?.total_detraccion || ''],
      tasa_retencion: [data?.tasa_retencion || ''],
      total_retencion: [data?.total_retencion || ''],
      total_igv: [data?.total_igv || ''],
      a_pagar: [data?.a_pagar || ''],
      glosa: [data?.glosa || ''],
      files: new FormControl([]),
      archivos: [data?.archivos || ''],
      // detalleTipo: this.fb.group({}),
    });
  }
  updateDataSource(): void {
    this.dataSource.data = this.items.controls.map(
      (detalle: any) => detalle.value
    );
  }
  addItem(item?: ProgramacionSolicitudes): void {
    this.items.push(this.createItemFormGroup(item));
    this.updateDataSource();
  }
  editItem(index: number): void {
    this.items.at(index);
    this.updateDataSource();
  }
  removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateDataSource();
  }
  openDialog(item?: ProgramacionSolicitudes): void {
    this.isDataloading = true;
    console.log(item, '*** ITEM **');
    forkJoin({
      comprobantes: this.getComprobantes(),
      bancos: this.getbancos(),
      tiposMoneda: this.getTipoMonedas(),
      tiposSolicitudProgramacion: this.getTiposSolicitudProgramacion(),
      estadosSolicitudProgramacion: this.getEstadosSolicitudProgramacion(),
      tiposPago: this.getTiposPago(),
      tiposSeguros: this.getTiposSeguro(),
      tiposAfp: this.getTiposAfp(),
      sedes: this.getSedes(),
      paises: this.getPaises(),
      empresas: this.getEmpresas(),
      trabajadores: this.getTrabajadores(),
    }).subscribe({
      next: ({
        comprobantes,
        bancos,
        tiposMoneda,
        tiposSolicitudProgramacion,
        estadosSolicitudProgramacion,
        tiposAfp,
        tiposPago,
        tiposSeguros,
        sedes,
        paises,
        empresas,
        trabajadores,
      }) => {
        this.isDataloading = false;

        this.comprobantes = comprobantes;
        this.bancos = bancos;
        this.tiposMoneda = tiposMoneda;
        this.tiposSolicitudProgramacion = tiposSolicitudProgramacion;
        this.estadosSolicitudProgramacion = estadosSolicitudProgramacion;
        this.tiposAfp = tiposAfp;
        this.tiposSeguros = tiposSeguros;
        this.tiposPago = tiposPago;
        this.sedes = sedes;
        this.paises = paises;
        this.empresas = empresas;
        this.trabajadores = trabajadores;

        const dialogRef = this.dialog.open(
          ProgramacionCajaEgresoFormComponent,
          {
            maxWidth: '90vw',
            maxHeight: '95vh',
            minHeight: '90%',
            minWidth: '80%',
            panelClass: 'full-screen-modal',
            data: item
              ? {
                  form: {
                    ...item,
                    tipo: this.tiposSolicitudProgramacion.find(
                      (tipo) => tipo.id === item.tipo?.id
                    ),

                    comprobante: this.comprobantes.find(
                      (c) => c.id === item.comprobante?.id
                    ),
                    pais: this.paises.find((p) => p.id === item.pais?.id),
                    sede: this.sedes.find((b) => b.id === item.sede?.id),
                    banco: this.bancos.find((b) => b.id === item.banco?.id),
                    banco_origen: this.bancos.find(
                      (b) => b.id === item.banco_origen?.id
                    ),
                    banco_destino: this.bancos.find(
                      (b) => b.id === item.banco_destino?.id
                    ),
                    empresa: this.empresas.find(
                      (b) => b.id === item.empresa?.id
                    ),
                    empresa_origen: this.empresas.find(
                      (b) => b.id === item.empresa_origen?.id
                    ),
                    empresa_destino: this.empresas.find(
                      (b) => b.id === item.empresa_destino?.id
                    ),
                    moneda: this.tiposMoneda.find(
                      (m) => m.id === item.moneda?.id
                    ),
                    estado: this.estadosSolicitudProgramacion.find(
                      (estado) => estado.id === item.estado?.id
                    ),
                    trabajador: this.trabajadores.find(
                      (trabajador) => trabajador.id === item.trabajador?.id
                    ),
                    tipo_pago: this.tiposPago.find(
                      (pago) => pago.id === item.tipo_pago?.id
                    ),
                    tipo_seguro: this.tiposSeguros.find(
                      (seguro) => seguro.id === item.tipo_seguro?.id
                    ),
                    tipo_afp: this.tiposAfp.find(
                      (tipo_afp) => tipo_afp.id === item.tipo_afp?.id
                    ),
                  },
                  esSolicitud: this.esSolicitud,
                  esProgramacion: this.esProgramacion,
                  comprobantes: this.comprobantes,
                  bancos: this.bancos,
                  tiposMoneda: this.tiposMoneda,
                  tiposAfp: this.tiposAfp,
                  tiposSolicitudProgramacion: this.tiposSolicitudProgramacion,
                  estadosSolicitudProgramacion:
                    this.estadosSolicitudProgramacion,
                  tiposSeguros: this.tiposSeguros,
                  tiposPago: this.tiposPago,
                  sedes: this.sedes,
                  paises: this.paises,
                  empresas: this.empresas,
                  trabajadores: this.trabajadores,
                }
              : {
                  form: this.fb.group({}),
                  comprobantes: this.comprobantes,
                  bancos: this.bancos,
                  tiposMoneda: this.tiposMoneda,
                  tiposAfp: this.tiposAfp,
                  tiposSolicitudProgramacion: this.tiposSolicitudProgramacion,
                  esSolicitud: this.esSolicitud,
                  esProgramacion: this.esProgramacion,
                  estadosSolicitudProgramacion:
                    this.estadosSolicitudProgramacion,
                  tiposSeguros: this.tiposSeguros,
                  tiposPago: this.tiposPago,
                  sedes: this.sedes,
                  paises: this.paises,
                  empresas: this.empresas,
                  trabajadores: this.trabajadores,
                },
          }
        );

        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'delete') {
            if (item) {
              const index = this.programacionSolicitudArray.controls.findIndex(
                (detalle: AbstractControl) => {
                  return detalle.value === item; // Comparar por el id del detalle
                }
              );
              this.removeItem(index);
            }
          } else if (result) {
            if (item) {
              const index = this.items.controls.findIndex(
                (detalle: AbstractControl) => {
                  return detalle.value === item; // Comparar por el id del detalle
                }
              );
              if (index !== -1) {
                const formData = new FormData();
                for (let i = 0; i < result.files.length; i++) {
                  formData.append('files', result.files[i]);
                }
                console.log(result, 'RESULT PARCHANDO');
                this.items.at(index).patchValue(result);
                this.updateDataSource();
              }
            } else {
              // result.archivos = archivos;
              this.addItem(result);
            }
          }
        });
      },
    });
  }

  getComprobantes(): Observable<ComprobanteSelect[]> {
    if (this.comprobantes.length === 0) {
      return this._comprobanteService.getAllToSelect();
    } else {
      return of(this.comprobantes);
    }
  }
  getEmpresas(): Observable<EmpresaSelect[]> {
    if (this.empresas.length === 0) {
      return this._empresaService.getAll();
    } else {
      return of(this.empresas);
    }
  }
  getbancos(): Observable<BancoSelect[]> {
    if (this.bancos.length === 0) {
      return this._bancoService.getAll2();
    } else {
      return of(this.bancos);
    }
  }
  getSedes(): Observable<SedeSelect[]> {
    if (this.sedes.length === 0) {
      return this._sedeService.getList2();
    } else {
      return of(this.sedes);
    }
  }

  getPaises(): Observable<CatalogoEstado[]> {
    if (this.paises.length === 0) {
      return this._catalogoEstadoService.getGrupo(
        this._catalogoEstadoService.paises
      );
    } else {
      return of(this.paises);
    }
  }

  getTipoMonedas(): Observable<CatalogoEstado[]> {
    if (this.tiposMoneda.length === 0) {
      return this._catalogoEstadoService.getTiposMoneda();
    } else {
      return of(this.tiposMoneda);
    }
  }
  getTiposSolicitudProgramacion(): Observable<CatalogoEstado[]> {
    if (this.tiposSolicitudProgramacion.length === 0) {
      return this._catalogoEstadoService.getGrupo(
        this._catalogoEstadoService.tiposSolicitudProgramacion
      );
    } else {
      return of(this.tiposSolicitudProgramacion);
    }
  }
  getEstadosSolicitudProgramacion(): Observable<CatalogoEstado[]> {
    if (this.estadosSolicitudProgramacion.length === 0) {
      return this._catalogoEstadoService.getGrupo(
        this._catalogoEstadoService.estadosSolicitudProgramacion
      );
    } else {
      return of(this.estadosSolicitudProgramacion);
    }
  }
  getTiposPago(): Observable<CatalogoEstado[]> {
    if (this.tiposPago.length === 0) {
      return this._catalogoEstadoService.getGrupo(
        this._catalogoEstadoService.tiposPagos
      );
    } else {
      return of(this.tiposPago);
    }
  }
  getTiposSeguro(): Observable<CatalogoEstado[]> {
    if (this.tiposSeguros.length === 0) {
      return this._catalogoEstadoService.getGrupo(
        this._catalogoEstadoService.tiposSeguros
      );
    } else {
      return of(this.tiposSeguros);
    }
  }
  getTiposAfp(): Observable<CatalogoEstado[]> {
    if (this.tiposAfp.length === 0) {
      return this._catalogoEstadoService.getGrupo(
        this._catalogoEstadoService.tiposAfp
      );
    } else {
      return of(this.tiposAfp);
    }
  }
  getTrabajadores(): Observable<UserSelect[]> {
    if (this.trabajadores.length === 0) {
      return this._userService.getTrabajadores();
    } else {
      return of(this.trabajadores);
    }
  }
  formatearNumero(numero: number) {
    return formatNumberToString(numero);
  }
}
