import { Link, useNavigate } from "react-router-dom";
import "./navBar.css";
import { useUser } from "../../context/UserContext"; // Ajustá el path si es distinto
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import type { EstadoVenta } from "../../entities/enums/EstadoVenta";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons/faExclamationCircle";
import { useCarrito } from "../../hooks/useCarrito";


interface NavbarProps {
  toggleCarrito: () => void;
}

const NavBar: React.FC<NavbarProps> = ({ toggleCarrito }) => {
  const { user, logout } = useUser();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCarrito();
  const [hayPedidosPendientes, setHayPedidosPendientes] = useState(false);

  const handleLogout = () => {
    logout(); // Esta función debería limpiar el usuario en el contexto
    navigate("/login"); // Redirigir al login
  };
  useEffect(() => {
  const fetchPedidos = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "venta");
      const data = await response.json();

      // Filtrar las ventas pendientes
      const hayPendientes = Array.isArray(data) && data.some(
        (venta: { estadoVenta: EstadoVenta }) => venta.estadoVenta === "PENDIENTE"
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
    <nav className="navbar-custom">
      <Link to="/">
        <img
          src="/Images/logo-navBar-blanco.png"
          alt="Logo"
          className="logo-navbar"
        />
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Abrir menú"
      >
        &#8942;
      </button>

      {/* Links agrupados a la izquierda */}
      <div className={`iconos-navbar ${menuAbierto ? "visible" : ""}`}>
        {/* Quitamos el link "Inicio" porque el logo hace esa función */}
        <Link to="/DondeEstamos" className="icono-link">
          Ubicación
        </Link>
        <Link to="/products" className="icono-link">
          Productos
        </Link>
        <Link to="/promociones" className="icono-link">
          Promociones
        </Link>
        {user && user.rol === "USER" && (
          <Link to="/misCompras" className="icono-link">
            Mis compras
          </Link>
        )}
        {user && user.rol === "ADMIN" && (
          <Link
            to="/Admin"
            className="icono-link"
            style={{ position: "relative" }}
          >
            Administrador
            {hayPedidosPendientes && <FontAwesomeIcon icon={faExclamationCircle} className="admin-alerta" />}
          </Link>
        )}
      </div>

      {/* Grupo a la derecha: usuario + botón + carrito */}
      <div className="navbar-right">
        <div className="user-session">
          {user ? (
            <>
              <span className="user-info">Hola, {user.usuario}</span>
              <button onClick={handleLogout} className="btn-sesion">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-sesion">
              Iniciar sesión
            </Link>
          )}
        </div>

        <div className="icono-carrito">
          <button onClick={toggleCarrito} className="button-carrito">
            <FontAwesomeIcon icon={faShoppingCart} className="icono-carrito" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
