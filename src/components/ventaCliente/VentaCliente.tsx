import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type Venta from "../../entities/Venta";
import type { DetalleVenta } from "../../entities/DetalleVenta";
import VentaService from "../../services/VentaService";
import DetalleVentaService from "../../services/DetalleVentaService";
import "./VentaCliente.css";

const VentaCliente = () => {
    const { idVenta } = useParams<{ idVenta: string }>();
    const navigate = useNavigate();
    const ventaService = new VentaService();
    const detalleService = new DetalleVentaService();
    const url = import.meta.env.VITE_API_URL;

    const [venta, setVenta] = useState<Venta | null>(null);
    const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            if (!idVenta) return;

            try {
                const ventaData = await ventaService.get(`${url}venta`, parseInt(idVenta));
                const detallesData = await detalleService.findAllByVentaId(`${url}detalleVenta`, parseInt(idVenta));
                setVenta(ventaData);
                setDetalles(detallesData);
            } catch (err) {
                setError("No se pudo cargar la información de la venta.");
                console.error(err);
            }
        };

        fetchData();
    }, [idVenta]);

    if (error) {
        return <div className="venta-cliente-container"><p className="error">{error}</p></div>;
    }

    if (!venta) {
        return <div className="venta-cliente-container"><p>Cargando venta...</p></div>;
    }

    return (
        <div className="venta-cliente-container">
            <h2>Detalle de la Venta #{venta.id}</h2>
            <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
            <p><strong>Forma de pago:</strong> {venta.formaPago}</p>
            <p><strong>Estado:</strong> <span className={venta.estadoVenta === "CONCLUIDO" ? "estado-concluido" : "estado-pendiente"}>{venta.estadoVenta}</span></p>
            <p><strong>Envío:</strong> ${venta.envio?.toFixed(2)}</p>
            <p><strong>Total:</strong> ${venta.total?.toFixed(2)}</p>
            <p><strong>Observaciones del pedido:</strong> {venta.observaciones}</p>

            <h3>Productos:</h3>
            <table className="detalle-venta-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {detalles.map((d) => (
                        <tr key={d.id}>
                            <td>{d.producto?.denominacion}</td>
                            <td>{d.cantidad}</td>
                            <td>${d.precioAplicado?.toFixed(2)}</td>
                            <td>${(d.cantidad * (d.precioAplicado ?? 0)).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="volver-container">
                <button className="btn-volver" onClick={() => navigate(-1)}>
                    Volver
                </button>
            </div>
        </div>
    );
};

export default VentaCliente;
