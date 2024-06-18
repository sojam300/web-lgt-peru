import { BancoDto, BancoSelect } from './banco';
import { CatalogoEstado } from './catalogo-estado';
import { ComprobanteSelect } from './comprobante';
import { Empresa, EmpresaSelect } from './empresa';
import { ProveedorSelect } from './proveedor';
import { Sede, SedeSelect } from './sede';
import { UserSelect } from './user';

export interface ProgramacionSolicitudes {
  id: string | null;
  codigo: string;
  estado: CatalogoEstado | null;
  tipo: CatalogoEstado | null;
  usuario_solicitud: UserSelect | null;
  fecha_solicitud: Date | null;
  fecha_tentativa_pago: Date | null;
  tipo_pago: CatalogoEstado | null;
  tipo_seguro: CatalogoEstado | null;
  tipo_afp: CatalogoEstado | null;
  comprobante: ComprobanteSelect | null;
  proveedor: ProveedorSelect | null;
  ruc: string;
  sede: SedeSelect | null;
  moneda: CatalogoEstado | null;
  banco: BancoSelect | null;
  empresa: EmpresaSelect | null;
  banco_origen: BancoSelect | null;
  banco_destino: BancoSelect | null;
  empresa_origen: EmpresaSelect | null;
  empresa_destino: EmpresaSelect | null;
  numero_cuenta: string | null;
  numero_cuenta_origen: string | null;
  numero_cuenta_destino: string | null;
  numero_cuenta_proveedor: string | null;
  numero_contrato: string | null;
  numero_cuota: string | null;
  trabajador: UserSelect | null;
  numero_cuenta_trabajador: string | null;
  tipo_deposito: string | null;
  numero_requerimiento: string | null;
  ruta: string | null;
  origen_viaje: string | null;
  destino_viaje: string | null;
  codigo_pago_viaje: string | null;
  serie: string | null;
  numero: string | null;
  pais: CatalogoEstado | null;
  mes: string | null;
  total: number;
  tasa_detraccion: number | null;
  total_detraccion: number | null;
  tasa_retencion: number | null;
  total_retencion: number | null;
  total_igv: number | null;
  a_pagar: number | null;
  glosa: string | null;
  files: File[];
  archivos: { id: string; nombre: string }[];
}

export interface ProgramacionPagosDialog {
  esSolicitud: boolean;
  esProgramacion: boolean;
  form: ProgramacionSolicitudes;
  empresas: EmpresaSelect[];
  bancos: BancoSelect[];
  comprobantes: ComprobanteSelect[];
  tiposMoneda: CatalogoEstado[];
  tiposPago: CatalogoEstado[];
  tiposSeguros: CatalogoEstado[];
  tiposAfp: CatalogoEstado[];
  sedes: SedeSelect[];
  paises: CatalogoEstado[];

  tiposSolicitudProgramacion: CatalogoEstado[];
  estadosSolicitudProgramacion: CatalogoEstado[];
  trabajadores: UserSelect[];
}

export interface BusquedaSolicitudProgramacion {
  page_index: number;
  page_size: number;
  codigo: string;
  fecha_desde: string | undefined;
  fecha_hasta: string | undefined;
  id_estado: string;
  id_tipo: string;
}
