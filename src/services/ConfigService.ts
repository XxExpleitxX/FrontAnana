import axios from "axios";

export default class ConfigService {

    async getDescuento(url: string): Promise<number> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error al obtener el descuento global:", error);
      throw new Error("No se pudo obtener el descuento global");
    }
  }

  async updateDescuento(url: string, porcentaje: number): Promise<void> {
    try {
      await axios.put(url, { porcentaje: porcentaje });
    } catch (error) {
      console.error("Error al actualizar el descuento global:", error);
      throw new Error("No se pudo actualizar el descuento global");
    }
  }
}
