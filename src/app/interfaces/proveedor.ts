export interface Proveedor {
  id?: string;
  id_estado: string;
  estado: {
    nombre: string;
  };
  id_tipo: string;
  tipo: {
    nombre: string;
  };
  ruc: string;
  razon_social: string;
  direccion: string;
}
export interface ProveedorSelect {
  id: string | null;
  ruc: string;
  razon_social: string;
  direccion: string;
}
export interface ProveedorNumeroCuenta {
  id: string;
  id_banco: string;
  id_moneda: string;
  id_proveedor: string;
  numero_cuenta: string;
}
