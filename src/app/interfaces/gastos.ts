export interface Gastos {
  id?: string | null;
  nombre: string;
  nivel_grupo: number;
  fecha_creacion: string;
  fecha_edicion: string;
  eliminado: false;
}

export interface GastosGrupo {
  id: string;
  gasto_hijo: {
    id: string;
    nombre: string;
    nivel_grupo: number;
  };
}
