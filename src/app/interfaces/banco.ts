export interface BancoDto {
  id: string | null;
  nombre: string;
  abreviatura: string;
  fecha_creacion: string;
  fecha_edicion: string;
  eliminado: boolean;
}

export interface BancoSelect {
  id: string;
  nombre: string;
  abreviatura: string;
}
