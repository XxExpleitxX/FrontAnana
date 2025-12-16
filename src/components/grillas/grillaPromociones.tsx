import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import "./grillaPromociones.css";
import Promocion from "../../entities/Promocion";
import PromocionService from "../../services/PromocionService";
import ConfigService from "../../services/ConfigService";

const GrillaPromociones = () => {
  const [showModal, setShowModal] = useState(false);
  const [promoAEliminar, setPromoAEliminar] = useState<Promocion | null>(null);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [showDescuentoModal, setShowDescuentoModal] = useState(false);
  const [descuentoGlobal, setDescuentoGlobal] = useState<number>(0);

  const url = import.meta.env.VITE_API_URL;
  const promocionService = new PromocionService();
  const configService = new ConfigService();

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await promocionService.getAll(url + "promocion");

        const promocionesConFechas = response.map((p) => ({
          ...p,
          fechaInicio: new Date(p.fechaInicio),
          fechaFin: new Date(p.fechaFin),
        }));

        setPromociones(promocionesConFechas);
        console.log("Promociones cargadas:", promociones);
      } catch (error) {
        console.error("Error al obtener promociones:", error);
      }
    };

    const fetchDescuento = async () => {
      try {
        const response = await configService.getDescuento(
          url + "config/discount"
        );
        setDescuentoGlobal(response);
      } catch (error) {
        console.error("Error al obtener descuento global:", error);
      }
    };

    fetchPromociones();
    fetchDescuento();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guardarDescuento = async () => {
    try {
      await configService.updateDescuento(url + "config/discount", descuentoGlobal);
      setShowDescuentoModal(false);
    } catch (error) {
      console.error("Error al actualizar el descuento:", error);
    }
  };

  const confirmarEliminacion = (promo: Promocion) => {
    setPromoAEliminar(promo);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (promoAEliminar && promoAEliminar.id !== null) {
      promocionService
        .delete(url + "promocion", promoAEliminar.id)
        .then(() => {
          setPromociones(promociones.filter((p) => p.id !== promoAEliminar.id));
        })
        .catch((error) => {
          console.error("Error al eliminar la promoción:", error);
        });
    }
    setShowModal(false);
    setPromoAEliminar(null);
  };

  return (
    <div className="tabla-promos-container">
      <div className="barra-superior-promos">
        <button
          className="btn-agregar-promo"
          onClick={() => (window.location.href = "/formPromocion/0")}
        >
          + Agregar Promoción
        </button>

        <button
          className="btn-editar-descuento"
          onClick={() => setShowDescuentoModal(true)}
        >
          Editar Descuento Global ({descuentoGlobal}%)
        </button>
      </div>

      <table className="tabla-promos">
        <thead>
          <tr>
            <th>Denominación</th>
            <th>Productos en la promoción</th>
            <th>Descripción</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Precio Promocional</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {promociones.map((promo) => {
            const vencida = promo.fechaFin < new Date();
            return (
              <tr key={promo.id} className={vencida ? "promo-vencida" : ""}>
                <td>{promo.denominacion}</td>
                <td>
                  {promo.detallePromociones?.length > 0
                    ? promo.detallePromociones
                        .map((d) => d.producto?.denominacion)
                        .join(", ")
                    : "Sin productos"}
                </td>
                <td>{promo.descripcion}</td>
                <td>{promo.fechaInicio.toLocaleDateString()}</td>
                <td>{promo.fechaFin.toLocaleDateString()}</td>
                <td>{promo.precioPromocional}</td>
                <td>
                  <button
                    className="btn-eliminar-promo"
                    onClick={() => confirmarEliminacion(promo)}
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
        backdropClassName="modal-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar la promoción{" "}
          <strong>{promoAEliminar?.denominacion}</strong>?
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

      {/* Modal para editar descuento global */}
      <Modal
        show={showDescuentoModal}
        onHide={() => setShowDescuentoModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Descuento Global</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="inputDescuento">
              <Form.Label>Porcentaje de descuento (%)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={100}
                value={descuentoGlobal}
                onChange={(e) => setDescuentoGlobal(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary-mod" onClick={() => setShowDescuentoModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary-mod" onClick={guardarDescuento}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GrillaPromociones;
