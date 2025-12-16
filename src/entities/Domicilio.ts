import type { Localidad } from "./enums/Localidad";
import type { Provincia } from "./enums/Provincia";

export default class Domicilio {
    id: number | null = null;
    calle: string = "";
    numero: string = "";
    localidad: Localidad = "CAPITAL"; // valor por defecto válido
    provincia: Provincia = "MENDOZA"; // valor por defecto válido
}