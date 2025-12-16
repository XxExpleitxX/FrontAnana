export type Provincia =
    | "BUENOS_AIRES"
    | "CATAMARCA"
    | "CHACO"
    | "CHUBUT"
    | "CIUDAD_AUTONOMA_BUENOS_AIRES"
    | "CORDOBA"
    | "CORRIENTES"
    | "ENTRE_RIOS"
    | "FORMOSA"
    | "JUJUY"
    | "LA_PAMPA"
    | "LA_RIOJA"
    | "MENDOZA"
    | "MISIONES"
    | "NEUQUEN"
    | "RIO_NEGRO"
    | "SALTA"
    | "SAN_JUAN"
    | "SAN_LUIS"
    | "SANTA_CRUZ"
    | "SANTA_FE"
    | "SANTIAGO_DEL_ESTERO"
    | "TIERRA_DEL_FUEGO"
    | "TUCUMAN";

export const PROVINCIAS: { key: Provincia; nombre: string; code: number }[] = [
    { key: "BUENOS_AIRES", nombre: "Buenos Aires", code: 1 },
    { key: "CATAMARCA", nombre: "Catamarca", code: 2 },
    { key: "CHACO", nombre: "Chaco", code: 3 },
    { key: "CHUBUT", nombre: "Chubut", code: 4 },
    { key: "CIUDAD_AUTONOMA_BUENOS_AIRES", nombre: "Ciudad Autónoma de Buenos Aires", code: 5 },
    { key: "CORDOBA", nombre: "Córdoba", code: 6 },
    { key: "CORRIENTES", nombre: "Corrientes", code: 7 },
    { key: "ENTRE_RIOS", nombre: "Entre Ríos", code: 8 },
    { key: "FORMOSA", nombre: "Formosa", code: 9 },
    { key: "JUJUY", nombre: "Jujuy", code: 10 },
    { key: "LA_PAMPA", nombre: "La Pampa", code: 11 },
    { key: "LA_RIOJA", nombre: "La Rioja", code: 12 },
    { key: "MENDOZA", nombre: "Mendoza", code: 13 },
    { key: "MISIONES", nombre: "Misiones", code: 14 },
    { key: "NEUQUEN", nombre: "Neuquén", code: 15 },
    { key: "RIO_NEGRO", nombre: "Río Negro", code: 16 },
    { key: "SALTA", nombre: "Salta", code: 17 },
    { key: "SAN_JUAN", nombre: "San Juan", code: 18 },
    { key: "SAN_LUIS", nombre: "San Luis", code: 19 },
    { key: "SANTA_CRUZ", nombre: "Santa Cruz", code: 20 },
    { key: "SANTA_FE", nombre: "Santa Fe", code: 21 },
    { key: "SANTIAGO_DEL_ESTERO", nombre: "Santiago del Estero", code: 22 },
    { key: "TIERRA_DEL_FUEGO", nombre: "Tierra del Fuego, Antártida e Islas del Atlántico Sur", code: 23 },
    { key: "TUCUMAN", nombre: "Tucumán", code: 24 },
];
