import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Caja, CajaChica, CajaChicaValidacion, QueryParamsBuscarCajas } from '../../../interfaces/caja';
import { ToastService } from '../../../services/error.service';
import { CatalogoEstadoService } from '../../../services/catalogo-estado.service';
import { SedeService } from '../../../services/sede.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Sede } from '../../../interfaces/sede';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../interfaces/empresa';
import { FormaPagoService } from '../../../services/forma-pago.service';
import { FormaPago } from '../../../interfaces/forma_pago';
import { UserService } from '../../../services/user.service';
import { UsuariosLista } from '../../../interfaces/user';
import { CatalogoEstado } from '../../../interfaces/catalogo-estado';
import { CajaService } from '../../../services/caja.service';
import { ModalLiquidacionComponent } from '../../../shared/modal-liquidacion/modal-liquidacion.component';
import { NOMBRE_CAJA_CHICA, NOMBRE_CAJA_GRANDE } from '../../../../environments/environment';
import { Liquidacion } from '../../../interfaces/liquidacion';
import { QueryParams } from '../../../interfaces/requerimiento';
import { LiquidacionService } from '../../../services/liquidacion.service';

import { SwalertService } from '../../../services/swalert.service';
import { completarCamposRequeridos, debeCrearAntesUnaCaja } from '../../../common/message';
import { formatNumber } from '../../../common/helpers';
import * as bootstrap from 'bootstrap';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-caja-chica-form',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ModalLiquidacionComponent,
    SidenavComponent,
  ],
  templateUrl: './caja-chica-form.component.html',
  styleUrl: './caja-chica-form.component.css',
})
export class CajaChicaFormComponent implements OnInit {
  caja_chica_form_val = {
    id_tipo_gasto: false,
    id_sede: false,
    id_empresa: false,
    id_forma_pago: false,
    id_usuario: false,
  };
  caja_chica: Partial<Caja> = {
    id: null,
    id_estado: null,
    estado: { nombre: '', valor: 0 },
    id_tipo: null,
    tipo: { nombre: '', valor: 0 },
    id_tipo_gasto: '',
    tipo_gasto: { nombre: '', valor: 0 },
    codigo: 'AUTOGEN',
    id_sede: '',
    sede: { nombre: '', abreviatura: '', monto_maximo: 0 },
    id_empresa: '',
    empresa: { nombre: '', direccion: '' },

    id_forma_pago: '',
    forma_pago: { descripcion: '' },
    id_usuario: '',
    usuario: { nombres: '', apellidos: '' },

    total_igv: 0,
    monto_maximo: 0,
    total_pagar: 0,
    id_usuario_creacion: '',
    usuario_creacion: { nombres: '', apellidos: '' },
    fecha_creacion: '',
    id_usuario_edicion: '',
    usuario_edicion: { nombres: '', apellidos: '' },
    fecha_edicion: '',
    caja_metodo_rembolso: [],
    ids_metodo_rembolso: [],
  };
  sedes: Sede[] = [];
  empresas: Empresa[] = [];
  formasPago: FormaPago[] = [];
  usuariosActives: UsuariosLista[] = [];
  tiposGasto: CatalogoEstado[] = [];
  estadosCaja: CatalogoEstado[] = [];
  metodosRembolso: CatalogoEstado[] = [];
  liquidaciones: Liquidacion[] = [];
  params = new HttpParams();
  queryParams: QueryParamsBuscarCajas = {
    id_caja_chica: null,
  };
  myModalLiquidacion: any;
  @ViewChild(ModalLiquidacionComponent) modalLiquidacion!: ModalLiquidacionComponent;
  resumen_total_format: string = '';
  resumen_a_pagar_format: string = '';
  resumen_igv_format: string = '';
  se_edito_caja = false;
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
    private elementRef: ElementRef
  ) {}
  ngOnInit(): void {
    this.caja_chica.id = this.route.snapshot.paramMap.get('id');
    this.myModalLiquidacion = new bootstrap.Modal(this.elementRef.nativeElement.querySelector('#modalLiquidacion'));
    this.myModalLiquidacion._element.addEventListener('hide.bs.modal', () => {
      if (this.modalLiquidacion.se_guardo_liquidacion === true) this.getLiquidaciones();
    });
    this._sedeService.getList().subscribe({
      next: (sedes) => {
        this.sedes = sedes;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
    this._empresaService.getAll().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
    this._formaPagoService.getAll().subscribe({
      next: (formasPago) => {
        this.formasPago = formasPago;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
    this._usuarioService.getAllActives().subscribe({
      next: (usuariosActives) => {
        this.usuariosActives = usuariosActives;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
    this._catalogoEstadoService.getTiposGastosCaja().subscribe({
      next: (tiposGasto) => {
        this.tiposGasto = tiposGasto;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
    this._catalogoEstadoService.getMetodosRembolsoCaja().subscribe({
      next: (metodosRembolso) => {
        this.metodosRembolso = metodosRembolso;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
    this._catalogoEstadoService.getTiposCaja().subscribe({
      next: (tiposCaja) => {
        console.log(tiposCaja);
        const findTipoCaja = tiposCaja.find((tc) => tc.nombre.toUpperCase() === NOMBRE_CAJA_CHICA);
        console.log(findTipoCaja);
        if (findTipoCaja) {
          this.caja_chica.id_tipo = findTipoCaja.id;
          this.caja_chica.tipo = findTipoCaja;
        }
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
    this._catalogoEstadoService.getEstadosCaja().subscribe({
      next: (estadosCaja) => {
        this.estadosCaja = estadosCaja;
        if (!this.caja_chica.id) {
          this.caja_chica.id_estado = estadosCaja.find((tc) => tc.valor === 1)?.id ?? null;
        }
        // ESTADO
        const indexEstadoCaja = this.estadosCaja.findIndex((estado) => estado.id === this.caja_chica.id_estado);
        if (indexEstadoCaja >= 0) {
          this.estadosCaja[indexEstadoCaja].existe = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });

    if (this.caja_chica.id) {
      this.queryParams.id_caja_chica = this.caja_chica.id;
      this.setQueryParams(this.queryParams);
      this._cajaService.findCajaById(this.caja_chica.id).subscribe({
        next: (caja) => {
          this.caja_chica = caja;
          this.caja_chica.caja_metodo_rembolso?.map((cmr) => {
            const findIdRembolso = this.metodosRembolso.findIndex((mr) => mr.id === cmr.metodo_rembolso.id);
            if (findIdRembolso >= 0) {
              this.metodosRembolso[findIdRembolso].existe = true;
            }
          });
          // ESTADO
          const indexEstadoCaja = this.estadosCaja.findIndex((estado) => estado.id === this.caja_chica.id_estado);
          if (indexEstadoCaja >= 0) {
            this.estadosCaja[indexEstadoCaja].existe = true;
          }
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
      this.getLiquidaciones();
    }
  }

  onChangeMetodoRembolso(event: any, metodoId: string): void {
    // Verifica si el checkbox está marcado o no
    console.log(metodoId, 'metodoId');
    if (event.target.checked) {
      console.log('MARCANDO');
      // Si está marcado, agrega el ID del método de reembolso al array de métodos seleccionados
      const findMetodo = this.metodosRembolso.find((mr) => mr.id === metodoId);
      if (findMetodo) this.caja_chica.caja_metodo_rembolso?.push({ metodo_rembolso: findMetodo });
    } else {
      console.log('DESMARCANDO');
      if (this.caja_chica.caja_metodo_rembolso) {
        const indexMetodo = this.caja_chica.caja_metodo_rembolso.findIndex((mr) => mr.metodo_rembolso.id === metodoId);
        if (indexMetodo !== -1) {
          this.caja_chica.caja_metodo_rembolso?.splice(indexMetodo, 1);
        }
      }
      console.log(this.caja_chica.caja_metodo_rembolso, 'IDS CHANGE');
    }
  }
  isChecked(metodoId: string): boolean {
    console.log(metodoId);
    return this.metodosRembolso.map((mr) => mr.id).includes(metodoId);
  }
  enviarIdCaja() {
    return this.caja_chica.id;
  }
  guardarCaja() {
    const valForm = this.validarFormularioLiquidacion();

    if (valForm === true) {
      this._toastService.messageInfo(completarCamposRequeridos);
      return;
    }
    if (this.caja_chica.caja_metodo_rembolso && !(this.caja_chica.caja_metodo_rembolso.length > 0)) {
      return this._toastService.messageError('Debe seleccionar almenos un metodo de rembolso.', 'Aviso!.');
    }
    console.log(this.caja_chica, 'CAJA ANTES DE GUARDAR');
    if (this.caja_chica.id) {
      this._cajaService.editarCaja(this.caja_chica, this.caja_chica.id).subscribe({
        next: (caja) => {
          console.log(caja, 'CAJA EDITADA');
          this.caja_chica.id = caja.id;
          this._toastService.messageAddOk('Se edito Caja Chica.');
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
    } else {
      this._cajaService.guardarCajaChica(this.caja_chica).subscribe({
        next: (caja) => {
          this.caja_chica.id = caja.id;
          this.caja_chica.codigo = caja.codigo;
          this.router.navigateByUrl(`/caja_chica_form/${caja.id}`);
          this._toastService.messageAddOk('Se guardó la Caja Chica.');
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
    }
  }

  setTipoLiquidacion() {
    this.modalLiquidacion.caja_detalle.id_caja = this.caja_chica.id;
    this.modalLiquidacion.caja_detalle.id_tipo = this.caja_chica.id_tipo ?? null;
    if (this.caja_chica.tipo) this.modalLiquidacion.caja_detalle.tipo = this.caja_chica.tipo;
    this.modalLiquidacion.caja_detalle.es_caja_chica = true;
  }
  openModalLiquidacionEdit(id: string) {
    // this.modalLiquidacion.tiposReqDetalle = this.tiposReqDetalle;
    this.setTipoLiquidacion();
    // this.modalLiquidacion.caja_detalle.id_requerimiento = null;
    let findLiquidacion = this.liquidaciones.find((liquidacion) => liquidacion.id === id);
    if (findLiquidacion) this.modalLiquidacion.openModalLiquidacionEdit(findLiquidacion);
  }

  setQueryParams(query: QueryParamsBuscarCajas) {
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key as keyof QueryParamsBuscarCajas];
        if (typeof value === 'string' || typeof value === 'number') {
          this.params = this.params.append(key, String(value));
        }
      }
    }
  }

  openModalLiquidacion() {
    if (!this.caja_chica.id) {
      return this._toastService.messageInfo(debeCrearAntesUnaCaja);
    }
    this.setTipoLiquidacion();

    this.modalLiquidacion.openModalCreate();
  }

  confirmBox(id_estado: string, nombre_estado: string) {
    if (!this.caja_chica.id) return this._toastService.messageInfo(debeCrearAntesUnaCaja);
    this._swalertService.confirmBox(id_estado, nombre_estado).then((respuesta) => {
      if (respuesta) {
        this.caja_chica.id_estado = id_estado;
        if (this.caja_chica.id) {
          this._cajaService.editarEstado(this.caja_chica, this.caja_chica.id).subscribe({
            next: (caja) => {
              const indexEstadoCaja = this.estadosCaja.findIndex((estado) => estado.id === this.caja_chica.id_estado);
              this.estadosCaja.forEach((estados) => {
                estados.existe = false;
              });
              if (indexEstadoCaja >= 0) {
                this.estadosCaja[indexEstadoCaja].existe = true;
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

  validarInputCajaChica(input: CajaChicaValidacion) {
    this.caja_chica_form_val[input] = !this.caja_chica[input] ? true : false;

    return this.caja_chica_form_val[input];
  }
  validarFormularioLiquidacion() {
    let toastMsg = false;
    for (const key in this.caja_chica_form_val) {
      if (Object.prototype.hasOwnProperty.call(this.caja_chica_form_val, key)) {
        toastMsg = this.validarInputCajaChica(key as CajaChicaValidacion);
      }
    }
    return toastMsg;
  }

  getLiquidaciones() {
    if (this.caja_chica.id) {
      this._liquidacionService.findLiquidacionesByQuery(this.params).subscribe({
        next: (liquidaciones) => {
          this.liquidaciones = [];
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
}
