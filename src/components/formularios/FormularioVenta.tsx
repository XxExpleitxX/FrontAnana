import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import VentaService from "../../services/VentaService";
import DetalleVentaService from "../../services/DetalleVentaService";
import type { DetalleVenta } from "../../entities/DetalleVenta";
import Venta from "../../entities/Venta";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useUser } from "../../context/UserContext";
import UserService from "../../services/UserService";
import "./FormularioVenta.css";
import { FaTrash } from "react-icons/fa";
import type { FormaPago } from "../../entities/enums/FormaPago";

const FormularioVenta = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const { idVenta = "0" } = useParams();
  const ventaId = idVenta ? parseInt(idVenta, 10) : 0;
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [ventaObjeto, setVentaObjeto] = useState<Venta>({
    ...new Venta(),
    estadoVenta: "PENDIENTE",
    fecha: new Date("2025-01-01"),
    detalleVentas: [],
  });

  const [txtValidacion, setTxtValidacion] = useState<string>("");
  const ventaService = new VentaService();
  const detalleVentaService = new DetalleVentaService();
  const userService = new UserService();
  const [detalleAEliminar, setDetalleAEliminar] = useState<DetalleVenta | null>(
    null
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!isLoading && user) {
      getVenta();
    }
  }, [isLoading, user, location.search]);

  useEffect(() => {
    const totalCalculado = (ventaObjeto.detalleVentas || []).reduce(
      (acc, detalle) => {
        const subtotal =
          detalle.cantidad *
          (detalle.precioAplicado ?? detalle.producto?.precio ?? 0);
        return acc + subtotal;
      },
      0
    );

    setVentaObjeto((prevVenta) => ({
      ...prevVenta,
      total: totalCalculado + (prevVenta.envio || 0), // Sumamos el envío
    }));
  }, [ventaObjeto.detalleVentas, ventaObjeto.envio]); // Ahora también se recalcula cuando cambia el envío

  const getVenta = async () => {
    if (ventaId > 0) {
      try {
        const ventaSelect = await ventaService.get(url + "venta", ventaId);
        if (ventaSelect) {
          const detVentaData = await detalleVentaService.findAllByVentaId(
            url + "detalleVenta",
            ventaId
          );

          // Asegurar estructura consistente
          const ventaActualizada = {
            ...ventaSelect,
            detalleVentas: Array.isArray(detVentaData)
              ? detVentaData
              : [detVentaData],
            envio: ventaSelect.envio || 0, // Valor por defecto para envío
            fecha: ventaSelect.fecha ? new Date(ventaSelect.fecha) : new Date(),
            total: ventaSelect.total || 0,
          };

          setVentaObjeto(ventaActualizada);
        } else {
          setTxtValidacion("No se encontró la venta con el ID proporcionado.");
        }
      } catch (error) {
        setTxtValidacion("Error al obtener los datos de la venta.");
        console.error(error);
      }
    } else {
      // Resetear a valores por defecto para nueva venta
      const fechaHoy = new Date();
      fechaHoy.setHours(0, 0, 0, 0);

      setVentaObjeto({
        ...new Venta(),
        fecha: fechaHoy,
        detalleVentas: [],
        envio: 0,
        total: 0,
      });
    }
  };

  const abrirModalEliminar = (detalle: DetalleVenta) => {
    setDetalleAEliminar(detalle);
    setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setDetalleAEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (detalleAEliminar) {
      try {
        await detalleVentaService.delete(
          url + "detalleVenta",
          detalleAEliminar.id!
        );

        await getVenta();
        cerrarModal();
      } catch (error) {
        console.error("Error al eliminar el detalle:", error);
      }
    }
  };

  const save = async () => {
    if (!user) {
      setTxtValidacion("No hay usuario autenticado.");
      return;
    }

    ventaObjeto.user = await userService.get(url + "user", user.id);

    if (ventaObjeto.total <= 0) {
      setTxtValidacion("El total de la venta debe ser mayor que cero.");
      return;
    }

    if ((ventaObjeto.detalleVentas?.length ?? 0) === 0) {
      setTxtValidacion("La venta debe tener al menos un detalle.");
      return;
    }

    try {
      let result;

      const { detalleVentas, ...ventaSinDetalles } = ventaObjeto;
      console.log("Forma de pago de la venta:", ventaSinDetalles.formaPago);
      console.log("Observaciones de la venta:", ventaSinDetalles.observaciones);

      if (ventaId > 0) {
        result = await ventaService.put(
          url + "venta",
          ventaId,
          ventaSinDetalles
        );
      } else {
        result = await ventaService.post(url + "venta", ventaSinDetalles);
      }

      if (result) {
        navigate("/grillaPedidos");
      } else {
        setTxtValidacion("No se pudo guardar la venta. Inténtalo de nuevo.");
      }
    } catch (error) {
      setTxtValidacion("Error al guardar la venta.");
      console.error(error);
    }
  };

  const handleAgregarProducto = async () => {
    try {
      if (!user) {
        setTxtValidacion("No hay usuario autenticado.");
        return;
      }
      setIsLoadingSave(true);
      if (ventaId === 0) {
        const ventaParaGuardar = {
          ...ventaObjeto,
          user: await userService.get(url + "user", user?.id || 0),
          detalleVentas: [], // Asegurar que se envía como array vacío
        };

        console.log("Venta para guardar:", ventaParaGuardar);

        const nuevaVenta = await ventaService.post(
          url + "venta",
          ventaParaGuardar
        );

        if (nuevaVenta) {
          // Asegurar que la respuesta tenga detalleVenta como array
          const ventaCompleta = {
            ...nuevaVenta,
            detalleVentas: nuevaVenta.detalleVentas || [],
          };
          setVentaObjeto(ventaCompleta);
          navigate(`/formDetalleVenta/${ventaCompleta.id}/0`);
        }
      } else {
        navigate(`/formDetalleVenta/${ventaId}/0`);
      }
    } catch (error) {
      console.error("Error al crear venta:", error);
      setTxtValidacion("Error al crear la venta: " + (error as Error).message);
    }
  };

  return (
    <>
      <Form className="formulario-contenedor">
        <h3 className="titulo-venta">Formulario de Venta</h3>
        <Row>
          <Col md={3}>
            <button
              className="btn-prod"
              onClick={handleAgregarProducto}
              disabled={isLoadingSave}
            >
              {isLoadingSave ? "Cargando..." : "Agregar producto"}
            </button>
          </Col>
          <Col md={3}>
            <FormGroup>
              <FormLabel className="text-center">Fecha venta</FormLabel>
              <DatePicker
                id="txtFecha"
                selected={
                  ventaObjeto.fecha
                    ? new Date(ventaObjeto.fecha)
                    : new Date("2024-01-01")
                }
                onChange={(date) =>
                  setVentaObjeto({
                    ...ventaObjeto,
                    fecha: date ?? new Date("2024-01-01"),
                  })
                }
                dateFormat="yyyy-MM-dd"
                className="form-control"
                disabled={ventaId > 0}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <FormLabel className="text-center">Total venta</FormLabel>
              <FormControl
                type="number"
                id="txtTotalVenta"
                value={ventaObjeto.total.toFixed(2)}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <FormLabel className="text-center">Envio</FormLabel>
              <FormControl
                type="number"
                id="envio"
                placeholder="Ingrese el envío"
                value={ventaObjeto.envio || ""}
                onChange={(e) =>
                  setVentaObjeto({
                    ...ventaObjeto,
                    envio: Number(e.target.value),
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <FormLabel className="text-center">Estado</FormLabel>
              <Form.Select
                value={ventaObjeto.estadoVenta || ""}
                onChange={(e) =>
                  setVentaObjeto({
                    ...ventaObjeto,
                    estadoVenta: e.target.value as "PENDIENTE" | "CONCLUIDO",
                  })
                }
              >
                <option value="">Seleccione estado</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="CONCLUIDO">Concluido</option>
              </Form.Select>
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <FormLabel className="text-center">Forma de Pago</FormLabel>
              <Form.Select
                value={ventaObjeto.formaPago}
                onChange={(e) =>
                  setVentaObjeto({
                    ...ventaObjeto,
                    formaPago: e.target.value as FormaPago,
                  })
                }
              >
                <option value="">Seleccione forma de pago</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="MERCADOPAGO">Mercado Pago</option>
                <option value="QR">QR</option>
                <option value="POSTNET">PostNet</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </Form.Select>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <FormGroup>
              <FormLabel className="text-observaciones">Observaciones</FormLabel>
              <FormControl
                as="textarea"
                id="txtObservaciones"
                rows={6}
                value={ventaObjeto.observaciones || ""}
                onChange={(e) =>
                  setVentaObjeto({
                    ...ventaObjeto,
                    observaciones: e.target.value,
                  })
                }
                className="textarea-observaciones"
              />
            </FormGroup>
          </Col>

        </Row>
        <div className="contenedor-tabla">
          <Table className="Tabla-detalle">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Producto</th>
                <th>Subtotal</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {ventaObjeto.detalleVentas &&
                ventaObjeto.detalleVentas.length > 0 ? (
                ventaObjeto.detalleVentas.map(
                  (detalle: DetalleVenta, index) => {
                    const subtotal =
                      detalle.cantidad *
                      (detalle.precioAplicado ?? detalle.producto?.precio ?? 0);
                    return (
                      <tr key={index}>
                        <td>{detalle.cantidad}</td>
                        <td>{detalle.producto.denominacion}</td>
                        <td>${subtotal.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-eliminar-us"
                            onClick={() => abrirModalEliminar(detalle)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan={5}>No hay detalles de venta.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="mb-12">
          <p style={{ color: "red" }}>{txtValidacion}</p>
        </div>

        <Row className="d-flex justify-content-center">
          <Col md={6} className="d-flex justify-content-center">
            <Button onClick={save}>Guardar</Button>
          </Col>
          <Col md={6} className="d-flex justify-content-center">
            <Button onClick={() => navigate("/grillaPedidos")}>Volver</Button>
          </Col>
        </Row>
      </Form>

      <Modal
        show={modalIsOpen}
        onHide={cerrarModal}
        centered
        className="modal-confirmacion-eliminacion"
        backdropClassName="modal-backdrop-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar el detalle de venta del producto{" "}
          <strong>{detalleAEliminar?.producto?.denominacion}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FormularioVenta;
