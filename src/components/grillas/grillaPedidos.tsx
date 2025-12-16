import { useEffect, useState } from "react";
import type Venta from "../../entities/Venta";
import "./GrillaPedidos.css";
import VentaService from "../../services/VentaService";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const GrillaPedidos = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [ventaAEliminar, setVentaAEliminar] = useState<Venta | null>(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  // Modal eliminar por fecha
  const [modalDesde, setModalDesde] = useState("");
  const [modalHasta, setModalHasta] = useState("");

  // Estado para modal visual eliminar por fecha
  const [showModalEliminarPorFecha, setShowModalEliminarPorFecha] =
    useState(false);

  const url = import.meta.env.VITE_API_URL;
  const ventaService = new VentaService();

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const ventasData = await ventaService.getAll(url + "venta");
        setVentas(ventasData);
      } catch (error) {
        console.error("Error al obtener ventas:", error);
      }
    };
    fetchVentas();
  }, []);

  const ventasFiltradas = ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;

    return (!desde || fechaVenta >= desde) && (!hasta || fechaVenta <= hasta);
  });

  const handleDelete = async () => {
    if (ventaAEliminar && ventaAEliminar.id !== null) {
      try {
        await ventaService.delete(url + "venta", ventaAEliminar.id);
        setVentas(ventas.filter((v) => v.id !== ventaAEliminar.id));
      } catch (error) {
        console.error("Error al eliminar la venta:", error);
      } finally {
        setShowModal(false);
        setVentaAEliminar(null);
      }
    }
  };

  const confirmarEliminacion = (venta: Venta) => {
    setVentaAEliminar(venta);
    setShowModal(true);
  };

  return (
    <div className="tabla-ventas-container">
      <div className="barra-superior">
        <button
          className="btn-agregar"
          onClick={() => navigate("/formVenta/0")}
        >
          + Agregar Venta
        </button>
        <label>Desde: </label>
        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          placeholder="Desde"
        />
        <label>Hasta: </label>
        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          placeholder="Hasta"
        />
        {(fechaDesde || fechaHasta) && (
          <button
            className="btn-limpiar-filtro"
            onClick={() => {
              setFechaDesde("");
              setFechaHasta("");
            }}
            style={{ marginLeft: "1rem" }}
          >
            Limpiar filtro
          </button>
        )}
        {/* Botón para abrir modal visual de eliminar pedidos por fecha */}
        <button
          className="btn-eliminar-pedidos"
          onClick={() => setShowModalEliminarPorFecha(true)}
          style={{ marginLeft: "1rem" }}
        >
          Eliminar pedidos
        </button>
      </div>

      <table className="tabla-ventas">
        <thead>
          <tr>
            <th>Nro venta</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Forma de pago</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasFiltradas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.id}</td>
              <td>{venta.user?.usuario}</td>
              <td>{new Date(venta.fecha).toLocaleDateString()}</td>
              <td>{venta.formaPago}</td>
              <td>{venta.total}</td>
              <td
                className={
                  venta.estadoVenta === "CONCLUIDO"
                    ? "estado-concluido"
                    : "estado-pendiente"
                }
              >
                {venta.estadoVenta}
              </td>
              <td>
                <button
                  className="btn-ver-venta"
                  onClick={() => navigate(`/verVenta/${venta.id}`)}
                >
                  <FaEye />
                </button>
                <button
                  className="btn-editar-venta"
                  onClick={() => navigate(`/formVenta/${venta.id}`)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-eliminar-venta"
                  onClick={() => confirmarEliminacion(venta)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal visual para eliminar pedidos por fecha */}
      {showModalEliminarPorFecha && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Seleccione el rango de fechas para eliminar pedidos</h3>

            <div style={{ marginTop: "1rem" }}>
              <label>Fecha desde:</label>
              <input
                type="date"
                value={modalDesde}
                onChange={(e) => setModalDesde(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label>Fecha hasta:</label>
              <input
                type="date"
                value={modalHasta}
                onChange={(e) => setModalHasta(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <button
                className="btn-cancelar"
                onClick={() => setShowModalEliminarPorFecha(false)}
              >
                Cancelar
              </button>

              <button
                className="btn-aceptar"
                onClick={async () => {
                  if (modalDesde && modalHasta) {
                    const confirmar = window.confirm(
                      `¿Estás seguro de que querés eliminar TODAS las ventas entre el ${modalDesde} y el ${modalHasta}?`
                    );

                    if (!confirmar) return;

                    const desde = `${modalDesde}T00:00:00`;
                    const hasta = `${modalHasta}T23:59:59`;

                    const ok = await ventaService.eliminarVentasEntreFechas(
                      `${url}venta`,
                      desde,
                      hasta
                    );

                    if (ok) {
                      alert("✅ Ventas eliminadas correctamente.");
                      const ventasActualizadas = await ventaService.getAll(
                        url + "venta"
                      );
                      setVentas(ventasActualizadas);
                      setFechaDesde("");
                      setFechaHasta("");
                    } else {
                      alert("❌ Ocurrió un error al eliminar las ventas.");
                    }

                    setShowModalEliminarPorFecha(false);
                  } else {
                    alert("⚠️ Por favor completá ambas fechas.");
                  }
                }}
                style={{ marginLeft: "1rem" }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar venta individual */}
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
          ¿Está seguro que desea eliminar la venta nro{" "}
          <strong>{ventaAEliminar?.id}</strong>?
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

export default GrillaPedidos;
