import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faUser,
  faUserCog,
  faBoxOpen,
  faTags,
  faBell,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./pantallaAdmin.css";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

const PantallaAdmin = () => {
  const [hayPedidosPendientes, setHayPedidosPendientes] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "venta");
        const data = await response.json();

        const hayPendientes =
          Array.isArray(data) &&
          data.some(
            (venta: { estadoVenta: string }) =>
              venta.estadoVenta === "PENDIENTE"
          );

        setHayPedidosPendientes(hayPendientes);
      } catch (error) {
        console.error("Error al verificar pedidos pendientes:", error);
      }
    };

    if (user?.rol === "ADMIN") {
      fetchPedidos();
    }
  }, [user]);

  return (
    <div className="pantalla-admin">
      <div className="bienvenida-container">
        <h1 className="bienvenida-titulo">
          <FontAwesomeIcon icon={faUserCog} className="icono-bienvenida" />
          Bienvenido, Administrador
        </h1>
        <h6 className="subtitulo">
          Aquí podrás encontrar todas las secciones del sistema y acceder a cada
          una para realizar los cambios que desees.
        </h6>
      </div>

      <div className="tarjetas-container">
        <div className="tarjeta usuarios">
          <Link to="/grillaUsuarios" className="tarjeta-link">
            <FontAwesomeIcon icon={faUser} className="icono-tarjeta" />
            <h3>Grilla Usuarios</h3>
            <p className="descripcion">
              Controla los usuarios: visualiza, edita, elimina y crea nuevos
              usuarios.
            </p>
          </Link>
        </div>

        <div className="tarjeta productos">
          <Link to="/grillaProducts" className="tarjeta-link">
            <FontAwesomeIcon icon={faBoxOpen} className="icono-tarjeta" />
            <h3>Grilla Productos</h3>
            <p className="descripcion">
              Gestiona tus productos: visualiza, edita, elimina y agrega nuevos
              productos a tu catálogo.
            </p>
          </Link>
        </div>

        <div className="tarjeta pedidos">
          <Link to="/grillaPedidos" className="tarjeta-link">
            <FontAwesomeIcon icon={faList} className="icono-tarjeta" />
            <h3>
              Grilla Pedidos{" "}
              {hayPedidosPendientes && (
                <FontAwesomeIcon
                  icon={faBell}
                  className="icono-alerta-pedidos"
                />
              )}
            </h3>
            <p className="descripcion">
              Administra tus pedidos: visualiza, edita, elimina y crea nuevos
              pedidos.
            </p>
          </Link>
        </div>

        <div className="tarjeta promociones">
          <Link to="/grillaPromociones" className="tarjeta-link">
            <FontAwesomeIcon icon={faTags} className="icono-tarjeta" />
            <h3>Grilla Promociones</h3>
            <p className="descripcion">
              Administrá tus promociones: visualizá, modificá, eliminá o añadí
              nuevas ofertas.
            </p>
          </Link>
        </div>
        <div className="tarjeta informes">
          <Link to="/grillaInformes" className="tarjeta-link">
            <FontAwesomeIcon icon={faUserCog} className="icono-tarjeta" />
            <h3>Grilla Informes</h3>
            <p className="descripcion">
              Visualizá y gestioná los informes del sistema para obtener un
              resumen de la actividad administrativa.
            </p>
          </Link>
        </div>
        <div className="tarjeta categorias">
          <Link to="/grillaCategorias" className="tarjeta-link">
            <FontAwesomeIcon icon={faLayerGroup} className="icono-tarjeta" />
            <h3>Grilla Categorías</h3>
            <p className="descripcion">
              Administrá las categorías: creá, editá y eliminá categorías del
              sistema.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PantallaAdmin;
