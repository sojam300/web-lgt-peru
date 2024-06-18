import { Proveedor } from './proveedor';

export interface PlanillaMovilidad {
  id: string;
  id_estado: string;
  estado: {
    nombre: string;
    valor: number;
    indicador?: string;
  };
  codigo: string;
  id_proveedor: string;
  proveedor: Proveedor;
  fecha_emicion: string;
  usuario: { id: string; correo: string; nombres: string; apellidos: string };
  fecha_creacion: string;
  fecha_edicion: string;
  planilla_movilidad_detalle: PlanillaMovilidadDetalle[];
}

export interface PlanillaMovilidadDetalle {
  id?: string;
  id_planilla_movilidad?: string;
  fecha_gasto: string;
  lugar_origen: string;
  lugar_destino: string;
  motivo: string;
  monto: number;
}
