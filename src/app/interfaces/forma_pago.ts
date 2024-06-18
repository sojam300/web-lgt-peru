export interface FormaPago {
  id: string | null;
  codigo: string;
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
  descripcion: string;
  fecha_creacion: string;
  fecha_edicion: string;
}
