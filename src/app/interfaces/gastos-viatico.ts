export interface GastosViatico {
  id?: string;
  nombre: string;
  monto: number;
  ciudad: {
    nombre: string;
  };
}
