export interface Sede {
  id: string | null;
  estado: { nombre: string; valor: number };
  id_estado: string;
  id_tipo: string;
  tipo: { nombre: string; valor: number };
  nombre: string;
  abreviatura: string;
  monto_maximo: string;
  id_ciudad: string | null;
  ciudad: {
    nombre: string;
  };
  fecha_creacion: string;
  fecha_edicion: string;
}

export interface SedeSelect {
  id: string;
  nombre: string;
  abreviatura: string;
  monto_maximo: string;
}
