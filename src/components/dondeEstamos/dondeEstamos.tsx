import { FaEnvelope, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./dondeEstamos.css";

const DondeEstamos = () => {
  return (
    <>
      <div className="background-container-ubicacion">
        <div className="container-ubicacion">
          <h1 className="titlo">
            ¡Pasá por nuestra librería
            <br />a visitarnos o recibí tu pedido
            <br /> en casa con nuestros envíos!
          </h1>

          <div className="col-md-12 d-flex justify-content-center map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3348.7360697103895!2d-68.84891432433089!3d-32.931570773599375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDU1JzUzLjciUyA2OMKwNTAnNDYuOCJX!5e0!3m2!1ses!2sar!4v1748862762306!5m2!1ses!2sar"
              width="600"
              height="450"
              loading="lazy"
              className="map-iframe"
            ></iframe>
          </div>
          <div className="gif-container">
            <img
              src="/Images/camion.png"
              alt="Librería animación"
              className="gif-img"
            />
          </div>
          <div className="social-section">
            <a
              href="mailto:ananalibreria@hotmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaEnvelope className="social-icon" title="Correo electrónico" />
            </a>

            <a
              href="https://wa.me/5492611234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="social-icon" title="WhatsApp" />
            </a>
            <a
              href="https://www.instagram.com/anana.libreria"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="social-icon" title="Instagram" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default DondeEstamos;
