import Categoria from "./Categoria";

export default class ProductoConDescuento {
    id: number | null = null;
    denominacion: string = "";
    marca: string = "";
    codigo: string = "";
    imagen: string = "";
    precioOriginal: number = 0;
    precioConDescuento: number = 0;
    stock: number = 0;
    categoria: Categoria = new Categoria();
}
