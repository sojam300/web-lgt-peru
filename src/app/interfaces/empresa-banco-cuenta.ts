import { CatalogoEstado } from './catalogo-estado';

export interface EmpresaBancoCuentaDto {
  id: string | null;
  nombre: string | null;
  numero_cuenta: string;
  id_empresa: string;
  empresas: { id: string; nombre: string; direccion: string };
  id_banco: string;
  banco: { nombre: string };
  id_moneda: string;
  moneda: CatalogoEstado;
  fecha_creacion: string;
  fecha_edicion: string;
  eliminado: boolean;
}
