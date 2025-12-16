import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type Venta from "../../entities/Venta";
import VentaService from "../../services/VentaService";
import { useUser } from "../../context/UserContext";
import "./ClienteCompras.css";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaWhatsapp } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const ClienteCompras = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const { user } = useUser();
  const url = import.meta.env.VITE_API_URL;
  const ventaService = new VentaService();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentas = async () => {
      if (!user || !user.id) return;

      try {
        const ventasData = await ventaService.getVentasPorUsuario(
          url + "venta",
          user.id
        );
        setVentas(ventasData);
      } catch (error) {
        console.error("Error al obtener las compras del cliente:", error);
      }
    };

    fetchVentas();
  }, [user]);

  const verDetalle = (ventaId: number) => {
    navigate(`/detalleVentaCliente/${ventaId}`);
  };

  return (
    <div className="cliente-compras-container">
      <table className="cliente-compras-table">
        <thead>
          <tr>
            <th>Nro venta</th>
            <th>Fecha</th>
            <th>Forma de pago</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Ver detalle</th>
            <th>Arrepentimiento</th>

          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td data-label="Nro venta">{venta.id}</td>
              <td data-label="Fecha">{new Date(venta.fecha).toLocaleDateString()}</td>
              <td data-label="Forma de pago">{venta.formaPago}</td>
              <td data-label="Total">${venta.total.toFixed(2)}</td>
              <td data-label="Estado"
                className={
                  venta.estadoVenta === "CONCLUIDO"
                    ? "estado-concluido"
                    : "estado-pendiente"
                }
              >
                {venta.estadoVenta}
              </td>
              <td data-label="Ver detalle">
                <FontAwesomeIcon
                  icon={faEye}
                  className="icono-ver-detalle"
                  onClick={() => verDetalle(venta.id!)}
                  style={{ cursor: "pointer", color: "#4b3a8f" }}
                  title="Ver detalle"
                />
              </td>
              <td data-label="Arrepentimiento">
                {venta.estadoVenta === "PENDIENTE" && (
                  <a
                    href={`https://wa.me/5492612067510?text=Hola,%20quiero%20dar%20de%20baja%20el%20pedido%20con%20ID%20${venta.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-arrepentimiento"
                  >
                    <MdCancel className="icono-arrepentimiento" />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      <div className="whatsapp-flotante">
        <a
          href="https://wa.me/5492617492618"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Whatsapp"
        >
          <FaWhatsapp />
        </a>
      </div>
    </div>
  );
};

export default ClienteCompras;
