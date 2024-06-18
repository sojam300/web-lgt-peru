export interface Empresa {
  id: string;
  nombre: string;
  direccion: string;
  fecha_creacion: string;
  fecha_edicion: string;
  eliminado: boolean;
}
export interface EmpresaSelect {
  id: string;
  nombre: string;
}
export interface EmpresaBancoCuentaSelect {
  id: string;
  numero_cuenta: string;
}
