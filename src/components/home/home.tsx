import "./home.css";
import {
  FaPrint,
  FaCopy,
  FaRing,
  FaFileAlt,
  FaGift,
  FaPenFancy,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="container-home">
      <div className="seccion-inicio">
        <div className="contenido-izquierda">
          <h1 className="titulo">
            ¡Todo para tu escritorio
            <br />y tus ideas!
          </h1>
          <h5 className="envio-principal">
            Envíos a todo el país.
            <br />
            Compra fácil y segura.
          </h5>
          <a href="/products">
            <button className="btn-ver-productos">Ver productos</button>
          </a>
        </div>
        <div className="contenido-derecha">
          <img src="/Images/Inicio.png" alt="Inicio" />
        </div>
      </div>
      <div className="seccion-artDestacados">
        <h2 className="titulo-artDestacados">Artículo destacado</h2>
        <div className="tarjetas-articulos">
          <div className="tarjeta-articulo">
            <img src="/Images/bibliorato.png" alt="Artículo 1" />
            <h4>
              BIBLIORATO
              <br />
              The Pell
            </h4>
            <a href="/products">
              <button className="btn-ver-productos">Ver más</button>
            </a>
          </div>
          <div className="tarjeta-articulo">
            <img src="/Images/resaltador.png" alt="Artículo 2" />
            <h4>
              RESALTADORES
              <br />
              Filgo
            </h4>
            <a href="/products">
              <button className="btn-ver-productos">Ver más</button>
            </a>
          </div>
          <div className="tarjeta-articulo">
            <img src="/Images/juguetes.png" alt="Artículo 3" />
            <h4>
              JUGUETES
              <br />
              Juegos didácticos
              <br />
              Muchos más!
            </h4>

            <a href="/products">
              <button className="btn-ver-productos">Ver más</button>
            </a>
          </div>
        </div>
      </div>
      <section className="seccion-hacemos-wrapper">
        <h2 className="titulo-servicio">Servicios que ofrecemos</h2>
        <div className="seccion-hacemos">
          <div className="item-servicio">
            <FaPrint className="icono-servicio" />
            <p>Impresiones</p>
          </div>
          <div className="item-servicio">
            <FaCopy className="icono-servicio" />
            <p>Fotocopias</p>
          </div>
          <div className="item-servicio">
            <FaRing className="icono-servicio" />
            <p>Anillados</p>
          </div>
          <div className="item-servicio">
            <FaFileAlt className="icono-servicio" />
            <p>Plastificados</p>
          </div>
          <div className="item-servicio">
            <FaGift className="icono-servicio" />
            <p>Regalería</p>
          </div>
          <div className="item-servicio">
            <FaPenFancy className="icono-servicio" />
            <p>Oficina</p>
          </div>
        </div>
      </section>
      <div className="seccion-marca">
        <h2 className="titulo-marcas">Trabajamos con las mejores marcas</h2>
        <div className="contenedor-logos fila-superior">
          <img src="/Images/filgo.png" alt="Marca 1" />
          <img src="/Images/maped.png" alt="Marca 2" />
          <img src="/Images/mooving.png" alt="Marca 3" />
          <img src="/Images/rivadavia.png" alt="Marca 4" />
        </div>
        <div className="contenedor-logos fila-inferior">
          <img src="/Images/triunfante.png" alt="Marca 5" />
          <img src="/Images/thePell.png" alt="Marca 6" />
        </div>
      </div>
      <div />
      <div className="seccion-envio">
        <h3>
          <FaTruck className="icono-camion" /> ¡Envíos rápidos y seguros a todo
          el país!
        </h3>{" "}
      </div>
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

export default Home;
