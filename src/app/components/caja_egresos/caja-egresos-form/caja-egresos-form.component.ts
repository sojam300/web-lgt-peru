import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BuscarParamsCaja, Caja, CajaEgresosValidacion, QueryParamsBuscarCajas } from '../../../interfaces/caja';
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
import {
  BUSCAR_TAKE,
  NOMBRE_CAJA_CHICA,
  NOMBRE_CAJA_GRANDE,
  PENDIENTE,
  TEXT_CERRADO,
} from '../../../../environments/environment';
import { Liquidacion } from '../../../interfaces/liquidacion';
import { QueryParams } from '../../../interfaces/requerimiento';
import { LiquidacionService } from '../../../services/liquidacion.service';

import { SwalertService } from '../../../services/swalert.service';
import { completarCamposRequeridos, debeCrearAntesUnaCaja } from '../../../common/message';
import { formatFecha, formatNumber } from '../../../common/helpers';
import * as bootstrap from 'bootstrap';
import { Proveedor } from '../../../interfaces/proveedor';
import { ProveedorService } from '../../../services/proveedor.service';
import { EmpresaBancoCuentaDto } from '../../../interfaces/empresa-banco-cuenta';
import { BancoDto } from '../../../interfaces/banco';
import { BancoService } from '../../../services/banco.service';
import { EmpresaBancoCuentaService } from '../../../services/empresa-banco-cuenta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-caja-egresos-form',
  standalone: true,
  imports: [NavbarComponent, RouterModule, FormsModule, CommonModule, ReactiveFormsModule, ModalLiquidacionComponent],
  templateUrl: './caja-egresos-form.component.html',
  styleUrl: './caja-egresos-form.component.css',
})
export class CajaEgresosFormComponent implements OnInit {
  caja_egresos_form_val = {
    id_tipo_gasto: false,
    id_sede: false,
    id_empresa: false,
    id_banco: false,
    id_moneda: false,
    id_forma_pago: false,
    id_usuario: false,
    id_proveedor: false,
    fecha_pago: false,
    numero_cuenta: false,
    numero_operacion: false,
  };

  caja_egresos: Caja = {
    id: null,
    id_estado: null,
    estado: { nombre: '', valor: 0, indicador: '' },
    id_tipo: null,
    tipo: { nombre: '', valor: 0 },
    id_tipo_gasto: '',
    tipo_gasto: { nombre: '', valor: 0 },
    codigo: 'AUTOGEN',
    id_sede: '',
    sede: { nombre: '', abreviatura: '', monto_maximo: 0 },
    id_empresa: '',
    empresa: { nombre: '', direccion: '' },
    id_banco: '',
    banco: { nombre: '', abreviatura: '' },
    id_forma_pago: '',
    forma_pago: { descripcion: '' },
    id_usuario: '',
    usuario: { nombres: '', apellidos: '' },
    id_moneda: '',
    moneda: { nombre: '', valor: 0 },
    numero_operacion: '',
    fecha_pago: '',
    id_proveedor: null,
    proveedor: {
      ruc: '',
      razon_social: '',
    },
    numero_cuenta: '',
    id_caja_rembolso: null,
    caja_rembolsada: {
      id: '',
      codigo: '',
    },
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
  bancos: BancoDto[] = [];
  formasPago: FormaPago[] = [];
  usuariosActives: UsuariosLista[] = [];
  tiposGasto: CatalogoEstado[] = [];
  estadosCaja: CatalogoEstado[] = [];
  tiposCaja: CatalogoEstado[] = [];
  metodosRembolso: CatalogoEstado[] = [];
  proveedores: Proveedor[] = [];
  tiposMoneda: CatalogoEstado[] = [];
  cajas_por_rembolsar: Caja[] = [];
  empresa_banco_cuenta: EmpresaBancoCuentaDto[] = [];
  liquidaciones: Liquidacion[] = [];
  params = new HttpParams();
  queryParams: QueryParamsBuscarCajas = {
    id_caja_egresos: null,
  };

  queryBuscarCajas: BuscarParamsCaja = {
    skip_pagination: 0,
    take_tamanio: BUSCAR_TAKE,
    texto: '',
    fecha_desde: '',
    fecha_hasta: '',
    id_estado: '',
    id_tipo_caja: '',
    cajas_por_rembolsar: true,
  };
  myModalLiquidacion: any;
  @ViewChild(ModalLiquidacionComponent) modalLiquidacion!: ModalLiquidacionComponent;
  text_busqueda_proveedor = '';
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
    private elementRef: ElementRef,
    private _proveedorService: ProveedorService,
    private _bancoService: BancoService,
    private _empresaBancoCuentaService: EmpresaBancoCuentaService
  ) {}
  ngOnInit(): void {
    this.caja_egresos.id = this.route.snapshot.paramMap.get('id');
    this.myModalLiquidacion = new bootstrap.Modal(this.elementRef.nativeElement.querySelector('#modalLiquidacion'));
    this.myModalLiquidacion._element.addEventListener('hide.bs.modal', () => {
      if (this.modalLiquidacion.se_guardo_liquidacion === true) {
        this.params = new HttpParams();
        this.queryParams.id_caja_egresos = this.caja_egresos.id;
        this.setQueryParams(this.queryParams);
        this.getLiquidaciones();
      }
    });

    this._catalogoEstadoService.getTiposMoneda().subscribe({
      next: (tiposMoneda) => {
        this.tiposMoneda = tiposMoneda;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
    this._bancoService.getAll().subscribe({
      next: (bancos) => {
        this.bancos = bancos;
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
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

    this._catalogoEstadoService.getEstadosCaja().subscribe({
      next: (estadosCaja) => {
        this.estadosCaja = estadosCaja;
        if (!this.caja_egresos.id) {
          this.caja_egresos.id_estado = estadosCaja.find((tc) => tc.valor === 1)?.id ?? null;
        }
        // ESTADO
        const indexEstadoCaja = this.estadosCaja.findIndex((estado) => estado.id === this.caja_egresos.id_estado);
        if (indexEstadoCaja >= 0) {
          this.estadosCaja[indexEstadoCaja].existe = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
      complete: () => {
        this._catalogoEstadoService.getTiposCaja().subscribe({
          next: (tiposCaja) => {
            this.tiposCaja = tiposCaja;
            console.log(tiposCaja);
            const findTipoCaja = tiposCaja.find((tc) => tc.nombre.toUpperCase() === NOMBRE_CAJA_GRANDE);
            console.log(findTipoCaja);
            if (findTipoCaja) {
              this.caja_egresos.id_tipo = findTipoCaja.id;
              this.caja_egresos.tipo = findTipoCaja;
            }
          },
          error: (error: HttpErrorResponse) => {
            return this._toastService.msgError(error);
          },
          complete: () => {
            this.buscarCajaChicaRembolso();
          },
        });
      },
    });

    if (this.caja_egresos.id) {
      this.queryParams.id_caja_egresos = this.caja_egresos.id;
      this.setQueryParams(this.queryParams);
      this._cajaService.findCajaById(this.caja_egresos.id).subscribe({
        next: (caja) => {
          console.log(caja, 'CAJA');
          if (!caja.caja_rembolsada) {
            caja.caja_rembolsada = {
              id: '',
              codigo: '',
            };
          }
          caja.fecha_pago = formatFecha(caja.fecha_pago);
          this.caja_egresos = caja;
          this.caja_egresos.caja_metodo_rembolso?.map((cmr) => {
            const findIdRembolso = this.metodosRembolso.findIndex((mr) => mr.id === cmr.metodo_rembolso.id);
            if (findIdRembolso >= 0) {
              this.metodosRembolso[findIdRembolso].existe = true;
            }
          });
          // ESTADO
          const indexEstadoCaja = this.estadosCaja.findIndex((estado) => estado.id === this.caja_egresos.id_estado);
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
      if (findMetodo) this.caja_egresos.caja_metodo_rembolso?.push({ metodo_rembolso: findMetodo });
    } else {
      console.log('DESMARCANDO');
      if (this.caja_egresos.caja_metodo_rembolso) {
        const indexMetodo = this.caja_egresos.caja_metodo_rembolso.findIndex(
          (mr) => mr.metodo_rembolso.id === metodoId
        );
        if (indexMetodo !== -1) {
          this.caja_egresos.caja_metodo_rembolso?.splice(indexMetodo, 1);
        }
      }
      console.log(this.caja_egresos.caja_metodo_rembolso, 'IDS CHANGE');
    }
  }
  isChecked(metodoId: string): boolean {
    console.log(metodoId);
    return this.metodosRembolso.map((mr) => mr.id).includes(metodoId);
  }
  enviarIdCaja() {
    return this.caja_egresos.id;
  }
  guardarCaja() {
    const valForm = this.validarFormularioCaja();

    if (valForm === true) {
      this._toastService.messageInfo(completarCamposRequeridos);
      return;
    }
    // if (this.caja_egresos.caja_metodo_rembolso && !(this.caja_egresos.caja_metodo_rembolso.length > 0)) {
    //   return this._toastService.messageError('Debe seleccionar almenos un metodo de rembolso.', 'Aviso!.');
    // }
    console.log(this.caja_egresos, 'CAJA ANTES DE GUARDAR');
    if (this.caja_egresos.id) {
      this._cajaService.editarCaja(this.caja_egresos, this.caja_egresos.id).subscribe({
        next: (caja) => {
          console.log(caja, 'CAJA EDITADA');
          this.caja_egresos.id = caja.id;
          this._toastService.messageAddOk('Se edito Caja Egresos.');
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
    } else {
      this._cajaService.guardarCajaEgresos(this.caja_egresos).subscribe({
        next: (caja) => {
          this.caja_egresos.id = caja.id ?? null;
          this.caja_egresos.codigo = caja.codigo;
          this.router.navigateByUrl(`/caja_egresos_form/${caja.id}`);
          this._toastService.messageAddOk('Se guardó la Caja Egresos.');
        },
        error: (error: HttpErrorResponse) => {
          return this._toastService.msgError(error);
        },
      });
    }
  }

  setTipoLiquidacion() {
    this.modalLiquidacion.caja_detalle.id_caja = this.caja_egresos.id;
    this.modalLiquidacion.caja_detalle.id_tipo = this.caja_egresos.id_tipo ?? null;
    if (this.caja_egresos.tipo) this.modalLiquidacion.caja_detalle.tipo = this.caja_egresos.tipo;
    this.modalLiquidacion.caja_detalle.es_caja_chica = false;
  }
  openModalLiquidacionEdit(id: string) {
    // this.modalLiquidacion.tiposReqDetalle = this.tiposReqDetalle;
    this.setTipoLiquidacion();
    // this.modalLiquidacion.caja_detalle.id_requerimiento = null;
    let findLiquidacion = this.liquidaciones.find((liquidacion) => liquidacion.id === id);
    console.log(findLiquidacion);
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
    if (!this.caja_egresos.id) {
      return this._toastService.messageInfo(debeCrearAntesUnaCaja);
    }
    this.setTipoLiquidacion();

    this.modalLiquidacion.openModalCreate();
  }

  confirmBox(id_estado: string, nombre_estado: string) {
    let respuesta = false;
    if (!this.caja_egresos.id) return this._toastService.messageInfo(debeCrearAntesUnaCaja);
    this.caja_egresos.id_estado = id_estado;
    this._swalertService.confirmBoxSwal(nombre_estado).then(async (result) => {
      if (result.value && this.caja_egresos.id) {
        this._cajaService.editarEstado(this.caja_egresos, this.caja_egresos.id).subscribe({
          next: (caja) => {
            console.log(this.caja_egresos.id_estado, 'ESTADO ACTUAL');
            console.log(caja.id_estado, 'SE RETORNO CAJA');
            const indexEstadoCaja = this.estadosCaja.findIndex((estado) => estado.id === this.caja_egresos.id_estado);
            this.estadosCaja.forEach((estado) => {
              estado.existe = false;
            });
            if (indexEstadoCaja >= 0) {
              this.estadosCaja[indexEstadoCaja].existe = true;
            }
            respuesta = true;
            Swal.fire('Ok!', 'El estado fue editado.', 'success');
          },
          error: (error: HttpErrorResponse) => {
            this._toastService.msgError(error);
            respuesta = false;
          },
        });
        // Swal.fire('Ok!', 'El estado fue editado.', 'success');
        // return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
      return false; // En caso de que ninguna condición se cumpla
    });
    // this._swalertService.confirmBox(id_estado, nombre_estado).then((respuesta) => {
    //   if (respuesta) {
    //     this.caja_egresos.id_estado = id_estado;
    //     if (this.caja_egresos.id) {
    // this._cajaService.editarEstado(this.caja_egresos, this.caja_egresos.id).subscribe({
    //   next: (caja) => {
    //     const indexEstadoCaja = this.estadosCaja.findIndex((estado) => estado.id === this.caja_egresos.id_estado);
    //     this.estadosCaja.forEach((estados) => {
    //       estados.existe = false;
    //     });
    //     if (indexEstadoCaja >= 0) {
    //       this.estadosCaja[indexEstadoCaja].existe = true;
    //     }
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     return this._toastService.msgError(error);
    //   },
    //       });
    //     }
    //   } else {
    //     console.log('NO confirmo');
    //   }
    // });
  }

  validarInputCajaEgresos(input: CajaEgresosValidacion) {
    this.caja_egresos_form_val[input] = !this.caja_egresos[input] ? true : false;
    return this.caja_egresos_form_val[input];
  }
  validarFormularioCaja() {
    let toastMsg = false;
    for (const key in this.caja_egresos_form_val) {
      if (Object.prototype.hasOwnProperty.call(this.caja_egresos_form_val, key)) {
        const valInput = this.validarInputCajaEgresos(key as CajaEgresosValidacion);
        if (toastMsg === false) toastMsg = valInput;
      }
    }
    return toastMsg;
  }

  getLiquidaciones() {
    if (this.caja_egresos.id) {
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

  buscarProveedorePorRS() {
    if (!(this.text_busqueda_proveedor.length > 0)) {
      return this._toastService.messageInfo('Ingrese texto.');
    }
    this._proveedorService.buscarPorRazonSocial(this.text_busqueda_proveedor).subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores;
        if (proveedores.length > 0) {
          this.proveedores = proveedores;
          this._toastService.messageAddOk('Busqueda completa.');
        } else {
          this._toastService.messageInfo('Busqueda sin resultados.');
        }
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
  }

  setQueryParamsEBC(query: Partial<Caja>) {
    let params = new HttpParams();
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key as keyof Partial<Caja>];
        if (typeof value === 'string' || typeof value === 'number') {
          params = params.append(key, String(value));
        }
      }
    }
    return params;
  }
  setQueryParamsBuscarCaja(query: BuscarParamsCaja) {
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key as keyof BuscarParamsCaja];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          this.params = this.params.append(key, String(value));
        }
      }
    }
  }
  onChangeEmpresaBancoMoneda() {
    this.params = new HttpParams();
    const queryBuscar: Partial<Caja> = {
      id_empresa: this.caja_egresos.id_empresa,
      id_banco: this.caja_egresos.id_banco,
      id_moneda: this.caja_egresos.id_moneda,
    };

    if (queryBuscar.id_empresa && queryBuscar.id_banco && queryBuscar.id_moneda) {
      const params = this.setQueryParamsEBC({ ...queryBuscar });
      console.log(params, 'PARAMETROS SETEADOS');
      this._empresaBancoCuentaService.getNumerosCuenta(params).subscribe({
        next: (numeroCuentas) => {
          if (numeroCuentas.length > 0) {
            this.empresa_banco_cuenta = numeroCuentas;
          } else {
            this._toastService.messageInfo('No se encontro numero de cuenta para Empresa,Banco y Moneda seleccionados');
            this.empresa_banco_cuenta = [];
          }
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
        complete: () => console.log('BUSQUEDA REQUERIMIENTOS Complete'),
      });
    } else {
      this.empresa_banco_cuenta = [];
    }
    this.params;
  }
  buscarCajaChicaRembolso() {
    this.params = new HttpParams();
    const idEstado = this.estadosCaja.find((estado) => estado.nombre.toUpperCase() === TEXT_CERRADO)?.id ?? null;
    console.log(idEstado, 'ESTADO');
    const idTipo = this.tiposCaja.find((tipo) => tipo.nombre.toUpperCase() === 'CHICA')?.id ?? null;
    if (idEstado && this.caja_egresos.id_tipo && idTipo) {
      this.queryBuscarCajas = {
        ...this.queryBuscarCajas,
        id_estado: idEstado,
        id_tipo_caja: idTipo,
        cajas_por_rembolsar: true,
      };

      this.setQueryParamsBuscarCaja(this.queryBuscarCajas);
      console.log(this.params, 'PARAMETROS');
      this._cajaService.buscarCajas(this.params).subscribe({
        next: ({ cajas }) => {
          console.log(cajas, 'cajas');
          this.cajas_por_rembolsar = cajas;
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
}
