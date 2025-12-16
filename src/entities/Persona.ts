import Domicilio from "./Domicilio";
import User from "./User";

export default class Persona {
    id: number | null = null;
    nombre: string = "";
    apellido: string = "";
    telefono: string = "";
    email: string = "";
    domicilio: Domicilio = new Domicilio();
    user: User = new User();
}