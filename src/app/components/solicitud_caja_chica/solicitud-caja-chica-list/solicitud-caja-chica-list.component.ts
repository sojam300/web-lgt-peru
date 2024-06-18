import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CajaService } from '../../../services/caja.service';
import { ToastService } from '../../../services/error.service';
import { CatalogoEstadoService } from '../../../services/catalogo-estado.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { BuscarParamsCajaChica, Caja } from '../../../interfaces/caja';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BUSCAR_TAKE } from '../../../../environments/environment';
import { CatalogoEstado } from '../../../interfaces/catalogo-estado';
import { QueryParams } from '../../../interfaces/requerimiento';
import { formatFechaNull } from '../../../common/helpers';
import { BuscarParamsSolicitud, Solicitud } from '../../../interfaces/solicitud';
import { SolicitudService } from '../../../services/solicitud.service';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-solicitud-caja-chica-list',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule, FormsModule, SpinnerComponent, SidenavComponent],
  templateUrl: './solicitud-caja-chica-list.component.html',
  styleUrl: './solicitud-caja-chica-list.component.css',
})
export class SolicitudCajaChicaListComponent implements OnInit {
  params = new HttpParams();
  queryParams: BuscarParamsSolicitud = {
    skip_pagination: 0,
    take_tamanio: BUSCAR_TAKE,
    texto: '',
    fecha_desde: '',
    fecha_hasta: '',
    id_estado: '',
    id_tipo: '',
  };
  solicitudes: Solicitud[] = [];
  totalRows: number = 0;
  isNoMoreData: boolean = false;
  id_tipo_caja: string | null = null;
  tiposCaja: CatalogoEstado[] = [];
  estadosCaja: CatalogoEstado[] = [];
  loadingBuscar = false;
  constructor(
    private _cajaService: CajaService,
    private _toastService: ToastService,
    private _catalogoEstadoService: CatalogoEstadoService,
    private _solicitudService: SolicitudService,
    private router: Router
  ) {}
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
  ngOnInit(): void {
    this.buscarSolicitudes(false);
  }
  buscarSolicitudes(es_cargar: boolean) {
    this.loadingBuscar = true;
    this.isNoMoreData = false;
    if (es_cargar === false) {
      this.queryParams.skip_pagination = 0;
      this.queryParams.take_tamanio = 5;
    }

    this.params = new HttpParams();
    this.setQueryParams(this.queryParams);

    this._solicitudService.buscarSolicitudes(this.params).subscribe({
      next: ({ solicitudes, totalRows }) => {
        if (!(solicitudes.length > 0)) {
          this.loadingBuscar = false;
          return this._toastService.messageInfo('No existen mas datos.');
        }
        solicitudes.forEach((solicitud) => {
          solicitud.fecha_creacion = formatFechaNull(solicitud.fecha_creacion) ?? '';
          solicitud.fecha_edicion = formatFechaNull(solicitud.fecha_edicion) ?? '';
        });

        this.solicitudes = es_cargar ? this.solicitudes.concat(solicitudes) : solicitudes;
        // this.cajas = this.formatRequerimientos(r.data);
        this.loadingBuscar = false;
        this.totalRows = totalRows;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
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
    this.buscarSolicitudes(true);
  }
  editarCaja(id: string | null) {
    const solicitud = this.solicitudes.find((solicitud) => (solicitud.id = id));
    console.log(solicitud);
    if (solicitud) {
      this.router.navigate(['/solicitud_caja_chica_form', solicitud.id]);
    }
  }
}
