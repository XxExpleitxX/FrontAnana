import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Categoria from "../../entities/Categoria";
import CategoriaService from "../../services/CategoriaService";
import ProductoService from "../../services/ProductoService";
import Producto from "../../entities/Producto";
import "./grillaCategorias.css";

const GrillaCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtroDenominacion, setFiltroDenominacion] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<Categoria | null>(
    null
  );

  const url = import.meta.env.VITE_API_URL;
  const categoriaService = new CategoriaService();
  const productoService = new ProductoService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasData, productosData] = await Promise.all([
          categoriaService.getAll(url + "categoria"),
          productoService.getAll(url + "producto"),
        ]);
        setCategorias(categoriasData);
        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchData();
  }, []);

  const productosPorCategoria = useMemo(() => {
    return productos.reduce<Record<number, number>>((acc, producto) => {
      const categoriaId = producto.categoria?.id;
      if (categoriaId !== undefined && categoriaId !== null) {
        acc[categoriaId] = (acc[categoriaId] || 0) + 1;
      }
      return acc;
    }, {});
  }, [productos]);

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.denominacion
      ?.toLowerCase()
      .includes(filtroDenominacion.toLowerCase())
  );

  const confirmarEliminacion = (categoria: Categoria) => {
    const categoriaId = categoria.id ?? -1;
    if ((productosPorCategoria[categoriaId] ?? 0) > 0) {
      toast.error("No se puede eliminar la categoría porque tiene productos asignados");
      return;
    }
    setCategoriaAEliminar(categoria);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (categoriaAEliminar && categoriaAEliminar.id !== null) {
      const categoriaId = categoriaAEliminar.id;
      if ((productosPorCategoria[categoriaId] ?? 0) > 0) {
        toast.error(
          "No se puede eliminar la categoría porque tiene productos asignados"
        );
        setShowModal(false);
        setCategoriaAEliminar(null);
        return;
      }

      try {
        await categoriaService.delete(url + "categoria", categoriaId);
        setCategorias((prev) => prev.filter((c) => c.id !== categoriaId));
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
      } finally {
        setShowModal(false);
        setCategoriaAEliminar(null);
      }
    }
  };

  return (
    <div className="tabla-categorias-container">
      <div className="barra-superior-categorias">
        <button
          className="btn-agregar-categoria"
          onClick={() => (window.location.href = "/formCategoria/0")}
        >
          + Agregar Categoría
        </button>
        <input
          type="text"
          placeholder="Filtrar por denominación"
          className="input-filtro-categoria"
          value={filtroDenominacion}
          onChange={(e) => setFiltroDenominacion(e.target.value)}
        />
      </div>

      <table className="tabla-categorias">
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Productos asignados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categoriasFiltradas.map((categoria) => {
            const categoriaId = categoria.id ?? -1;
            const cantidadProductos = productosPorCategoria[categoriaId] ?? 0;
            const tieneProductos = cantidadProductos > 0;

            return (
              <tr key={categoria.id ?? categoria.denominacion}>
                <td>{categoria.denominacion}</td>
                <td>{cantidadProductos}</td>
                <td>
                  <button
                    className="btn-accion-categoria"
                    onClick={() =>
                      (window.location.href = `/formCategoria/${categoria.id}`)
                    }
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-accion-categoria btn-eliminar-categoria"
                    onClick={() => confirmarEliminacion(categoria)}
                    disabled={tieneProductos}
                    title={
                      tieneProductos
                        ? "No se puede eliminar una categoría con productos asignados"
                        : undefined
                    }
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
          ¿Está seguro que desea eliminar la categoría {" "}
          <strong>{categoriaAEliminar?.denominacion}</strong>?
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

export default GrillaCategorias;