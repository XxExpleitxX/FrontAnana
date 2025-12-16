import axios from "axios";

export default class CierreCajaService {

  private crearYDescargarArchivo(data: BlobPart, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nombreArchivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async descargarCierreCajaEntreFechas(
    path: string,
    desde: string,
    hasta: string
  ): Promise<void> {
    try {
      const response = await axios.get(`${path}/exportar`, {
        params: { desde, hasta },
        responseType: "blob",
      });

      this.crearYDescargarArchivo(
        response.data,
        `cierre_caja_${desde}_a_${hasta}.xlsx`
      );
    } catch (error) {
      console.error("❌ Error al descargar cierre entre fechas:", error);
    }
  }

  async descargarCierreCajaHoy(path: string): Promise<void> {
    try {
      const response = await axios.get(`${path}/exportar-hoy`, {
        responseType: "blob",
      });

      this.crearYDescargarArchivo(response.data, "cierre_caja_hoy.xlsx");
    } catch (error) {
      console.error("❌ Error al descargar cierre de hoy:", error);
    }
  }

  async descargarInformeDiarioDetalle(
    path: string,
    fecha: string
  ): Promise<void> {
    try {
      const response = await axios.get(`${path}/informe-diario-detalle`, {
        params: { fecha },
        responseType: "blob",
      });

      this.crearYDescargarArchivo(
        response.data,
        `informe_diario_detalle_${fecha}.xlsx`
      );
    } catch (error) {
      console.error("❌ Error al descargar informe diario detalle:", error);
    }
  }

  async descargarInformeMensualDetalle(
    path: string,
    año: number,
    mes: number
  ): Promise<void> {
    try {
      const response = await axios.get(`${path}/informe-mensual-detalle`, {
        params: { año, mes },
        responseType: "blob",
      });

      this.crearYDescargarArchivo(
        response.data,
        `informe_mensual_detalle_${año}_${mes}.xlsx`
      );
    } catch (error) {
      console.error("❌ Error al descargar informe mensual detalle:", error);
    }
  }

  async descargarInformeDiarioHoy(path: string): Promise<void> {
    try {
      const response = await axios.get(`${path}/informe-diario-hoy`, {
        responseType: "blob",
      });

      this.crearYDescargarArchivo(response.data, "informe_diario_hoy.xlsx");
    } catch (error) {
      console.error("❌ Error al descargar informe diario de hoy:", error);
    }
  }

  async descargarInformeMensualActual(path: string): Promise<void> {
    try {
      const response = await axios.get(`${path}/informe-mensual-actual`, {
        responseType: "blob",
      });

      const hoy = new Date();
      const nombreArchivo = `informe_mensual_${hoy.getFullYear()}_${hoy.getMonth() + 1}.xlsx`;

      this.crearYDescargarArchivo(response.data, nombreArchivo);
    } catch (error) {
      console.error("❌ Error al descargar informe mensual actual:", error);
    }
  }

}