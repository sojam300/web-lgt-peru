import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ModalLiquidacionComponent } from '../../../shared/modal-liquidacion/modal-liquidacion.component';
import {
  DetalleValidaciones,
  Detalles,
  Hospedaje,
  PasajeValidaciones,
  Pasaje,
  Requerimiento,
  RequerimientoInputReq,
  RutaValidaciones,
  Rutas,
  HospedajeValidaciones,
  Alimento,
  AlimentoValidaciones,
  Traslado,
  TrasladoValidaciones,
  Otro,
  OtroValidaciones,
} from '../../../interfaces/requerimiento';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CatalogoEstadoService } from '../../../services/catalogo-estado.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastService } from '../../../services/error.service';
import { CatalogoEstado } from '../../../interfaces/catalogo-estado';
import { GastosViaticoService } from '../../../services/gastos-viatico.service';
import { GastosViatico } from '../../../interfaces/gastos-viatico';
import {
  formatFecha,
  formatFechaNull,
  formatNumber,
  formatNumberToString,
  revertFormatNumber,
} from '../../../common/helpers';
import { EditIconComponent } from '../../../shared/edit-icon/edit-icon.component';
import { DeleteIconComponent } from '../../../shared/delete-icon/delete-icon.component';
import { UserService } from '../../../services/user.service';
import { AreasByUsuario } from '../../../interfaces/user';

import * as bootstrap from 'bootstrap';
import { agregado, creado, debeCrearAntesUnaCaja, editado, eliminado, removido } from '../../../common/message';
import { RequerimientoService } from '../../../services/requerimiento.service';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { ProveedorService } from '../../../services/proveedor.service';
import { LiquidacionService } from '../../../services/liquidacion.service';
import { Liquidacion } from '../../../interfaces/liquidacion';
import {
  ALIMENTACION,
  HOSPEDAJES,
  NOMBRE_CAJA_GRANDE,
  OTROS,
  PENDIENTE,
  TIPO_REQ_PASAJES,
  TRASLADOS,
} from '../../../../environments/environment';
import { SwalertService } from '../../../services/swalert.service';

@Component({
  selector: 'app-req-viaticos-formulario',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    ModalLiquidacionComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    EditIconComponent,
    DeleteIconComponent,
  ],
  templateUrl: './requerimiento-viaticos-form.component.html',
  styleUrl: './requerimiento-viaticos-form.component.css',
})
export class RequerimientoViaticosFormComponent implements OnInit {
  myModalHospedaje!: any;
  myModalPasajes: any;
  myModalAlimentacion: any;
  myModalTraslados: any;
  myModalOtros: any;
  myModalLiquidacion: any;
  isDeleteModalHospedaje: boolean = false;
  isDeleteModalPasajes: boolean = false;
  isDeleteModalAlimentacion: boolean = false;
  isDeleteModalTraslado: boolean = false;
  isDeleteModalOtros: boolean = false;
  rutaValidaciones = {
    fecha: false,
    id_ciudad_origen: false,
    id_ciudad_destino: false,
    monto_format: false,
  };
  requerimientoVal = {
    fecha_inicio: false,
    fecha_fin: false,
    id_area: false,
    descripcion: false,
  };
  detalleVal = {
    fecha: false,
    id_ciudad: false,
    // nombre_ciudad: false,
    // id_gastos_viaticos: true,
    monto_format: false,
  };
  pasajesFormVal = {
    fecha: false,
    id_ciudad_origen: false,
    id_ciudad_destino: false,
    monto_format: false,
  };

  pasajesInit: Pasaje = {
    id: null,
    fecha: '',
    id_estado: '',
    estado: {
      nombre: '',
      valor: 0,
    },
    id_tipo: '',
    tipo: {
      nombre: '',
      valor: 0,
    },
    id_ciudad_origen: '',
    ciudad_origen: {
      nombre: '',
      valor: 0,
    },
    id_ciudad_destino: '',
    ciudad_destino: {
      nombre: '',
      valor: 0,
    },
    monto: 0,
    monto_format: '',
    observacion: '',
    index: -1,
  };
  hospedajeFormVal = {
    id_ciudad: false,
    fecha_inicio: false,
    fecha_fin: false,
    monto_format: false,
  };
  hospedajeInit: Hospedaje = {
    id: null,
    id_estado: '',
    estado: {
      nombre: '',
      valor: 0,
    },
    id_tipo: '',
    tipo: {
      nombre: '',
      valor: 0,
    },
    fecha_inicio: '',
    fecha_fin: '',
    id_ciudad: '',
    ciudad: {
      nombre: '',
    },
    noches: 0,
    monto: 0,
    monto_format: '',
    es_gestionado: false,
    observacion: '',
    index: -1,
  };
  alimentoFormVal = {
    fecha_inicio: false,
    fecha_fin: false,
    monto_format: false,
  };
  alimentoInit: Alimento = {
    id: null,
    id_estado: '',
    estado: {
      nombre: '',
      valor: 0,
    },
    id_tipo: '',
    tipo: {
      nombre: '',
      valor: 0,
    },
    fecha_inicio: '',
    fecha_fin: '',
    dias: 0,
    detalle: '',
    monto: 0,
    monto_format: '',
    observacion: '',
    index: -1,
  };
  trasladoFormVal = {
    fecha: false,
    id_ciudad: false,
    lugar_origen: false,
    lugar_destino: false,
    monto_format: false,
  };
  trasladoInit: Traslado = {
    id: null,
    id_estado: '',
    estado: {
      nombre: '',
      valor: 0,
    },
    id_tipo: '',
    tipo: {
      nombre: '',
      valor: 0,
    },
    id_ciudad: '',
    ciudad: {
      nombre: '',
    },
    fecha: '',
    lugar_origen: '',
    lugar_destino: '',
    detalle: '',
    monto: 0,
    monto_format: '',
    observacion: '',
    index: -1,
  };
  otroFormVal = {
    tipo_otros: false,
    monto_format: false,
  };
  otroInit: Otro = {
    id: null,
    id_estado: '',
    estado: {
      nombre: '',
      valor: 0,
    },
    id_tipo: '',
    tipo: {
      nombre: '',
      valor: 0,
    },
    tipo_otros: '',
    detalle: '',
    lugar_origen: '',
    lugar_destino: '',
    monto: 0,
    monto_format: '',
    observacion: '',
    index: -1,
  };

  requerimiento: Requerimiento = {
    id: null,
    estado: { nombre: '', valor: 1 },
    id_estado: '',
    id_tipo: '',
    tipo: { nombre: '' },
    fecha_inicio: '',
    fecha_fin: '',
    total_dias: 0,
    id_area: '',
    area: { nombre: '' },
    id_usuario: '',
    user: { nombres: '', apellidos: '' },
    descripcion: '',
    observacion: '',
    requerimiento_detalle: [],
    liquidacion: [],

    monto_total: '',
  };
  detalleInit: Detalles = {
    id: null,
    id_estado: null,
    estado: {
      nombre: '',
      valor: 0,
    },
    id_tipo: null,
    tipo: {
      nombre: '',
      valor: 0,
    },
    id_requerimiento: null,
    fecha: null,
    fecha_inicio: null,
    fecha_fin: null,
    id_ciudad_origen: null,
    ciudad_origen: {
      nombre: '',
      valor: 0,
    },
    id_ciudad_destino: null,
    ciudad_destino: {
      nombre: '',
      valor: 0,
    },
    id_ciudad: null,
    ciudad: {
      nombre: '',
      valor: 0,
    },
    lugar_origen: null,
    lugar_destino: null,
    detalle_visita: null,
    tipo_otros: null,
    dias: 0,
    noches: 0,
    es_gestionado: false,
    monto: 0,
    monto_format: '',
    detalle: null,
    observacion: null,
    usuario_creacion: {
      nombre: '',
    },
    fecha_creacion: null,
    usuario_edicion: {
      nombre: '',
    },
    fecha_edicion: null,
    index: -1,
  };
  // ruta: Rutas = { ...this.rutaInit };
  pasaje: Detalles = { ...this.detalleInit };
  pasajes: Detalles[] = [];
  hospedaje: Detalles = { ...this.detalleInit };
  hospedajes: Detalles[] = [];
  alimento: Detalles = { ...this.detalleInit };
  alimentos: Detalles[] = [];
  traslado: Detalles = { ...this.detalleInit };
  traslados: Detalles[] = [];
  otro: Detalles = { ...this.detalleInit };
  otros: Detalles[] = [];
  tiposReqDetalle: CatalogoEstado[] = [];

  detalle_monto: string = '';
  ruta_monto: string = '';
  pasaje_monto: string = '';
  hospedaje_monto: string = '';
  alimento_monto: string = '';
  traslado_monto: string = '';
  otro_monto: string = '';
  detalle: Detalles = { ...this.detalleInit };

  ciudades: CatalogoEstado[] = [];
  estadosRequemiento: CatalogoEstado[] = [];
  gastosViatico: GastosViatico[] = [];
  areas: AreasByUsuario[] = [];
  tiposCaja: CatalogoEstado[] = [];
  liquidaciones: Liquidacion[] = [];
  selectedDetalleCiudad: string = '';

  razon_social_buscar = '';
  se_guardo_requerimiento = false;
  @ViewChild(ModalLiquidacionComponent) modalLiquidacion!: ModalLiquidacionComponent;
  resumen_total_format: string = '';
  resumen_a_pagar_format: string = '';
  resumen_igv_format: string = '';

  constructor(
    private _requerimientoService: RequerimientoService,
    private toastr: ToastrService,
    private _catalogoEstadoService: CatalogoEstadoService,
    private _toastService: ToastService,
    private _usuarioService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private _proveedorService: ProveedorService,
    private _liquidacionService: LiquidacionService,
    private elementRef: ElementRef,
    private _swalertService: SwalertService
  ) {}

  ngOnInit(): void {
    const idRequerimiento = this.route.snapshot.paramMap.get('id');
    // const stateReq = history.state.requerimiento;
    // Suscribirse a los cambios en los parámetros de la ruta

    if (idRequerimiento) {
      this._requerimientoService.findRequermientoById(idRequerimiento).subscribe({
        next: (r) => {
          console.log(r, 'REQUERIMIENTO');
          this.requerimiento = r;

          let montoRuta = 0;
          let montoDetalle = 0;
          this.requerimiento.fecha_inicio = moment(this.requerimiento.fecha_inicio).format('YYYY-MM-DD');
          this.requerimiento.fecha_fin = moment(this.requerimiento.fecha_fin).format('YYYY-MM-DD');

          if (this.requerimiento.requerimiento_detalle.length > 0) {
            this.requerimiento.requerimiento_detalle.forEach((d) => {
              d.fecha = formatFechaNull(d.fecha);
              d.fecha_inicio = formatFechaNull(d.fecha_inicio);
              d.fecha_fin = formatFechaNull(d.fecha_fin);
              // d.gastos_viaticos = { nombre: d.gastos_viaticos?.nombre ?? 'Otros' };
              d.monto_format = formatNumber(d.monto.toString());
              montoDetalle += parseFloat(d.monto.toString());
            });
          }

          this.ruta_monto = formatNumber(montoRuta.toString());
          this.detalle_monto = formatNumber(montoDetalle.toString());
          // SET PASAJES
          this.pasajes = this.requerimiento.requerimiento_detalle.filter(
            (req_det) => req_det.tipo.nombre.toUpperCase() === TIPO_REQ_PASAJES
          );
          this.setMontosPasajes();
          // SET HOSPEDAJES
          this.hospedajes = this.requerimiento.requerimiento_detalle.filter(
            (req_det) => req_det.tipo.nombre.toUpperCase() === HOSPEDAJES
          );
          this.setMontosHospedaje();
          // SET ALIMENTACION
          this.alimentos = this.requerimiento.requerimiento_detalle.filter(
            (req_det) => req_det.tipo.nombre.toUpperCase() === ALIMENTACION
          );
          this.setMontosAlimentacion();
          // SET TRASLADOS
          this.traslados = this.requerimiento.requerimiento_detalle.filter(
            (req_det) => req_det.tipo.nombre.toUpperCase() === TRASLADOS
          );
          this.setMontosTraslado();
          // SET OTROS
          this.otros = this.requerimiento.requerimiento_detalle.filter(
            (req_det) => req_det.tipo.nombre.toUpperCase() === OTROS
          );
          this.setFinishOtro();

          this.getLiquidaciones();
          // ESTADO
          const indexEstadoRequerimiento = this.estadosRequemiento.findIndex(
            (estado) => estado.id === this.requerimiento.id_estado
          );
          if (indexEstadoRequerimiento >= 0) {
            this.estadosRequemiento[indexEstadoRequerimiento].existe = true;
          }
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
    }

    const currUsuario = localStorage.getItem('idusuario') ?? '';

    // this.myModalLiquidacion = new bootstrap.Modal('#modalLiquidacion');
    // this.myModalLiquidacion._element.addEventListener('hide.bs.modal', () => {
    //   if (this.modalLiquidacion.se_guardo_liquidacion === true) {
    //     this.getLiquidaciones();
    //     this.modalLiquidacion.se_guardo_liquidacion = false;
    //   }
    // });
    this.myModalHospedaje = new bootstrap.Modal(this.elementRef.nativeElement.querySelector('#modalFormHospedaje'));
    // this.myModalHospedaje.o('hide.bs.modal', () => {
    //   this.isDeleteModalHospedaje = false;
    //   this.hospedaje = { ...this.detalleInit };
    // });
    this.myModalPasajes = new bootstrap.Modal(this.elementRef.nativeElement.querySelector('#modalFormPasajes'));
    this.myModalPasajes._element.addEventListener('hide.bs.modal', () => {
      this.isDeleteModalPasajes = false;
      this.pasaje = { ...this.detalleInit };
    });
    this.myModalAlimentacion = new bootstrap.Modal(
      this.elementRef.nativeElement.querySelector('#modalFormAlimentacion')
    );
    this.myModalAlimentacion._element.addEventListener('hide.bs.modal', () => {
      this.isDeleteModalAlimentacion = false;
      this.alimento = { ...this.detalleInit };
    });

    this.myModalTraslados = new bootstrap.Modal(this.elementRef.nativeElement.querySelector('#modalFormTraslados'));
    this.myModalTraslados._element.addEventListener('hide.bs.modal', () => {
      this.isDeleteModalTraslado = false;
      this.traslado = { ...this.detalleInit };
    });
    this.myModalOtros = new bootstrap.Modal(this.elementRef.nativeElement.querySelector('#modalFormOtros'));
    this.myModalOtros._element.addEventListener('hide.bs.modal', () => {
      this.isDeleteModalOtros = false;
      this.otro = { ...this.detalleInit };
    });

    this._catalogoEstadoService.getCiudades().subscribe({
      next: (v) => {
        this.ciudades = v;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });

    this._catalogoEstadoService.getEstadosRequerimiento().subscribe({
      next: (estadosReq) => {
        this.estadosRequemiento = estadosReq;
        this.requerimiento.id_estado = this.estadosRequemiento.find((eq) => eq.valor === 1)?.id ?? '';
        // ESTADO
        const indexEstadoRequerimiento = this.estadosRequemiento.findIndex(
          (estado) => estado.id === this.requerimiento.id_estado
        );
        if (indexEstadoRequerimiento >= 0) {
          this.estadosRequemiento[indexEstadoRequerimiento].existe = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });

    this._catalogoEstadoService.getTiposRequerimiento().subscribe({
      next: (tiposReq) => {
        this.requerimiento.id_tipo = tiposReq.find((tr) => tr.nombre === 'Viaticos')?.id ?? '';
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });

    this._usuarioService.getAreasByIdUsuario(currUsuario).subscribe({
      next: (a) => {
        this.areas = a;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
    this._catalogoEstadoService.getTiposCaja().subscribe({
      next: (tiposCajas) => {
        this.tiposCaja = tiposCajas;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
    this._catalogoEstadoService.getTiposRequerimientoDetalle().subscribe({
      next: (tiposReqDet) => {
        this.tiposReqDetalle = tiposReqDet;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
  }

  setResumenMontosLiquidacion() {
    let montoTotal = 0;
    let montoIgv = 0;
    let montoAPagar = 0;
    this.liquidaciones.forEach((liquidacion) => {
      montoTotal += +liquidacion.total;
      montoIgv += +liquidacion.total_igv;
      montoAPagar += +liquidacion.a_pagar;
    });
    console.log(montoTotal, 'montoTotal');
    this.resumen_total_format = formatNumber(montoTotal.toString());
    this.resumen_igv_format = formatNumber(montoIgv.toString());
    this.resumen_a_pagar_format = formatNumber(montoAPagar.toString());
  }

  getLiquidaciones() {
    if (this.requerimiento.id) {
      this._liquidacionService.findLiquidacionesByRequerimiento(this.requerimiento.id).subscribe({
        next: (liquidaciones) => {
          console.log(liquidaciones, 'LIQUIDACION');
          liquidaciones.forEach((liquidacion) => {
            this.liquidaciones = [...this.liquidaciones, this.modalLiquidacion.formatearLiquidacion(liquidacion)];
          });
          this.setResumenMontosLiquidacion();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
  changeEstadoRequerimiento(estado: number) {
    const findEstado = this.estadosRequemiento.find((e) => e.valor === estado);
    if (this.requerimiento.id && findEstado) {
      this.requerimiento.id_estado = findEstado?.id;

      this._requerimientoService.patchEstadoRequerimiento(this.requerimiento.id, this.requerimiento).subscribe({
        next: (a) => {
          this.requerimiento.estado.valor = estado;
          this._toastService.messageAddOk('Estado modificado correctamente.');
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else {
      return this._toastService.messageError('La accion no está permitida', 'Acceso Denegado!');
    }
  }
  changeGestionadoHospedaje() {
    this.hospedaje.es_gestionado = !this.hospedaje.es_gestionado;
  }
  onChangeReqFechaInicio(fecha: string) {
    this.hospedaje.fecha_fin = fecha;
  }
  onChangeReqFechaFin() {
    this.requerimiento.total_dias =
      moment(this.requerimiento.fecha_fin).diff(this.requerimiento.fecha_inicio, 'days') + 1;
  }
  onChangeHospedajeFechaFin() {
    this.hospedaje.noches = moment(this.hospedaje.fecha_fin).diff(this.hospedaje.fecha_inicio, 'days');
  }

  onChangeHospedajeCiudad(id_ciudad: string) {}

  setEstadoRequerimiento(valor: number) {
    if (this.requerimiento.id) {
      const findEstado = this.estadosRequemiento.find((e) => e.valor === valor);
    }
  }
  setObservacionDetalle() {
    if (this.detalle.id && this.detalle.observacion) {
      this._requerimientoService.patchObsevacionDetalle(this.detalle.id, this.detalle.observacion).subscribe({
        next: (a) => {
          this._toastService.messageAddOk('Se guardo observacion correctamente.');
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else {
      this._toastService.messageError('Accion no permitida.', 'Acceso denegado!');
    }
  }
  setDiasAlimentacion() {
    const diferencia = moment(this.alimento.fecha_fin).diff(this.alimento.fecha_inicio, 'days');
    this.alimento.dias = diferencia >= 0 ? diferencia + 1 : 0;
    this.alimento.monto = 30 * this.alimento.dias;
    this.alimento.monto_format = formatNumber(this.alimento.monto.toString());
  }

  validarInputPasaje(nombreInput: PasajeValidaciones) {
    this.pasajesFormVal[nombreInput] = !this.pasaje[nombreInput] ? true : false;
    return this.pasajesFormVal[nombreInput];
  }
  validarInputHospedaje(nombreInput: HospedajeValidaciones) {
    this.hospedajeFormVal[nombreInput] = !this.hospedaje[nombreInput] ? true : false;
    return this.hospedajeFormVal[nombreInput];
  }
  validarInputTraslado(nombreInput: TrasladoValidaciones) {
    this.trasladoFormVal[nombreInput] = !this.traslado[nombreInput] ? true : false;
    return this.trasladoFormVal[nombreInput];
  }
  validarInputOtros(nombreInput: OtroValidaciones) {
    this.otroFormVal[nombreInput] = !this.otro[nombreInput] ? true : false;
    return this.otroFormVal[nombreInput];
  }
  validarInputAlimento(nombreInput: AlimentoValidaciones) {
    this.alimentoFormVal[nombreInput] = !this.alimento[nombreInput] ? true : false;
    return this.alimentoFormVal[nombreInput];
  }
  validarFormDetalle(input: DetalleValidaciones) {
    this.detalleVal[input] = !this.detalle[input] ? true : false;

    return this.detalleVal[input];
  }
  validarFormRequerimiento(input: RequerimientoInputReq) {
    this.requerimientoVal[input] = !this.requerimiento[input] ? true : false;
    return this.requerimientoVal[input];
  }
  // MODALES
  settipoLiquidacion() {
    this.modalLiquidacion.caja_detalle.id_requerimiento = this.requerimiento.id;
    const findTipoCaja = this.tiposCaja.find((tc) => tc.nombre.toUpperCase() === NOMBRE_CAJA_GRANDE);
    if (findTipoCaja) {
      this.modalLiquidacion.caja_detalle.id_tipo = findTipoCaja.id;
      this.modalLiquidacion.caja_detalle.tipo = findTipoCaja;
      this.modalLiquidacion.caja_detalle.es_caja_chica = false;
    }
  }

  arrayBufferToBase64(buffer: number[]): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  openModalLiquidacion() {
    this.modalLiquidacion.tiposReqDetalle = this.tiposReqDetalle;
    if (this.requerimiento.id === '' || !this.requerimiento.id) {
      return this._toastService.messageInfo('Debe crear un requerimiento.');
    }
    this.settipoLiquidacion();

    this.modalLiquidacion.openModalCreate();
  }

  openModalLiquidacionEdit(id: string) {
    // this.setTipoLiquidacion();

    let findLiquidacion = this.liquidaciones.find((liquidacion) => liquidacion.id === id);
    if (findLiquidacion) this.modalLiquidacion.openModalLiquidacionEdit(findLiquidacion);
  }
  agregarDetalleOpenModal() {
    this.detalle.index = -1;
    this.myModalHospedaje.show();
  }

  openModalHospedajeAgregar() {
    this.hospedaje.index = -1;
    this.myModalHospedaje.show();
  }
  openModalAlimentacionAgregar() {
    this.alimento.index = -1;
    this.myModalAlimentacion.show();
  }
  openModalAlimentacionEdit(i: number) {
    this.alimento = { ...this.alimentos[i] };
    this.alimento.monto_format = revertFormatNumber(this.alimento.monto_format).toString();
    this.alimento.index = i;
    this.myModalAlimentacion.show();
  }
  openModalTrasladosAgregar() {
    this.traslado.index = -1;
    this.myModalTraslados.show();
  }
  openModalOtrosAgregar() {
    this.otro.index = -1;
    this.myModalOtros.show();
  }

  openModalTrasladoEdit(id: string | null) {
    const traslado = this.traslados.find((t) => t.id === id);
    if (traslado) this.traslado = { ...traslado };
    this.traslado.monto_format = revertFormatNumber(this.traslado.monto_format).toString();
    // this.traslado.index = i;
    this.myModalTraslados.show();
  }
  openModalOtroEdit(i: number) {
    this.otro = { ...this.otros[i] };
    this.otro.monto_format = revertFormatNumber(this.otro.monto_format).toString();
    this.otro.index = i;
    this.myModalOtros.show();
  }
  editDetalleOpenModal(i: number) {
    this.detalle = { ...this.requerimiento.requerimiento_detalle[i] };
    this.detalle.monto_format = revertFormatNumber(this.detalle.monto_format).toString();
    this.detalle.index = i;
    this.myModalHospedaje.show();
  }
  openModalPasaje(id: string | null) {
    const pasaje = this.pasajes.find((p) => p.id === id);

    if (pasaje) this.pasaje = { ...pasaje };
    this.pasaje.monto_format = revertFormatNumber(this.pasaje.monto_format).toString();
    // this.pasaje.index = indexPasaje;
    this.myModalPasajes.show();
  }
  openModalHospedaje(id: string | null) {
    const indexHospedaje = this.hospedajes.findIndex((p) => p.id === id);
    this.hospedaje = { ...this.hospedajes[indexHospedaje] };
    this.hospedaje.monto_format = revertFormatNumber(this.hospedaje.monto_format).toString();
    this.hospedaje.index = indexHospedaje;
    this.myModalHospedaje.show();
  }
  openModalDetalle(i: number) {
    this.detalle = { ...this.requerimiento.requerimiento_detalle[i] };
    this.detalle.monto_format = revertFormatNumber(this.detalle.monto_format).toString();
    this.detalle.index = i;
    this.myModalHospedaje.show();
  }

  openModalPasajesAgregar() {
    this.pasaje.index = -1;
    this.myModalPasajes.show();
  }

  openModanEliminarDetalle(index: number) {
    // this.myModalHospedaje = true;
    this.detalle = { ...this.requerimiento.requerimiento_detalle[index] };
    this.detalle.monto_format = revertFormatNumber(this.detalle.monto_format).toString();
    this.detalle.index = index;
    this.myModalHospedaje.show();
  }

  changePasaje(accion: string, id_pasaje: string | null) {
    let toastMsg = false;
    for (const key in this.pasajesFormVal) {
      if (Object.prototype.hasOwnProperty.call(this.pasajesFormVal, key)) {
        toastMsg = this.validarInputPasaje(key as PasajeValidaciones);
      }
    }
    const tipoDetalle = this.tiposReqDetalle.find((t) => t.nombre.toUpperCase() === TIPO_REQ_PASAJES);
    if (!tipoDetalle) {
      this.toastr.error('Tipo Detalle Requerimiento no encontrado', 'error');
      return;
    }
    if (toastMsg === true) {
      this.toastr.warning('Por favor completar los campos requeridos en Pasajes.', 'Aviso!');
      return;
    }
    if (!this.requerimiento.id) {
      this.toastr.error('Primero debe crear un requerimiento', 'error');
      return;
    }

    this.pasaje.id_tipo = tipoDetalle.id;
    const ciudadOrigen = this.ciudades.find((c) => c.id === this.pasaje.id_ciudad_origen);
    const ciudadDestino = this.ciudades.find((c) => c.id === this.pasaje.id_ciudad_destino);
    if (ciudadOrigen) this.pasaje.ciudad_origen = { ...ciudadOrigen };
    if (ciudadDestino) this.pasaje.ciudad_destino = { ...ciudadDestino };
    const newPasaje = { ...this.pasaje };
    newPasaje.monto = parseFloat(newPasaje.monto_format);
    newPasaje.monto_format = formatNumber(newPasaje.monto_format);
    newPasaje.id_estado = this.estadosRequemiento.find((er) => er.valor === 1)?.id ?? '';

    // Remover , Editamos o Creamos
    if (accion === 'remove' && id_pasaje) {
      this._requerimientoService.eliminarDetalleRequerimiento(id_pasaje).subscribe({
        next: (r) => {
          this.toastr.success('Detalle Eliminado', 'OK!');
          const indexPasajes = this.pasajes.findIndex((p) => p.id === id_pasaje);
          const indexPasajesReq = this.requerimiento.requerimiento_detalle.findIndex((p) => p.id === id_pasaje);
          this.pasajes.splice(indexPasajes, 1);
          this.requerimiento.requerimiento_detalle.splice(indexPasajesReq, 1);
          this.setFinishPasaje();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'edit' && id_pasaje) {
      newPasaje.id_estado = this.estadosRequemiento.find((estado) => estado.valor === 1)?.id ?? '';
      this._requerimientoService.editarDetalleRequerimiento(newPasaje).subscribe({
        next: (r) => {
          this.toastr.success('Pasaje Guardado', 'OK!');
          const indexPasajes = this.pasajes.findIndex((p) => p.id === id_pasaje);
          const indexPasajesReq = this.requerimiento.requerimiento_detalle.findIndex((p) => p.id === id_pasaje);
          this.pasajes[indexPasajes] = { ...newPasaje };
          this.requerimiento.requerimiento_detalle[indexPasajesReq] = { ...newPasaje };

          this.setFinishPasaje();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'add') {
      newPasaje.id_requerimiento = this.requerimiento.id;
      newPasaje.id_estado = this.estadosRequemiento.find((estado) => estado.valor === 1)?.id ?? '';

      this._requerimientoService.addDetalleRequerimiento(newPasaje).subscribe({
        next: (nuevoDetalle) => {
          newPasaje.id = nuevoDetalle.id;

          this.toastr.success('Pasaje Editado', 'OK!');
          this.pasajes.push({ ...newPasaje });
          this.requerimiento.requerimiento_detalle.push({ ...newPasaje });
          this.setFinishPasaje();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
  setFinishPasaje() {
    this.setMontosPasajes();
    this.myModalPasajes.hide();
  }
  setMontosPasajes() {
    const pasajeTotal = this.pasajes.reduce(
      (acc, cur) => acc + parseFloat(parseFloat(cur.monto.toString()).toFixed(2)),
      0
    );
    this.pasaje_monto = formatNumber(pasajeTotal.toString());
    this.pasaje = { ...this.detalleInit };
  }
  changeHospedaje(accion: string, id_hospedaje: string | null) {
    let toastMsg = false;
    const tipoDetalle = this.tiposReqDetalle.find((t) => t.nombre.toUpperCase() === HOSPEDAJES);
    if (!tipoDetalle) {
      this.toastr.error('Tipo Detalle Requerimiento no encontrado', 'error');
      return;
    }
    this.hospedaje.id_tipo = tipoDetalle.id;
    const ciudad = this.ciudades.find((c) => c.id === this.hospedaje.id_ciudad);
    if (ciudad) this.hospedaje.ciudad = { ...ciudad };

    const newHospedaje = { ...this.hospedaje };
    for (const key in this.hospedajeFormVal) {
      if (Object.prototype.hasOwnProperty.call(this.hospedajeFormVal, key)) {
        toastMsg = this.validarInputHospedaje(key as HospedajeValidaciones);
      }
    }
    if (toastMsg === true) {
      this.toastr.warning('Por favor completar los campos requeridos en Hospedaje.', 'Aviso!');
      return;
    }
    if (!this.requerimiento.id) {
      this.toastr.error('Primero debe crear un requerimiento', 'error');
      return;
    }
    newHospedaje.monto = parseFloat(newHospedaje.monto_format);
    newHospedaje.monto_format = formatNumber(newHospedaje.monto_format);
    newHospedaje.id_estado =
      this.estadosRequemiento.find((estado) => estado.nombre.toUpperCase() === PENDIENTE)?.id ?? '';

    // Remover , Editamos o Creamos
    if (accion === 'remove' && id_hospedaje) {
      this._requerimientoService.eliminarDetalleRequerimiento(id_hospedaje).subscribe({
        next: (r) => {
          this.toastr.success('Detalle Eliminado', 'OK!');
          const indexHospedaje = this.hospedajes.findIndex((p) => p.id === id_hospedaje);
          this.hospedajes.splice(indexHospedaje, 1);
          // this.requerimiento.requerimiento_detalle.splice(this.hospedaje.index, 1);
          this.setFinishHospedaje();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'edit' && this.hospedaje.index >= 0) {
      this._requerimientoService.editarDetalleRequerimiento(newHospedaje).subscribe({
        next: (r) => {
          this.toastr.success('Hospedaje Guardado', 'OK!');
          const indexHospedaje = this.hospedajes.findIndex((p) => p.id === id_hospedaje);
          this.hospedajes[indexHospedaje] = { ...newHospedaje };
          // this.requerimiento.requerimiento_detalle[this.hospedaje.index] = { ...newHospedaje };

          this.setFinishHospedaje();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'add') {
      newHospedaje.id_requerimiento = this.requerimiento.id;
      this._requerimientoService.addDetalleRequerimiento(newHospedaje).subscribe({
        next: (nuevoDetalle) => {
          newHospedaje.id = nuevoDetalle.id;
          this.toastr.success('Hospedaje Editado', 'OK!');
          this.hospedajes.push({ ...newHospedaje });
          this.requerimiento.requerimiento_detalle.push({ ...newHospedaje });
          this.setFinishHospedaje();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
  setFinishHospedaje() {
    this.setMontosHospedaje();
    this.myModalHospedaje.hide();
  }
  setMontosHospedaje() {
    const hospedajeTotal = this.hospedajes.reduce(
      (acc, cur) => acc + parseFloat(parseFloat(cur.monto.toString()).toFixed(2)),
      0
    );
    this.hospedaje_monto = formatNumber(hospedajeTotal.toString());
    this.hospedaje = { ...this.detalleInit };
  }
  changeAlimento(accion: string, id_alimento: string | null) {
    let toastMsg = false;
    const tipoDetalle = this.tiposReqDetalle.find((t) => t.nombre.toUpperCase() === ALIMENTACION);
    if (!tipoDetalle) {
      this.toastr.error('Tipo Detalle Requerimiento no encontrado', 'error');
      return;
    }
    this.alimento.id_tipo = tipoDetalle.id;
    const newAlimento = { ...this.alimento };
    for (const key in this.alimentoFormVal) {
      if (Object.prototype.hasOwnProperty.call(this.alimentoFormVal, key)) {
        toastMsg = this.validarInputAlimento(key as AlimentoValidaciones);
      }
    }
    if (toastMsg === true) {
      this.toastr.warning('Por favor completar los campos requeridos en Alimentación.', 'Aviso!');
      return;
    }
    if (!this.requerimiento.id) {
      this.toastr.error('Primero debe crear un requerimiento', 'error');
      return;
    }
    newAlimento.monto = parseFloat(newAlimento.monto_format);
    newAlimento.monto_format = formatNumber(newAlimento.monto_format);
    newAlimento.id_estado = this.estadosRequemiento.find((er) => er.valor === 1)?.id ?? '';

    // Remover , Editamos o Creamos
    if (accion === 'remove' && id_alimento) {
      this._requerimientoService.eliminarDetalleRequerimiento(id_alimento).subscribe({
        next: (r) => {
          const indexAlimento = this.alimentos.findIndex((p) => p.id === id_alimento);
          this.alimentos.splice(indexAlimento, 1);
          // this.requerimiento.requerimiento_detalle.splice(this.alimento.index, 1);
          this.setFinishAlimentacion();
          this.toastr.success('Alimento Eliminado', 'OK!');
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'edit' && this.alimento.index >= 0) {
      // newAlimento.id_estado = this.estadosRequemiento.find((estado) => estado.valor === 1)?.id ?? '';
      this._requerimientoService.editarDetalleRequerimiento(newAlimento).subscribe({
        next: (r) => {
          this.toastr.success('Alimentos Guardado!', 'OK');
          const indexAlimento = this.alimentos.findIndex((p) => p.id === id_alimento);
          this.alimentos[indexAlimento] = { ...newAlimento };
          // this.requerimiento.requerimiento_detalle[this.alimento.index] = { ...newAlimento };

          this.setFinishAlimentacion();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'add') {
      newAlimento.id_requerimiento = this.requerimiento.id;
      newAlimento.id_estado = this.estadosRequemiento.find((estado) => estado.valor === 1)?.id ?? '';
      this._requerimientoService.addDetalleRequerimiento(newAlimento).subscribe({
        next: (nuevoDetalle) => {
          newAlimento.id = nuevoDetalle.id;

          this.toastr.success('Hospedaje Editado', 'OK!');

          this.alimentos.push({ ...newAlimento });
          this.requerimiento.requerimiento_detalle.push({ ...newAlimento });

          this.setFinishAlimentacion();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
  setFinishAlimentacion() {
    this.setMontosAlimentacion();
    this.alimento = { ...this.detalleInit };
    this.myModalAlimentacion.hide();
  }
  setMontosAlimentacion() {
    const alimentoTotal = this.alimentos.reduce(
      (acc, cur) => acc + parseFloat(parseFloat(cur.monto.toString()).toFixed(2)),
      0
    );
    this.alimento_monto = formatNumber(alimentoTotal.toString());
  }
  changeTraslados(accion: string, id_traslado: string | null) {
    let toastMsg = false;
    const tipoDetalle = this.tiposReqDetalle.find((t) => t.nombre.toUpperCase() === TRASLADOS);
    if (!tipoDetalle) {
      this.toastr.error('Tipo Detalle Requerimiento no encontrado', 'error');
      return;
    }
    for (const key in this.trasladoFormVal) {
      if (Object.prototype.hasOwnProperty.call(this.trasladoFormVal, key)) {
        toastMsg = this.validarInputTraslado(key as TrasladoValidaciones);
      }
    }
    if (toastMsg === true) {
      this.toastr.warning('Por favor completar los campos requeridos en Alimentación.', 'Aviso!');
      return;
    }
    if (!this.requerimiento.id) {
      this.toastr.error('Primero debe crear un requerimiento', 'error');
      return;
    }
    this.traslado.id_tipo = tipoDetalle.id;
    const ciudad = this.ciudades.find((c) => c.id === this.traslado.id_ciudad);
    if (ciudad) this.traslado.ciudad = { ...ciudad };
    const newTraslado = { ...this.traslado };
    newTraslado.monto = parseFloat(newTraslado.monto_format);
    newTraslado.monto_format = formatNumber(newTraslado.monto_format);

    newTraslado.id_estado = this.estadosRequemiento.find((estado) => estado.valor === 1)?.id ?? '';
    // Remover , Editamos o Creamos
    if (accion === 'remove' && id_traslado) {
      this._requerimientoService.eliminarDetalleRequerimiento(id_traslado).subscribe({
        next: (r) => {
          this.toastr.success('Alimento Eliminado', 'OK!');
          const indexTraslado = this.traslados.findIndex((p) => p.id === id_traslado);
          this.traslados.splice(indexTraslado, 1);
          // this.requerimiento.requerimiento_detalle.splice(this.traslado.index, 1);
          this.setFinishTraslado();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'edit' && id_traslado) {
      this._requerimientoService.editarDetalleRequerimiento(newTraslado).subscribe({
        next: (r) => {
          this.toastr.success('Alimentos Guardado!', 'OK');
          const indexTraslado = this.traslados.findIndex((p) => p.id === id_traslado);
          this.traslados[indexTraslado] = { ...newTraslado };
          // this.requerimiento.requerimiento_detalle[this.traslado.index] = { ...newTraslado };

          this.setFinishTraslado();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'add') {
      newTraslado.id_requerimiento = this.requerimiento.id;

      this._requerimientoService.addDetalleRequerimiento(newTraslado).subscribe({
        next: (nuevoDetalle) => {
          newTraslado.id = nuevoDetalle.id;

          this.toastr.success('Traslado Editado', 'OK!');

          this.traslados.push({ ...newTraslado });
          this.requerimiento.requerimiento_detalle.push({ ...newTraslado });

          this.setFinishTraslado();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
  setFinishTraslado() {
    this.setMontosTraslado();
    this.traslado = { ...this.detalleInit };
    this.myModalTraslados.hide();
  }
  setMontosTraslado() {
    const trasladoTotal = this.traslados.reduce(
      (acc, cur) => acc + parseFloat(parseFloat(cur.monto.toString()).toFixed(2)),
      0
    );
    this.traslado_monto = formatNumber(trasladoTotal.toString());
  }
  changeOtros(accion: string, id_otro: string | null) {
    let toastMsg = false;
    const tipoDetalle = this.tiposReqDetalle.find((t) => t.nombre.toUpperCase() === OTROS);
    if (!tipoDetalle) {
      this.toastr.error('Tipo Detalle Requerimiento no encontrado', 'error');
      return;
    }
    for (const key in this.otroFormVal) {
      if (Object.prototype.hasOwnProperty.call(this.otroFormVal, key)) {
        toastMsg = this.validarInputOtros(key as OtroValidaciones);
      }
    }
    if (toastMsg === true) {
      this.toastr.warning('Por favor completar los campos requeridos en Otros.', 'Aviso!');
      return;
    }
    if (!this.requerimiento.id) {
      this.toastr.error('Primero debe crear un requerimiento', 'error');
      return;
    }
    this.otro.id_tipo = tipoDetalle.id;
    const newOtro = { ...this.otro };
    newOtro.monto = parseFloat(newOtro.monto_format);
    newOtro.monto_format = formatNumber(newOtro.monto_format);
    newOtro.id_estado = this.estadosRequemiento.find((er) => er.valor === 1)?.id ?? '';

    // Remover , Editamos o Creamos
    if (accion === 'remove' && id_otro) {
      this._requerimientoService.editarDetalleRequerimiento(newOtro).subscribe({
        next: (r) => {
          this.toastr.success('Detalle Otros Eliminado', 'OK!');
          const indexOtro = this.otros.findIndex((p) => p.id === id_otro);
          this.otros.splice(indexOtro, 1);
          // this.requerimiento.requerimiento_detalle.splice(this.otro.index, 1);
          this.setFinishOtro();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'edit' && this.otro.index >= 0) {
      this._requerimientoService.editarDetalleRequerimiento(newOtro).subscribe({
        next: (r) => {
          this.toastr.success('Detalle Otros Guardado!', 'OK');
          const indexOtro = this.otros.findIndex((p) => p.id === id_otro);
          this.otros[indexOtro] = { ...newOtro };
          // this.requerimiento.requerimiento_detalle[this.otro.index] = { ...newOtro };

          this.setFinishOtro();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'add') {
      newOtro.id_requerimiento = this.requerimiento.id;

      this._requerimientoService.addDetalleRequerimiento(newOtro).subscribe({
        next: (nuevoDetalle) => {
          newOtro.id = nuevoDetalle.id;

          this.toastr.success('Detalle Otros Editado!', 'OK');

          this.otros.push({ ...newOtro });
          this.requerimiento.requerimiento_detalle.push({ ...newOtro });

          this.setFinishOtro();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
  setFinishOtro() {
    this.setMontoOtros();
    this.otro = { ...this.detalleInit };
    this.myModalOtros.hide();
  }
  setMontoOtros() {
    const otrosTotal = this.otros.reduce(
      (acc, cur) => acc + parseFloat(parseFloat(cur.monto.toString()).toFixed(2)),
      0
    );
    this.otro_monto = formatNumber(otrosTotal.toString());
  }
  guardar() {
    let toastMsg = false;
    for (const key in this.requerimientoVal) {
      if (Object.prototype.hasOwnProperty.call(this.requerimientoVal, key)) {
        toastMsg = this.validarFormRequerimiento(key as RequerimientoInputReq);
      }
    }

    if (toastMsg === true) {
      this.toastr.warning('Por favor completar los campos requeridos.', 'Aviso!');
      return;
    }

    if (this.requerimiento.id !== '' && this.requerimiento.id) {
      this._requerimientoService.editarRequerimiento(this.requerimiento.id, this.requerimiento).subscribe({
        next: (r) => {
          this.toastr.success('Requerimiento Editado', 'OK!');
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else {
      this._requerimientoService.crearRequerimiento(this.requerimiento).subscribe({
        next: (r) => {
          this.requerimiento.id = r.id;
          this.router.navigate([`/requerimiento_viaticos_form/${r.id}`]).then(() => {});
          this.toastr.success('Requerimiento Guardado', 'OK!');
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
  confirmBox(id_estado: string, nombre_estado: string) {
    if (!this.requerimiento.id) return this._toastService.messageInfo(debeCrearAntesUnaCaja);
    this._swalertService.confirmBox(id_estado, nombre_estado).then((respuesta) => {
      if (respuesta) {
        this.requerimiento.id_estado = id_estado;
        if (this.requerimiento.id) {
          this._requerimientoService.patchEstadoRequerimiento(this.requerimiento.id, this.requerimiento).subscribe({
            next: (requerimiento) => {
              const indexEstadoCaja = this.estadosRequemiento.findIndex(
                (estado) => estado.id === requerimiento.id_estado
              );
              this.estadosRequemiento.forEach((estados) => {
                estados.existe = false;
              });
              if (indexEstadoCaja >= 0) {
                this.estadosRequemiento[indexEstadoCaja].existe = true;
              }
            },
            error: (error: HttpErrorResponse) => {
              return this._toastService.msgError(error);
            },
          });
        }
      } else {
        console.log('NO confirmo');
      }
    });
  }
}
