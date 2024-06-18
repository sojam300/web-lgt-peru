import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueryParams, Requerimiento } from '../../../interfaces/requerimiento';
import { RequerimientoService } from '../../../services/requerimiento.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastService } from '../../../services/error.service';
import { formatNumber } from '../../../common/helpers';
import moment from 'moment';
import 'moment/locale/es';
import { BUSCAR_TAKE } from '../../../../environments/environment';
import { CatalogoEstado } from '../../../interfaces/catalogo-estado';
import { CatalogoEstadoService } from '../../../services/catalogo-estado.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { LiquidacionService } from '../../../services/liquidacion.service';
import { SidenavComponent } from '../../sidenav/sidenav.component';
moment.locale('es');
@Component({
  selector: 'app-req-viaticos-lista',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule, FormsModule, SpinnerComponent, SidenavComponent],
  templateUrl: './requerimiento-viaticos-list.component.html',
  styleUrl: './requerimiento-viaticos-list.component.css',
})
export class RequerimientoViaticosListComponent implements OnInit {
  @ViewChild('tablaElemento') tablaElemento!: ElementRef;
  params = new HttpParams();
  queryParams: QueryParams = {
    skip_pagination: 0,
    take_tamanio: BUSCAR_TAKE,
    texto: '',
    fecha_desde: '',
    fecha_hasta: '',
    id_estado: '',
  };
  totalRows: number = 0;
  isNoMoreData: boolean = false;
  takeTamanio: number = BUSCAR_TAKE;

  requerimientos: Requerimiento[] = [];
  estadosRequemiento: CatalogoEstado[] = [];
  loadingBuscar: boolean = false;
  loadingCargar: boolean = false;
  constructor(
    private _requerimientoService: RequerimientoService,
    private _toastService: ToastService,
    private _catalogoEstadoService: CatalogoEstadoService,
    private router: Router,
    private _liquidacionService: LiquidacionService
  ) {}

  ngOnInit(): void {
    // this.setQueryParams(this.queryParams);
    this.setQueryParams(this.queryParams);
    console.log(this.params);
    this._requerimientoService.buscarRequerimientos(this.params).subscribe({
      next: (r) => {
        console.log(r, 'REQ DB');
        this.requerimientos = this.formatRequerimientos(r.data);
        this.totalRows = r.totalRows;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
      complete: () => console.log('BUSQUEDA REQUERIMIENTOS Complete'),
    });

    this._catalogoEstadoService.getEstadosRequerimiento().subscribe({
      next: (estadosReq) => {
        this.estadosRequemiento = estadosReq;
        // this.requerimiento.id_estado = this.estadosRequemiento.find((eq) => eq.valor === 1)?.id ?? '';
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
      complete: () => console.log('Catalogo Estado Estados Requerimiento'),
    });

    this._liquidacionService.findLiquidaciones().subscribe({
      next: (liquidaciones) => {
        console.log(liquidaciones, 'LIQUIDACIONES');
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
  }

  setQueryParams(query: QueryParams) {
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key as keyof QueryParams];
        if (typeof value === 'string' || typeof value === 'number') {
          this.params = this.params.append(key, String(value));
        }
      }
    }
  }

  formatRequerimientos(requerimientos: Requerimiento[]) {
    const reqFormated = requerimientos;
    reqFormated.forEach((reqs) => {
      if (reqs.requerimiento_detalle.length > 0) {
        reqs.monto_total = formatNumber(
          reqs.requerimiento_detalle.reduce((acc, curr) => acc + parseFloat(curr.monto.toString()), 0).toString()
        );
      }

      reqs.dia_inicio = moment(reqs.fecha_inicio).format('dddd');
      reqs.fecha_inicio = moment(reqs.fecha_inicio).format('DD MM YYYY');
      reqs.dia_fin = moment(reqs.fecha_fin).format('dddd');
      reqs.fecha_fin = moment(reqs.fecha_fin).format('DD MM YYYY');
      reqs.fecha_creacion = moment(reqs.fecha_creacion).format('DD MM YYYY');
      reqs.fecha_edicion = moment(reqs.fecha_edicion).format('DD MM YYYY');
    });
    return reqFormated;
  }
  navigateTableEnd() {
    setTimeout(() => {
      if (this.tablaElemento && this.tablaElemento.nativeElement) {
        this.tablaElemento.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 500);
  }
  cargarRequerimientos() {
    this.params = new HttpParams();
    this.queryParams.skip_pagination += this.queryParams.take_tamanio;
    console.log(this.queryParams);
    if (this.isNoMoreData) {
      return this._toastService.messageError('', 'No existen datos.!');
    }
    if (
      this.queryParams.take_tamanio + this.queryParams.skip_pagination > this.totalRows &&
      this.totalRows % this.queryParams.take_tamanio > 0
    ) {
      this.queryParams.take_tamanio = this.totalRows % this.queryParams.take_tamanio;
      this.isNoMoreData = true;
    }

    this.setQueryParams(this.queryParams);
    this._requerimientoService.buscarRequerimientos(this.params).subscribe({
      next: (r) => {
        console.log(r, 'CARGAR');
        this.requerimientos = this.requerimientos.concat(this.formatRequerimientos(r.data));
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
      complete: () => console.log('BUSQUEDA REQUERIMIENTOS Complete'),
    });
    this._toastService.messageAddOk('Busqueda Completa.');
    this.navigateTableEnd();
  }

  buscarRequerimientos() {
    this.loadingBuscar = true;
    this.isNoMoreData = false;
    this.params = new HttpParams();
    this.queryParams.skip_pagination = 0;
    this.queryParams.take_tamanio = 5;
    console.log(this.queryParams);

    this.setQueryParams(this.queryParams);
    this._requerimientoService.buscarRequerimientos(this.params).subscribe({
      next: (r) => {
        console.log(r, 'REQ DB');
        this.requerimientos = this.formatRequerimientos(r.data);
        this.totalRows = r.totalRows;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
      complete: () => console.log('BUSQUEDA REQUERIMIENTOS Complete'),
    });
    this.loadingBuscar = false;
    this._toastService.messageAddOk('Busqueda Completa.');
  }

  editRequerimiento(id: string | null) {
    const requerimiento = this.requerimientos.find((r) => (r.id = id));
    console.log(requerimiento);
    if (requerimiento) {
      this.router.navigate(['/requerimiento_viaticos_form', requerimiento.id]);
    }
  }
}
