export interface Comprobante {
  id: string;
  id_estado: string;
  estado: { nombre: string; valor: number };

  nombre: string;
  abreviatura: string;
  es_igv: boolean;

  fecha_creacion: string;
  fecha_edicion: string;
  eliminado: boolean;
}

export interface ComprobanteSelect {
  id: string | null;
  nombre: string;
  abreviatura: string;
}
