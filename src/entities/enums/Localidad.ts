export type Localidad =
    | "CAPITAL"
    | "GODOY_CRUZ"
    | "GUAYMALLEN"
    | "LAS_HERAS"
    | "LUJAN_DE_CUYO"
    | "MAIPU"
    | "MENDOZA"
    | "SAN_MARTIN"
    | "SAN_RAFAEL"
    | "TUNUYAN"
    | "TUPUNGATO"
    | "GENERAL_ALVEAR"
    | "JUNIN"
    | "LA_PAZ"
    | "LAVALLE"
    | "MALARGUE"
    | "RIVADAVIA"
    | "SAN_CARLOS"
    | "SANTA_ROSA";

export const LOCALIDADES: { key: Localidad; nombre: string; code: number }[] = [
    { key: "CAPITAL", nombre: "Ciudad de Mendoza", code: 1 },
    { key: "GODOY_CRUZ", nombre: "Godoy Cruz", code: 2 },
    { key: "GUAYMALLEN", nombre: "Guaymallén", code: 3 },
    { key: "LAS_HERAS", nombre: "Las Heras", code: 4 },
    { key: "LUJAN_DE_CUYO", nombre: "Luján de Cuyo", code: 5 },
    { key: "MAIPU", nombre: "Maipú", code: 6 },
    { key: "MENDOZA", nombre: "Mendoza", code: 7 },
    { key: "SAN_MARTIN", nombre: "San Martín", code: 8 },
    { key: "SAN_RAFAEL", nombre: "San Rafael", code: 9 },
    { key: "TUNUYAN", nombre: "Tunuyán", code: 10 },
    { key: "TUPUNGATO", nombre: "Tupungato", code: 11 },
    { key: "GENERAL_ALVEAR", nombre: "General Alvear", code: 12 },
    { key: "JUNIN", nombre: "Junín", code: 13 },
    { key: "LA_PAZ", nombre: "La Paz", code: 14 },
    { key: "LAVALLE", nombre: "Lavalle", code: 15 },
    { key: "MALARGUE", nombre: "Malargüe", code: 16 },
    { key: "RIVADAVIA", nombre: "Rivadavia", code: 17 },
    { key: "SAN_CARLOS", nombre: "San Carlos", code: 18 },
    { key: "SANTA_ROSA", nombre: "Santa Rosa", code: 19 },
];
