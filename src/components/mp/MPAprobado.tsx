import { useNavigate } from "react-router-dom";
import "./estadoPago.css"

const PagoAprobado = () => {
  const navigate = useNavigate();

  return (
    <div className="estado-container">
      <h1 className="estado-titulo" style={{ color: "#16a34a" }}>
        ¡Pago aprobado!
      </h1>
      <p className="estado-texto">
        ¡Gracias por tu compra! Tu pago fue aprobado con éxito.
      </p>
      <button
        onClick={() => navigate("/misCompras")}
        className="estado-btn green"
      >
        Ir a mis compras
      </button>
    </div>
  );
};

export default PagoAprobado;
