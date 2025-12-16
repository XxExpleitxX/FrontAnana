import Categoria from "./Categoria";

export default class Producto {
    id: number | null = null;
    denominacion: string = "";
    marca: string = "";
    codigo: string = "";
    imagen: string = "";
    precio: number = 0;
    costo: number = 0;
    porcentaje: number = 0;
    stock: number = 0;
    cantidadVendida: number = 0;
    descripcion: string = "";
    categoria: Categoria = new Categoria();
}