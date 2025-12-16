import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type Venta from "../../entities/Venta";
import VentaService from "../../services/VentaService";
import "./VerVenta.css";   // 👈 agregamos el CSS

const VerVenta = () => {
    const { idVenta } = useParams();
    const ventaId = idVenta ? parseInt(idVenta) : 0;
    const [venta, setVenta] = useState<Venta | null>(null);
    const navigate = useNavigate();

    const url = import.meta.env.VITE_API_URL;
    const ventaService = new VentaService();

    useEffect(() => {
        if (ventaId) {
            ventaService.get(url + "venta", ventaId)
                .then((data) => setVenta(data))
                .catch((error) => console.error("Error fetching venta:", error));
        }
    }, [ventaId]);

    if (!venta) {
        return <div className="venta-cargando">Cargando venta...</div>;
    }

    return (
        <div className="venta-container">
            <h1 className="venta-title">Detalles de la Venta</h1>
            <div className="venta-card">
                <p><strong>ID:</strong> {venta.id}</p>
                <p><strong>Cliente:</strong> {venta.user?.usuario}</p>
                <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${venta.total}</p>
                <p><strong>Estado:</strong> {venta.estadoVenta}</p>
                <p><strong>Forma de Pago:</strong> {venta.formaPago}</p>
                <p><strong>Envío:</strong> {venta.envio ? "Sí" : "No"}</p>
                <p><strong>Observaciones:</strong> {venta.observaciones || "Ninguna"}</p>
            </div>
            <button className="btn-volver" onClick={() => navigate("/grillaPedidos")}>
                Volver a Ventas
            </button>
        </div>
    );
}

export default VerVenta;
