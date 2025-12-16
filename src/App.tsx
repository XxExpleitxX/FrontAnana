import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/navBar/navBar"; // path según tu proyecto
import { UserProvider } from "./context/UserContext";
import { useState } from "react";
import { Carrito } from "./components/carrito/Carrito";
import { CarritoContextProvider } from "./context/CarritoContext";

const App = () => {
  const [carritoVisible, setCarritoVisible] = useState(false);

  const toggleCarrito = () => {
    setCarritoVisible(!carritoVisible);
  };

  return (
    <UserProvider>
      <CarritoContextProvider>
        <BrowserRouter>
          <NavBar toggleCarrito={toggleCarrito} />
          {carritoVisible && <Carrito toggleCarrito={toggleCarrito} />}
          <AppRoutes />
        </BrowserRouter>
      </CarritoContextProvider>
    </UserProvider>
  );
};

export default App;
