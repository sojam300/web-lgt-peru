export interface CajaChica {
  id?: string | null;
  id_estado?: string | null;
  estado: {
    nombre: string;
    valor: number;
  };
  id_tipo: string | null;
  tipo: {
    nombre: string;
    valor: number;
  } | null;
  id_tipo_gasto?: string | null;
  tipo_gasto: {
    nombre: string;
    valor: number;
  };
  codigo: string;
  id_sede?: string | null;
  sede: {
    nombre: string;
    abreviatura: string;
    monto_maximo: number;
  };
  id_empresa?: string | null;
  empresa: {
    nombre: string;
    direccion: string;
  };

  id_forma_pago: string | null;
  forma_pago: {
    descripcion: string;
  };
  id_usuario?: string | null;
  usuario: {
    nombres: string;
    apellidos: string;
  };

  total_igv: number;
  monto_maximo: number;
  total_pagar: number;
  id_usuario_creacion?: string | null;
  usuario_creacion: {
    nombres: string;
    apellidos: string;
  };
  fecha_creacion: string;
  id_usuario_edicion?: string | null;
  usuario_edicion: {
    nombres: string;
    apellidos: string;
  };
  fecha_edicion: string;
  ids_metodo_rembolso: string[];
}
export interface Caja {
  id: string | null;
  id_estado: string | null;
  estado: {
    nombre: string;
    valor: number;
    indicador?: string;
  };
  id_tipo: string | null;
  tipo: {
    nombre: string;
    valor: number;
  } | null;
  id_tipo_gasto: string | null;
  tipo_gasto: {
    nombre: string;
    valor: number;
  };
  codigo: string;
  id_sede: string | null;
  sede: {
    nombre: string;
    abreviatura: string;
    monto_maximo: number;
  };
  id_empresa?: string | null;
  empresa: {
    nombre: string;
    direccion: string;
  };
  id_banco: string | null;
  banco: {
    nombre: string;
    abreviatura: string;
  } | null;
  id_moneda?: string | null;
  moneda: {
    nombre: string;
    valor: number;
  };
  numero_cuenta: string;
  id_caja_rembolso: string | null;
  caja_rembolsada: {
    id: string;
    codigo: string;
  };
  id_forma_pago?: string | null;
  forma_pago: {
    descripcion: string;
  };
  id_usuario: string | null;
  usuario: {
    nombres: string;
    apellidos: string;
  };
  numero_operacion: string;
  fecha_pago: string;
  id_proveedor: string | null;
  proveedor: {
    ruc: string;
    razon_social: string;
  };
  total_igv: number;
  monto_maximo: number;
  total_pagar: number;
  id_usuario_creacion: string | null;
  usuario_creacion: {
    nombres: string;
    apellidos: string;
  };
  fecha_creacion: string;
  id_usuario_edicion?: string | null;
  usuario_edicion: {
    nombres: string;
    apellidos: string;
  };
  fecha_edicion: string;
  caja_metodo_rembolso: { metodo_rembolso: { id: string; nombre: string } }[];
  ids_metodo_rembolso: string[];
}

export interface CajaDetalle {
  id?: string | null;
  id_estado?: string | null;
  estado: {
    nombre: string;
    valor: number;
  };
  id_tipo?: string | null;
  tipo: {
    nombre: string;
    valor: number;
  };
  orden: number;
  fecha: string;
  id_solicitud?: string | null;
  id_requerimiento?: string | null;

  id_caja: string | null;

  id_comprobante: string | null;
  comprobante: {
    nombre: string;
    abreviatura: string;
    es_igv: boolean;
  };

  serie: string;
  numero: string;

  id_proveedor: string | null;
  proveedor: {
    ruc: string;
    razon_social: string;
  };

  id_moneda: string | null;
  moneda: {
    nombre: string;
    valor: number;
  };

  tipo_cambio: number;
  total: number;
  total_igv: number;
  tasa_detraccion: number;
  total_detraccion: number;
  tasa_retencion: number;
  total_retencion: number;
  a_pagar: number;
  glosa: string;
  id_gastos_n1: string | null;
  gastos_n1: {
    codigo: string;
    descripcion: string;
  };
  id_gastos_n2: string | null;
  gastos_n2: {
    codigo: string;
    descripcion: string;
  };
  id_gastos_n3: string | null;
  gastos_n3: {
    codigo: string;
    descripcion: string;
  };
}

export interface QueryParamsBuscarCajas {
  id_caja_chica?: string | null;
  id_caja_egresos?: string | null;
  id_requerimiento?: string | null;
  id_solicitud?: string | null;
}
export interface BuscarParamsCajaChica {
  skip_pagination: number;
  take_tamanio: number;
  texto: string;
  fecha_desde: string;
  fecha_hasta: string;
  id_estado: string;
  id_tipo_caja: string;
  cajas_por_rembolsar: boolean;
}
export interface BuscarParamsCaja {
  skip_pagination: number;
  take_tamanio: number;
  texto: string;
  fecha_desde: string;
  fecha_hasta: string;
  id_estado: string;
  id_tipo_caja: string;
  cajas_por_rembolsar: boolean;
}

export type CajaChicaValidacion = 'id_tipo_gasto' | 'id_sede' | 'id_empresa' | 'id_forma_pago' | 'id_usuario';
export type CajaEgresosValidacion =
  | 'id_tipo_gasto'
  | 'id_sede'
  | 'id_empresa'
  | 'id_banco'
  | 'id_moneda'
  | 'id_forma_pago'
  | 'id_usuario'
  | 'id_proveedor'
  | 'fecha_pago'
  | 'numero_cuenta'
  | 'numero_operacion';
