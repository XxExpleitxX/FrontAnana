import { useNavigate } from "react-router-dom";
import "./estadoPago.css"

const MPRechazado = () => {
  const navigate = useNavigate();

  const whatsappNumber = "5492617492618"; // tu número de WhatsApp con código país sin "+" ni espacios
  const mensajeWhatsapp = encodeURIComponent(
    "Hola, mi pago fue rechazado. ¿Podrían ayudarme con la situación?"
  );

  const abrirWhatsapp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${mensajeWhatsapp}`, "_blank");
  };

  return (
    <div className="estado-container">
  <h1 className="estado-titulo" style={{ color: "#dc2626" }}>Pago Rechazado</h1>
  <p className="estado-texto">
    Tu pago ha sido rechazado. Por favor, intenta nuevamente o comunícate con nosotros.
  </p>
  <div className="estado-botones">
    <button onClick={() => navigate("/misCompras")} className="estado-btn red">
      Ir a mis compras
    </button>
    <button onClick={abrirWhatsapp} className="estado-btn green" aria-label="Contactar por WhatsApp">
       <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.52 3.48A11.935 11.935 0 0012 0C5.373 0 0 5.373 0 12c0 2.115.553 4.105 1.52 5.86L0 24l6.294-1.622A11.963 11.963 0 0012 24c6.627 0 12-5.373 12-12 0-3.22-1.256-6.236-3.48-8.52zM12 22c-1.988 0-3.84-.596-5.393-1.615l-.382-.232-3.734.963.995-3.646-.246-.386A9.93 9.93 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.43-7.412l-1.49-.704c-.197-.092-.456-.13-.685-.042-.326.12-1.215.627-1.49.755-.276.128-.477.184-.695-.13s-.796-.925-.976-1.112c-.18-.188-.364-.21-.679-.07s-1.248.458-2.38-1.453c-.88-1.24-1.47-1.103-2.05-1.125-.528-.019-.95-.022-1.292-.022-.332 0-.87.126-1.326.6-.456.474-1.74 1.7-1.74 4.15s1.783 4.814 2.033 5.144c.25.33 3.516 5.369 8.52 3.765 2.557-1.004 3.596-4.04 3.594-4.123-.002-.082-.183-.13-.38-.222z" />
          </svg>
      WhatsApp
    </button>
  </div>
</div>

  );
};

export default MPRechazado;
