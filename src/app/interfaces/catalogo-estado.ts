export interface CatalogoEstado {
  id: string;
  codigo: number;
  valor: number;
  nombre: string;
  existe?: boolean;
  indicador: string | null;
}
