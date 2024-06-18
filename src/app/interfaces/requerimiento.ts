import { Liquidacion } from './liquidacion';

export interface Requerimiento {
  id: string | null;
  estado: { nombre: string; valor: number };
  id_estado: string;
  id_tipo: string;
  tipo: { nombre: string };
  fecha_inicio: string;
  dia_inicio?: string;
  fecha_fin: string;
  dia_fin?: string;
  total_dias: number;
  id_area: string;
  area: { nombre: string };
  descripcion: string;
  observacion: string;
  id_usuario: string;
  user: { nombres: string; apellidos: string };
  // requerimiento_ruta: Rutas[];
  requerimiento_detalle: Detalles[];
  liquidacion?: Liquidacion[];

  monto_total: string;
  fecha_creacion?: string;
  fecha_edicion?: string;
  usuariocreacion?: string;
}

export interface Pasaje {
  id: string | null;
  fecha: string;
  id_estado: string;
  estado: {
    nombre: string;
    valor: number;
  };
  id_tipo: string;
  tipo: {
    nombre: string;
    valor: number;
  };
  id_ciudad_origen: string;
  ciudad_origen: {
    nombre: string;
    valor: number;
  };
  id_ciudad_destino: string;
  ciudad_destino: {
    nombre: string;
    valor: number;
  };
  monto: number;
  monto_format: string;
  observacion: string;
  index: number;
}
export interface Hospedaje {
  id: string | null;
  id_estado: string;
  estado: {
    nombre: string;
    valor: number;
  };
  id_tipo: string;
  tipo: {
    nombre: string;
    valor: number;
  };
  fecha_inicio: string;
  fecha_fin: string;
  id_ciudad: string;
  ciudad: {
    nombre: string;
  };
  noches: number;
  monto: number;
  monto_format: string;
  es_gestionado: boolean;
  observacion: string;
  index: number;
}
export interface Alimento {
  id: string | null;
  id_estado: string;
  estado: {
    nombre: string;
    valor: number;
  };
  id_tipo: string;
  tipo: {
    nombre: string;
    valor: number;
  };
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  detalle: string;
  monto: number;
  monto_format: string;
  observacion: string;
  index: number;
}
export interface Traslado {
  id: string | null;
  id_estado: string;
  estado: {
    nombre: string;
    valor: number;
  };
  id_tipo: string;
  tipo: {
    nombre: string;
    valor: number;
  };
  id_ciudad: string;
  ciudad: {
    nombre: string;
  };
  fecha: string;
  lugar_origen: string;
  lugar_destino: string;
  detalle: string;
  monto: number;
  monto_format: string;
  observacion: string;
  index: number;
}
export interface Otro {
  id: string | null;
  id_estado: string;
  estado: {
    nombre: string;
    valor: number;
  };
  id_tipo: string;
  tipo: {
    nombre: string;
    valor: number;
  };
  lugar_origen: string;
  lugar_destino: string;
  tipo_otros: string;
  detalle: string;
  monto: number;
  monto_format: string;
  observacion: string;
  index: number;
}
export interface Rutas {
  id?: string;
  id_estado: string;
  idrequerimiento?: string;
  fecha: string;
  id_ciudad_origen: string;
  ciudad_origen: {
    nombre: string;
    valor: number;
  };

  id_ciudad_destino: string;
  ciudad_destino: {
    nombre: string;
    valor: number;
  };

  monto: number;
  monto_format: string;

  fechacreacion?: string;
  usuariocreacion?: string;

  index: number;
}
export interface Detalles {
  id: string | null;
  id_estado: string | null;
  estado: {
    nombre: string;
    valor: number;
  };
  id_tipo: string | null;
  tipo: {
    nombre: string;
    valor: number;
  };
  id_requerimiento: string | null;
  fecha: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  id_ciudad_origen: string | null;
  ciudad_origen: {
    nombre: string;
    valor: number;
  };

  id_ciudad_destino: string | null;
  ciudad_destino: {
    nombre: string;
    valor: number;
  };
  id_ciudad: string | null;
  ciudad: {
    nombre: string;
    valor: number;
  };
  lugar_origen: string | null;
  lugar_destino: string | null;
  detalle_visita: string | null;
  tipo_otros: string | null;

  dias: number;
  noches: number;
  es_gestionado: boolean;
  monto: number;
  monto_format: string;
  detalle: string | null;
  observacion: string | null;

  usuario_creacion: {
    nombre: string;
  };
  fecha_creacion: string | null;
  usuario_edicion: {
    nombre: string;
  };
  fecha_edicion: string | null;
  index: number;
}

// export interface Liquidacion {
//   id?: string;
//   es_caja_chica: boolean;
//   orden?: number;
//   fecha: string;
//   idrequerimiento: string;
//   idcaja: string;
//   idcomprobante: string;
//   serie: string;
//   numero: string;
//   idproveedor: string;
//   idmoneda: number;
//   tipocambio: number;
//   total: number;
//   totaligv?: number;
//   tasadetraccion?: number;
//   totaldetraccion?: number;
//   tasaretencion?: number;
//   totalretencion?: number;
//   apagar?: number;
//   glosa: string;
//   idgastos_relacion: string;
//   fechacreacion?: string;
//   usuariocreacion?: string;
// }
export interface rutaValidaciones {
  fecha: boolean;
  ciudadOrigen: boolean;
  ciudadDestino: boolean;
  monto: boolean;
}
export interface QueryParams {
  skip_pagination: number;
  take_tamanio: number;
  texto: string;
  fecha_desde: string;
  fecha_hasta: string;
  id_estado: string;
}
export type RutaValidaciones = 'fecha' | 'id_ciudad_origen' | 'id_ciudad_destino' | 'monto_format';
export type PasajeValidaciones = 'fecha' | 'id_ciudad_origen' | 'id_ciudad_destino' | 'monto_format';
export type HospedajeValidaciones = 'fecha_inicio' | 'fecha_fin' | 'id_ciudad' | 'monto_format';
export type AlimentoValidaciones = 'fecha_inicio' | 'fecha_fin' | 'monto_format';
export type TrasladoValidaciones = 'id_ciudad' | 'fecha' | 'lugar_origen' | 'lugar_destino' | 'monto_format';
export type OtroValidaciones = 'tipo_otros' | 'monto_format';
export type DetalleValidaciones =
  | 'fecha'
  | 'id_ciudad'
  // | 'id_gastos_viaticos'
  | 'monto_format';

export type RequerimientoInputReq = 'fecha_inicio' | 'fecha_fin' | 'id_area' | 'descripcion';
