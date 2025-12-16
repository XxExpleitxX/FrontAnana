// AppRoutes.tsx
import { Route, Routes } from "react-router-dom";
import DondeEstamos from "../components/dondeEstamos/dondeEstamos";
import Home from "../components/home/home";
import PantallaAdmin from "../components/pantallaAdmin/pantallaAdmin";
import GrillaPedidos from "../components/grillas/grillaPedidos";
import GrillaProducts from "../components/grillas/grillaProducts";
import GrillaPromociones from "../components/grillas/grillaPromociones";
import GrillaUsuario from "../components/grillas/grillaUsuario";
import Login from "../components/login/Login";
import Products from "../components/product/product";
import FormularioProducto from "../components/formularios/FormularioProducto";
import DetalleProducto from "../components/detalleProducto/DetalleProducto";
import FormularioUsuarios from "../components/formularios/FormularioUsuarios";
import Promocion from "../components/promocion/Promocion";
import FormularioVentas from "../components/formularios/FormularioVenta";
import RoleRoute from "./RolRoute";
import FormularioStock from "../components/formularios/FormularioStock";
import FormularioRegistro from "../components/formularios/FormularioRegistro";
import FormularioDetalleVenta from "../components/formularios/FormularioDetalleVenta";
import FormularioPromocion from "../components/formularios/FormularioPromocion";
import FormularioDetallePromocion from "../components/formularios/FormularioDetallePromocion";
import MPAprobado from "../components/mp/MPAprobado";
import MPPendiente from "../components/mp/MPPendiente";
import MPRechazado from "../components/mp/MPRechazado";
import ClienteCompras from "../components/ClienteCompras/ClienteCompras";
import VentaCliente from "../components/ventaCliente/VentaCliente";
import GrillaInforme from "../components/grillas/GrillaInforme";
import VerVenta from "../components/verVenta/VerVenta";
import GrillaCategorias from "../components/grillas/grillaCategorias";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/DondeEstamos" element={<DondeEstamos />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/categoria/:categoria" element={<Products />} />
      <Route path="/products/marca/:marca" element={<Products />} />
      <Route path="/promociones" element={<Promocion />} />
      <Route path="/producto/:idProducto" element={<DetalleProducto />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<FormularioRegistro />} />
      <Route path="/mpsuccess" element={<MPAprobado />} />
      <Route path="/mppending" element={<MPPendiente />} />
      <Route path="/mpfailure" element={<MPRechazado />} />
      <Route path="/misCompras" element={<ClienteCompras />} />
      <Route path="/detalleVentaCliente/:idVenta" element={<VentaCliente />} />

      {/* Rutas privadas protegidas solo para ADMIN */}
      <Route
        path="/Admin"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <PantallaAdmin />
          </RoleRoute>
        }
      />

      <Route
        path="/verVenta/:idVenta"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <VerVenta />
          </RoleRoute>
        }
      />

      <Route
        path="/grillaInformes"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <GrillaInforme />
          </RoleRoute>
        }
      />

      <Route
        path="/grillaPedidos"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <GrillaPedidos />
          </RoleRoute>
        }
      />

      <Route
        path="/grillaCategorias"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <GrillaCategorias />
          </RoleRoute>
        }
      />

      <Route
        path="/grillaProducts"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <GrillaProducts />
          </RoleRoute>
        }
      />
      <Route
        path="/grillaPromociones"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <GrillaPromociones />
          </RoleRoute>
        }
      />
      <Route
        path="/grillaUsuarios"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <GrillaUsuario />
          </RoleRoute>
        }
      />
      <Route
        path="/formProducto/:idProducto"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <FormularioProducto />
          </RoleRoute>
        }
      />
      <Route
        path="/formUsuario/:idUsuario"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <FormularioUsuarios />
          </RoleRoute>
        }
      />
      <Route
        path="/formVenta/:idVenta"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <FormularioVentas />
          </RoleRoute>
        }
      />

      <Route
        path="/formDetalleVenta/:idVenta/:idDetalleVenta"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <FormularioDetalleVenta />
          </RoleRoute>
        }
      />

      <Route
        path="/formPromocion/:idPromocion"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <FormularioPromocion />
          </RoleRoute>
        }
      />

      <Route
        path="/detallePromocion/:idPromocion"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <FormularioDetallePromocion />
          </RoleRoute>
        }
      />

      <Route
        path="/stock"
        element={
          <RoleRoute allowedRoles={["ADMIN"]}>
            <FormularioStock />
          </RoleRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
