import { CatalogoEstado } from './catalogo-estado';

export type SolicitudFormValidacion = 'id_sede' | 'id_area' | 'id_persona' | 'descripcion';
export type SolicitudDetFormValidacion = 'monto_format' | 'item';
export interface Solicitud {
  id: string | null;
  codigo: string;
  id_estado: string | null;
  estado: CatalogoEstado;
  id_caja: string | null;
  caja: { id: null; codigo: string; id_tipo: string };
  id_sede: string | null;
  sede: { nombre: string; abreviatura: string; monto_maximo: number };
  id_area: string | null;
  area: { nombre: string };
  id_persona: string | null;
  persona: { nombres: string; apellidos: string };
  descripcion: string;
  observacion: string;
  id_usuario_creacion: string;
  usuario_creacion: { nombres: string; apellidos: string };
  fecha_creacion: string | null;
  id_usuario_edicion: string | null;
  usuario_edicion: { nombres: string; apellidos: string };
  fecha_edicion: string;
  caja_solicitud_metodo_rembolso: { id_tipo_rembolso: string }[];
  solicitud_caja_detalle: SolicitudDetalle[];
}
export interface SolicitudDetalle {
  id: string | null;
  id_solicitud_caja: string;
  monto: number;
  monto_format: string;
  item: string;
}

export interface BuscarParamsSolicitud {
  skip_pagination: number;
  take_tamanio: number;
  texto: string;
  fecha_desde: string;
  fecha_hasta: string;
  id_estado: string;
  id_tipo: string;
}
