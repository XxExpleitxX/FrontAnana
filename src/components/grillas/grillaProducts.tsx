import { useEffect, useState } from "react";
import "./grillas.css";
import Producto from "../../entities/Producto";
import ProductoService from "../../services/ProductoService";
import { FaEdit, FaShoppingBasket, FaTrash } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { useCarrito } from "../../hooks/useCarrito";
import { toast } from "react-toastify";

const GrillaProducts = () => {
  const { addCarrito } = useCarrito();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(
    null
  );
  const [filtroDenominacion, setFiltroDenominacion] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroCodigo, setFiltroCodigo] =useState ("");

  const url = import.meta.env.VITE_API_URL;
  const productoService = new ProductoService();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosData = await productoService.getAll(url + "producto");
        setProductos(productosData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.denominacion
        .toLowerCase()
        .includes(filtroDenominacion.toLowerCase()) &&
      producto.marca.toLowerCase().includes(filtroMarca.toLowerCase()) &&
      producto.codigo.toLowerCase().includes(filtroCodigo.toLowerCase())
  );

  const handleDelete = async () => {
    if (productoAEliminar && productoAEliminar.id !== null) {
      try {
        await productoService.delete(url + "producto", productoAEliminar.id);
        setProductos(productos.filter((p) => p.id !== productoAEliminar.id));
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      } finally {
        setShowModal(false);
        setProductoAEliminar(null);
      }
    }
  };

  const confirmarEliminacion = (producto: Producto) => {
    setProductoAEliminar(producto);
    setShowModal(true);
  };

  const handleAddCarrito = (producto: Producto) => {
    addCarrito(producto);
    toast.success("Producto agregado al carrito");
  };

  return (
    <div className="tabla-productos-container">
      <div className="barra-superior">
        <button
          className="btn-agregar"
          onClick={() => (window.location.href = "/formProducto/0")}
        >
          + Agregar Producto
        </button>
        <button
          className="btn-stock"
          onClick={() => (window.location.href = "/stock")}
        >
          Actualizar Stock
        </button>
        <input
          type="text"
          placeholder="Filtrar por denominación"
          className="input-filtro"
          value={filtroDenominacion}
          onChange={(e) => setFiltroDenominacion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por marca"
          className="input-filtro"
          value={filtroMarca}
          onChange={(e) => setFiltroMarca(e.target.value)}
        />
        <input
        type="text"
        placeholder="Filtrar por código"
        className="input-filtro"
        value={filtroCodigo}
        onChange={(e)=> setFiltroCodigo(e.target.value)}
        />
      </div>

      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Marca</th>
            <th>Stock</th>
            <th>Vendidos</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.denominacion}</td>
              <td>{producto.marca}</td>
              <td>{producto.stock}</td>
              <td>{producto.cantidadVendida}</td>
              <td>${producto.precio.toFixed(2)}</td>
              <td>
                <button
                  className="btn-carrito"
                  onClick={() => handleAddCarrito(producto)}
                >
                  <FaShoppingBasket />
                </button>
                <button
                  className="btn-editar"
                  onClick={() =>
                    (window.location.href = `/formProducto/${producto.id}`)
                  }
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => confirmarEliminacion(producto)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="modal-confirmacion-eliminacion"
        backdropClassName="modal-backdrop-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar el producto{" "}
          <strong>{productoAEliminar?.denominacion}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GrillaProducts;
