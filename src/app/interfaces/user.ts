export interface User {
  id?: string;
  tipo: number;
  estado: number;
  correo: string;
  nombres: string;
  apellidos: string;
  password: string;
}

export interface UserSelect {
  id: string;
  nombres: string;
  apellidos: string;
  numero_cuenta: string;
}
export interface LoginUser {
  correo: string;
  password: string;
}
export interface LoginResponse {
  correo: string;
  idusuario: string;
  token: string;
}

export interface AreasByUsuario {
  id: string;
  area: {
    id: string;
    id_estado: string;
    nombre: string;
    fecha_creacion: string;
    fecha_edicion: string;
    eliminado: boolean;
  };
}
export interface UsuariosLista {
  id: string | null;
  id_estado: string | null;
  estado: {
    select: {
      nombre: string;
      valor: string;
    };
  };
  id_tipo: string | null;
  tipo: {
    select: {
      nombre: string;
      valor: string;
    };
  };
  esloggin: boolean;
  correo: string;
  nombres: string;
  apellidos: string;
  eliminado: boolean;
}

export interface AreasByUser {
  area: {
    id: string;
    nombre: string;
  };
}
