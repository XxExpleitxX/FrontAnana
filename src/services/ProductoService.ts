import axios from "axios";
import Producto from "../entities/Producto";
import BaseService from "./BaseService";
import type ProductoConDescuento from "../entities/ProductoConDescuento";

export default class ProductoService extends BaseService<Producto> {
  // Método para guardar o actualizar producto con imagen
  async saveWithImage(
    path: string,
    producto: Producto,
    imageFile: File | null,
    method: "post" | "put" = "post"
  ): Promise<Producto> {
    const formData = new FormData();

    // Agregar el producto como JSON
    formData.append(
      "producto",
      new Blob([JSON.stringify(producto)], {
        type: "application/json",
      })
    );

    // Agregar la imagen si existe
    if (imageFile) {
      this.validateImageFile(imageFile);
      formData.append("imagenFile", imageFile);
    }

    try {
      const response = await axios[method](`${path}/with-image`, formData);
      return response.data;
    } catch (error) {
      console.error("Error al guardar producto con imagen:", error);
      throw this.handleError(error);
    }
  }

  // Método para subir imagen a un producto existente
  async uploadImage(
    path: string,
    codigo: string,
    file: File
  ): Promise<Producto> {
    this.validateImageFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${path}/${codigo}/imagen`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      throw this.handleError(error);
    }
  }

  // Método para eliminar imagen de un producto
  async removeImage(path: string, codigo: string): Promise<Producto> {
    try {
      const response = await axios.delete(`${path}/${codigo}/imagen`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      throw this.handleError(error);
    }
  }

  // Método para actualizar stock
  async actualizarStock(
    path: string,
    codigo: string,
    cantidad: number
  ): Promise<Producto> {
    try {
      const response = await axios.patch(`${path}/${codigo}/stock`, null, {
        params: { cantidad },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      throw this.handleError(error);
    }
  }

  async getByCodigo(path: string): Promise<Producto> {
    try {
      const response = await axios.get(path);
      return response.data;
    } catch (error) {
      console.error("Error al obtener producto por código:", error);
      throw this.handleError(error);
    }
  }

  async getByDenominacion(path: string): Promise<Producto> {
    try {
      const response = await axios.get(path);
      return response.data;
    } catch (error) {
      console.error("Error al obtener producto por denominación:", error);
      throw this.handleError(error);
    }
  }

  // Validación de archivos de imagen
  validateImageFile(file: File): void {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Solo se permiten imágenes JPEG, PNG o GIF");
    }

    if (file.size > maxSize) {
      throw new Error("La imagen no debe superar los 5MB");
    }
  }

  // Manejo centralizado de errores
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      // Puedes personalizar el mensaje según el código de estado
      return new Error(error.response?.data?.message || error.message);
    }
    return error instanceof Error ? error : new Error("Error desconocido");
  }

  async getProductosConDescuento(
    path: string,
    params: {
      page?: number;
      size?: number;
      busqueda?: string;
      marca?: string;
      categoria?: string;
      orden?: "asc" | "desc";
    } = {}
  ): Promise<ProductoConDescuento[]> {
    try {
      const response = await axios.get(`${path}/con-descuento`, { params });
      // Retornar solo el content (array)
      return response.data.content ?? [];
    } catch (error) {
      console.error("Error al obtener productos con descuento:", error);
      throw this.handleError(error);
    }
  }


  /* async getProductosConDescuento(
    path: string
  ): Promise<ProductoConDescuento[]> {
    try {
      const response = await axios.get(`${path}/con-descuento`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener productos con descuento:", error);
      throw this.handleError(error);
    }
  } */
}
