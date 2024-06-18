export interface Liquidacion {
  id: string;
  es_caja_chica: boolean;
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
  };
  id_tipo_detalle_requerimiento?: string | null;
  orden: number;
  fecha: string;
  id_requerimiento?: string | null;
  id_solicitud?: string | null;
  id_caja?: string | null;
  caja?: {
    codigo: string;
  };
  id_comprobante: string;
  comprobante: {
    nombre: string;
    abreviatura: string;
    es_igv: string;
  };
  serie: string;
  numero: string;
  id_proveedor: string;
  proveedor: {
    ruc: string;
    razon_social: string;
    direccion: string;
  };
  id_moneda: string;
  moneda: {
    nombre: string;
    valor: number;
  };
  tipo_cambio: number;
  tipo_cambio_format: string;
  total: number;
  total_format: string;
  total_igv: number;
  total_igv_format: string;
  tasa_detraccion: number;
  tasa_detraccion_format: string;
  total_detraccion: number;
  total_detraccion_format: string;
  tasa_retencion: number;
  tasa_retencion_format: string;
  total_retencion: number;
  total_retencion_format: string;
  a_pagar: number;
  a_pagar_format: string;
  glosa: string;
  id_gastos_n1: string;
  gastos_n1: {
    nombre: string;
    nivel_grupo: number;
  };
  id_gastos_n2: string;
  gastos_n2: {
    nombre: string;
    nivel_grupo: number;
  };
  id_gastos_n3: string;
  gastos_n3: {
    nombre: string;
    nivel_grupo: number;
  };
  id_usuario_creacion: string;
  usuario_creacion: {
    nombres: string;
    apellidos: string;
  };
  fecha_creacion: string;
  id_usuario_edicion: string;
  usuario_edicion: {
    nombres: string;
    apellidos: string;
  };
  fecha_edicion: string;
  archivos: { contenido: any; name: string; tipo: string; formato: string }[];
}
export type LiquidacionValidacion =
  // | 'id_tipo_detalle_requerimiento'
  | 'fecha'
  | 'id_comprobante'
  | 'serie'
  | 'numero'
  | 'id_proveedor'
  | 'id_moneda'
  | 'total_format'
  | 'id_gastos_n1'
  | 'id_gastos_n2'
  | 'id_gastos_n3';
