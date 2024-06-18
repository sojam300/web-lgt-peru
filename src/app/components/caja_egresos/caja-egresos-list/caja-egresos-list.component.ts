import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { QueryParams } from '../../../interfaces/requerimiento';
import { BUSCAR_TAKE, NOMBRE_CAJA_CHICA, NOMBRE_CAJA_GRANDE } from '../../../../environments/environment';
import { CatalogoEstado } from '../../../interfaces/catalogo-estado';
import { CajaService } from '../../../services/caja.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BuscarParamsCaja, Caja } from '../../../interfaces/caja';
import { ToastService } from '../../../services/error.service';
import { CatalogoEstadoService } from '../../../services/catalogo-estado.service';
import { formatFechaNull } from '../../../common/helpers';

@Component({
  selector: 'app-caja-egresos-list',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './caja-egresos-list.component.html',
  styleUrl: './caja-egresos-list.component.css',
})
export class CajaEgresosListComponent implements OnInit {
  params = new HttpParams();
  queryParams: BuscarParamsCaja = {
    skip_pagination: 0,
    take_tamanio: BUSCAR_TAKE,
    texto: '',
    fecha_desde: '',
    fecha_hasta: '',
    id_estado: '',
    id_tipo_caja: '',
    cajas_por_rembolsar: false,
  };
  cajas: Caja[] = [];
  totalRows: number = 0;
  id_tipo_caja: string | null = null;
  tiposCaja: CatalogoEstado[] = [];
  estadosCaja: CatalogoEstado[] = [];
  loadingBuscar = false;
  constructor(
    private _cajaService: CajaService,
    private _toastService: ToastService,
    private _catalogoEstadoService: CatalogoEstadoService,
    private router: Router
  ) {}
  setQueryParams(query: QueryParams) {
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key as keyof QueryParams];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          this.params = this.params.append(key, String(value));
        }
      }
    }
  }
  ngOnInit(): void {
    this._catalogoEstadoService.getTiposCaja().subscribe({
      next: (tiposCaja) => {
        const findTipoCaja = tiposCaja.find((tc) => tc.nombre.toUpperCase() === NOMBRE_CAJA_GRANDE);
        console.log(findTipoCaja, 'BuscarParamsCajaEgresos');
        if (findTipoCaja) {
          this.queryParams.id_tipo_caja = findTipoCaja.id;
          this.buscarCajas();
        }
      },
      error: (error: HttpErrorResponse) => {
        return this._toastService.msgError(error);
      },
    });
  }

  buscarCajas() {
    this.setQueryParams(this.queryParams);
    console.log(this.params);
    this._cajaService.buscarCajas(this.params).subscribe({
      next: ({ cajas, totalRows }) => {
        console.log(cajas);
        cajas.forEach((caja) => {
          caja.fecha_creacion = formatFechaNull(caja.fecha_creacion) ?? '';
          caja.fecha_edicion = formatFechaNull(caja.fecha_edicion) ?? '';
          caja.fecha_pago = formatFechaNull(caja.fecha_pago) ?? '';
        });
        this.cajas = cajas;
        // this.cajas = this.formatRequerimientos(r.data);
        // this.totalRows = r.totalRows;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
      complete: () => console.log('BUSQUEDA REQUERIMIENTOS Complete'),
    });
  }

  editarCaja(id: string | null) {
    const caja = this.cajas.find((caja) => (caja.id = id));
    console.log(caja);
    if (caja) {
      this.router.navigate(['/caja_egresos_form', caja.id]);
    }
  }
}
