import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { ModalLiquidacionComponent } from '../../../shared/modal-liquidacion/modal-liquidacion.component';
import { Caja, QueryParamsBuscarCajas } from '../../../interfaces/caja';
import { ToastService } from '../../../services/error.service';
import { CatalogoEstadoService } from '../../../services/catalogo-estado.service';
import { SedeService } from '../../../services/sede.service';
import { EmpresaService } from '../../../services/empresa.service';
import { FormaPagoService } from '../../../services/forma-pago.service';
import { UserService } from '../../../services/user.service';
import { CajaService } from '../../../services/caja.service';
import { LiquidacionService } from '../../../services/liquidacion.service';
import { SwalertService } from '../../../services/swalert.service';
import { debeCrearAntesUnaCaja, debeCrearAntesUnaSolicitud, debeExistirUnaCaja } from '../../../common/message';
import { CatalogoEstado } from '../../../interfaces/catalogo-estado';
import {
  Solicitud,
  SolicitudDetFormValidacion,
  SolicitudDetalle,
  SolicitudFormValidacion,
} from '../../../interfaces/solicitud';
import { Sede } from '../../../interfaces/sede';
import { Area } from '../../../interfaces/area';
import { AreasByUser, UsuariosLista } from '../../../interfaces/user';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Liquidacion } from '../../../interfaces/liquidacion';
import { SolicitudService } from '../../../services/solicitud.service';

import * as bootstrap from 'bootstrap';
import { formatNumber, revertFormatNumber, setQueryParams } from '../../../common/helpers';
import { SidenavComponent } from '../../sidenav/sidenav.component';
@Component({
  selector: 'app-solicitud-caja-chica-form',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    CommonModule,
    FormsModule,
    SpinnerComponent,
    ModalLiquidacionComponent,
    SidenavComponent,
  ],
  templateUrl: './solicitud-caja-chica-form.component.html',
  styleUrl: './solicitud-caja-chica-form.component.css',
})
export class SolicitudCajaChicaFormComponent implements OnInit {
  estadosSolicitud: CatalogoEstado[] = [];
  solicitud_form_val = {
    id_sede: false,
    id_area: false,
    id_persona: false,
    descripcion: false,
  };
  solicitud_det_form_val = {
    monto_format: false,
    item: false,
  };
  solicitud_init: Solicitud = {
    id: null,
    codigo: 'AUTOGENERADO',
    id_estado: null,
    estado: { id: '', codigo: 0, nombre: '', valor: 0, indicador: '' },
    id_caja: null,
    caja: { id: null, codigo: '', id_tipo: '' },
    id_sede: '',
    sede: { nombre: '', abreviatura: '', monto_maximo: 0 },
    id_area: '',
    area: { nombre: '' },
    id_persona: '',
    persona: { nombres: '', apellidos: '' },
    descripcion: '',
    observacion: '',
    id_usuario_creacion: '',
    usuario_creacion: { nombres: '', apellidos: '' },
    fecha_creacion: null,
    id_usuario_edicion: null,
    usuario_edicion: { nombres: '', apellidos: '' },
    fecha_edicion: '',
    caja_solicitud_metodo_rembolso: [],
    solicitud_caja_detalle: [],
  };
  solicitud_detalle_init: SolicitudDetalle = {
    id: null,
    id_solicitud_caja: '',
    monto: 0,
    monto_format: '',
    item: '',
  };
  solicitud: Solicitud = { ...this.solicitud_init };
  // solicitud_detalles: SolicitudDetalle[] = [];
  solicitud_detalle: SolicitudDetalle = { ...this.solicitud_detalle_init };
  liquidaciones: Liquidacion[] = [];
  sedes: Sede[] = [];
  areas: Area[] = [];
  usuarios: UsuariosLista[] = [];
  areasByUser: AreasByUser[] = [];
  metodosRembolsoDisponible: CatalogoEstado[] = [];
  id_usuario: string | null = null;
  myModalDetalle: any;
  constructor(
    private _toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private _catalogoEstadoService: CatalogoEstadoService,
    private _sedeService: SedeService,
    private _empresaService: EmpresaService,
    private _formaPagoService: FormaPagoService,
    private _usuarioService: UserService,
    private _cajaService: CajaService,
    private _liquidacionService: LiquidacionService,
    private _swalertService: SwalertService,
    private elementRef: ElementRef,
    private _solicitudService: SolicitudService
  ) {}
  params = new HttpParams();
  queryParamsBuscarCajas: QueryParamsBuscarCajas = {
    id_solicitud: null,
  };
  @ViewChild(ModalLiquidacionComponent) modalLiquidacion!: ModalLiquidacionComponent;
  resumen_monto_detalle_format: string = '';
  resumen_total_format: string = '';
  resumen_a_pagar_format: string = '';
  resumen_igv_format: string = '';
  se_edito_caja = false;
  se_edito_detalle = false;
  ngOnInit(): void {
    this.myModalDetalle = new bootstrap.Modal(this.elementRef.nativeElement.querySelector('#modalDetalleSolcitud'));
    this.myModalDetalle._element.addEventListener('hide.bs.modal', () => {
      if (this.se_edito_detalle === true) this.getSolicitud();
      this.solicitud_detalle = { ...this.solicitud_detalle_init };
      this.se_edito_detalle = false;
    });

    this.solicitud.id = this.route.snapshot.paramMap.get('id');
    this.id_usuario = localStorage.getItem('idusuario') ?? null;
    this.getSolicitud();
    this.getLiquidacionesBySolicitud();
    this._sedeService.getList().subscribe({
      next: (sedes) => {
        this.sedes = sedes;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
    this._usuarioService.getAreasByUsuario().subscribe({
      next: (areas) => {
        this.areasByUser = areas;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
    this._catalogoEstadoService.getGrupo(this._catalogoEstadoService.estadosSolicitud).subscribe({
      next: (grupo) => {
        console.log(grupo, 'GRUPO SOLICITUD');
        this.estadosSolicitud = grupo;
        // ESTADO
        const indexEstadoCaja = this.estadosSolicitud.findIndex((estado) => estado.id === this.solicitud.id_estado);
        if (indexEstadoCaja >= 0) {
          this.estadosSolicitud[indexEstadoCaja].existe = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });

    if (this.id_usuario) {
      this._usuarioService.getUsuarioById(this.id_usuario).subscribe({
        next: (usuario) => {
          this.solicitud.id_persona = usuario.id;
          this.solicitud.persona = { nombres: usuario.nombres, apellidos: usuario.apellidos };
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
    }
  }
  getSolicitud() {
    if (this.solicitud.id) {
      this._solicitudService.findOneById(this.solicitud.id).subscribe({
        next: (solicitud) => {
          console.log(solicitud, 'SOLCIITUD');
          let montoTotal = 0;
          this.solicitud = solicitud;
          this.solicitud.solicitud_caja_detalle.forEach((detalle) => {
            detalle.monto_format = formatNumber(detalle.monto.toString());
            montoTotal += +detalle.monto;
          });
          this.resumen_monto_detalle_format = formatNumber(montoTotal.toString());
          this.buscarCajaChicaPorSede(solicitud.id_sede);

          // ESTADO
          const indexEstadoCaja = this.estadosSolicitud.findIndex((estado) => estado.id === this.solicitud.id_estado);
          if (indexEstadoCaja >= 0) {
            this.estadosSolicitud[indexEstadoCaja].existe = true;
          }
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
    }
  }

  buscarCajaChicaPorSede(id_sede: string | null) {
    this.metodosRembolsoDisponible = [];
    if (id_sede) {
      this._cajaService.buscarCajaChicaPorSede(id_sede).subscribe({
        next: (caja) => {
          if (!caja) {
            this.solicitud.id_caja = null;
            this.solicitud.caja.codigo = '';

            return this._toastService.messageInfo('No existe Caja Chica Pendiente para esta Sede.');
          } else {
            caja.caja_metodo_rembolso.forEach((metodorembolso, index) => {
              this.metodosRembolsoDisponible.push({
                id: metodorembolso.metodo_rembolso.id,
                nombre: metodorembolso.metodo_rembolso.nombre,
                existe: false,
                indicador: '',
                codigo: index,
                valor: index,
              });
            });

            this.solicitud.id_caja = caja.id;
            this.solicitud.caja.id_tipo = caja.id_tipo ?? '';
            this.solicitud.caja.codigo = caja.codigo;
          }
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
        complete: () => {
          // Set metodos Rembolso Seleccionado
          this.solicitud.caja_solicitud_metodo_rembolso.map((cmr) => {
            const findIdRembolso = this.metodosRembolsoDisponible.findIndex((mrd) => mrd.id === cmr.id_tipo_rembolso);
            if (findIdRembolso >= 0) {
              this.metodosRembolsoDisponible[findIdRembolso].existe = true;
            }
          });
        },
      });
    }
  }
  getLiquidacionesBySolicitud() {
    if (this.solicitud.id) {
      this.queryParamsBuscarCajas.id_solicitud = this.solicitud.id;
      const paramsFormated = setQueryParams(this.queryParamsBuscarCajas);
      if (this.solicitud.id) {
        this._liquidacionService.findLiquidacionesByQuery(paramsFormated).subscribe({
          next: (liquidaciones) => {
            console.log(liquidaciones, 'LIQUIDACIONES EN SOLICITUD');
            liquidaciones.forEach((liquidacion) => {
              this.liquidaciones = [...this.liquidaciones, this.modalLiquidacion.formatearLiquidacion(liquidacion)];
            });
            // this.liquidaciones = setLiquidaciones;
            this.setResumenMontosLiquidacion();
          },
          error: (error: HttpErrorResponse) => {
            this._toastService.msgError(error);
          },
        });
      }
    }
  }
  setTipoLiquidacion() {
    this.modalLiquidacion.caja_detalle.id_solicitud = this.solicitud.id;
    this.modalLiquidacion.caja_detalle.id_caja = this.solicitud.caja.id;
    this.modalLiquidacion.caja_detalle.id_tipo = this.solicitud.caja.id_tipo ?? null;
    // if (this.solicitud.caja) this.modalLiquidacion.caja_detalle.tipo. = this.solicitud.caja.;
    this.modalLiquidacion.caja_detalle.es_caja_chica = true;
  }

  openModalLiquidacion() {
    if (!this.solicitud.id) {
      return this._toastService.messageInfo(debeCrearAntesUnaSolicitud);
    }
    this.setTipoLiquidacion();
    this.modalLiquidacion.openModalCreate();
  }
  openModalLiquidacionEdit(id: string | null) {
    this.setTipoLiquidacion();
    this.modalLiquidacion.caja_detalle.id_requerimiento = null;
    let findLiquidacion = this.liquidaciones.find((liquidacion) => liquidacion.id === id);
    if (findLiquidacion) this.modalLiquidacion.openModalLiquidacionEdit(findLiquidacion);
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

  validarInputSolicitudDet(input: SolicitudDetFormValidacion) {
    this.solicitud_det_form_val[input] = !this.solicitud_detalle[input] ? true : false;

    return this.solicitud_det_form_val[input];
  }

  validarFormSolicitudDet() {
    let toastMsg = false;
    for (const key in this.solicitud_det_form_val) {
      if (Object.prototype.hasOwnProperty.call(this.solicitud_det_form_val, key)) {
        const valInput = this.validarInputSolicitudDet(key as SolicitudDetFormValidacion);
        if (toastMsg === false) toastMsg = valInput;
      }
    }

    return toastMsg;
  }
  validarInputSolicitud(input: SolicitudFormValidacion) {
    this.solicitud_form_val[input] = !this.solicitud[input] ? true : false;

    return this.solicitud_form_val[input];
  }
  validarFormularioSolicitud() {
    let toastMsg = false;
    for (const key in this.solicitud_form_val) {
      if (Object.prototype.hasOwnProperty.call(this.solicitud_form_val, key)) {
        const valInput = this.validarInputSolicitud(key as SolicitudFormValidacion);
        if (toastMsg === false) toastMsg = valInput;
      }
    }

    return toastMsg;
  }
  guardarSolicitud() {
    const isNotValidForm = this.validarFormularioSolicitud();
    if (isNotValidForm === true) {
      this._toastService.messageInfo('Por favor completar los campos requeridos.');
      return;
    }
    if (!this.solicitud.id_caja) {
      return this._toastService.messageInfo(debeExistirUnaCaja);
    }

    if (this.solicitud.id) {
      this._solicitudService.editarSolicitud(this.solicitud).subscribe({
        next: (solicitud) => {
          console.log(solicitud, 'SE EDITO SOLICITUD');
          this._toastService.messageAddOk('Se edito solicitud correctamente.');
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
    } else {
      this._solicitudService.guardarSolicitud(this.solicitud).subscribe({
        next: (solicitud) => {
          console.log(solicitud, 'SE GUARDO SOLICITUD');
          this.router.navigateByUrl(`/solicitud_caja_chica_form/${solicitud.id}`);
          this._toastService.messageAddOk('Se guardo solicitud correctamente.');
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
    }
  }

  confirmBox(id_estado: string, nombre_estado: string) {
    if (!this.solicitud.id) return this._toastService.messageInfo(debeCrearAntesUnaCaja);
    this._swalertService.confirmBox(id_estado, nombre_estado).then((respuesta) => {
      if (respuesta) {
        this.solicitud.id_estado = id_estado;
        if (this.solicitud.id) {
          this._solicitudService.editarEstado(this.solicitud, this.solicitud.id).subscribe({
            next: (solicitud) => {
              const indexEstadoCaja = this.estadosSolicitud.findIndex((estado) => estado.id === solicitud.id_estado);
              this.estadosSolicitud.forEach((estados) => {
                estados.existe = false;
              });
              if (indexEstadoCaja >= 0) {
                this.estadosSolicitud[indexEstadoCaja].existe = true;
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

  onChangeMetodoRembolso(event: any, metodoId: string): void {
    // Verifica si el checkbox está marcado o no
    console.log(metodoId, 'metodoId');
    if (event.target.checked) {
      console.log('MARCANDO');
      // Si está marcado, agrega el ID del método de reembolso al array de métodos seleccionados
      const findMetodo = this.metodosRembolsoDisponible.find((mr) => mr.id === metodoId);
      if (findMetodo) this.solicitud.caja_solicitud_metodo_rembolso?.push({ id_tipo_rembolso: findMetodo.id ?? '' });
    } else {
      console.log('DESMARCANDO');
      if (this.solicitud.caja_solicitud_metodo_rembolso) {
        const indexMetodo = this.solicitud.caja_solicitud_metodo_rembolso.findIndex(
          (mr) => mr.id_tipo_rembolso === metodoId
        );
        if (indexMetodo !== -1) {
          this.solicitud.caja_solicitud_metodo_rembolso.splice(indexMetodo, 1);
        }
      }
      console.log(this.solicitud.caja_solicitud_metodo_rembolso, 'IDS CHANGE');
    }
  }

  changeDetalle(accion: string, id_detalle: string | null) {
    const isNotValidForm = this.validarFormSolicitudDet();
    if (isNotValidForm === true) {
      this._toastService.messageInfo('Por favor completar los campos requeridos.');
      return;
    }
    // const findIdSolicitud = this.solicitud.solicitud_caja_detalle.find((detalle) => detalle.id === id_detalle);
    // if (!findIdSolicitud) {
    //   this._toastService.messageInfo('No se encontro id detalle en Solicitud.');
    //   return;
    // }
    const newSolDetalle = { ...this.solicitud_detalle };
    newSolDetalle.id_solicitud_caja = this.solicitud.id ?? '';
    newSolDetalle.monto = revertFormatNumber(newSolDetalle.monto_format);
    console.log(newSolDetalle, 'DETALLE ANTES DE GUARDAR');
    // Remover , Editamos o Creamos
    if (accion === 'remove' && id_detalle) {
      this._solicitudService.eliminarDetalle(id_detalle).subscribe({
        next: (r) => {
          this.se_edito_detalle = true;
          const indexTraslado = this.solicitud.solicitud_caja_detalle.findIndex((p) => p.id === id_detalle);
          this.solicitud.solicitud_caja_detalle.splice(indexTraslado, 1);
          this.myModalDetalle.hide();
          this._toastService.messageInfo('Detalle Eliminado.');
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'edit' && id_detalle) {
      this._solicitudService.editarDetalle(newSolDetalle, id_detalle).subscribe({
        next: (sol_detalle) => {
          this.se_edito_detalle = true;
          const indexTraslado = this.solicitud.solicitud_caja_detalle.findIndex((p) => p.id === id_detalle);
          this.solicitud.solicitud_caja_detalle[indexTraslado] = { ...newSolDetalle };
          this.myModalDetalle.hide();
          this._toastService.messageInfo('Detalle editado.');
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    } else if (accion === 'add') {
      // newTraslado.id_requerimiento = this.requerimiento.id;

      this._solicitudService.guardarDetalle(newSolDetalle).subscribe({
        next: (nuevoDetalle) => {
          this.se_edito_detalle = true;
          this._toastService.messageAddOk('Detalle guardado.');
          this.solicitud_detalle = { ...this.solicitud_detalle_init };
          this.myModalDetalle.hide();
          // this.setFinishTraslado();
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
  openModalDetalle() {
    if (!this.solicitud.id) {
      this._toastService.messageInfo('Primero debe crear solicitud.');
      return;
    }
    this.myModalDetalle.show();
  }
  openModalDetalleEdit(id_detalle: string | null) {
    const findDetalle = this.solicitud.solicitud_caja_detalle.find((detalle) => detalle.id === id_detalle);
    console.log(findDetalle, 'findDetalle');
    if (findDetalle) {
      // findDetalle.monto_format = revertFormatNumber(findDetalle.monto_format).toString();
      this.solicitud_detalle = {
        ...findDetalle,
        monto_format: revertFormatNumber(findDetalle.monto_format).toString(),
      };
      this.myModalDetalle.show();
    }
  }
}
