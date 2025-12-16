import { createContext, useEffect, useState, type ReactNode } from "react";
import type { DetalleVenta } from "../entities/DetalleVenta";
import { useUser } from "./UserContext";
import DetalleVentaService from "../services/DetalleVentaService";
import VentaService from "../services/VentaService";
import type Producto from "../entities/Producto";
import Venta from "../entities/Venta";
import UserService from "../services/UserService";
import type Promocion from "../entities/Promocion";

// Define the CartContextType interface
interface CartContextType {
  cart: DetalleVenta[];
  descontarCarrito: (product: Producto) => void;
  addCarrito: (product: Producto) => void;
  removeCarrito: (product: Producto) => void | Promise<void>;
  removeItemCarrito: (product: Producto) => void;
  limpiarCarrito: () => void; // ✅ sin parámetros
  agregarPromocion: (promocion: Promocion) => void;
  descontarPromocion: (promocionId: number) => void;
  crearPedidoDetalle: (
    formaPago: "EFECTIVO" | "MERCADOPAGO",
    envio: number,
    observaciones?: string
  ) => Promise<number>;
  usuario: any;
  totalItems: number;
  agregarPromocionAlCarrito: (promocion: Promocion) => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  descontarCarrito: () => {},
  addCarrito: () => {},
  removeCarrito: () => {},
  removeItemCarrito: () => {},
  limpiarCarrito: () => {},
  crearPedidoDetalle: async (
    _formaPago: "EFECTIVO" | "MERCADOPAGO",
    _envio: number
  ) => 0,
  usuario: null,
  totalItems: 0,
  agregarPromocionAlCarrito: () => {},
  agregarPromocion: () => {},
  descontarPromocion: () => {},
});

export function CarritoContextProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [cart, setCart] = useState<DetalleVenta[]>([]);
  const userService = new UserService();
  const detalleVentaService = new DetalleVentaService();
  const ventaService = new VentaService();
  const url = import.meta.env.VITE_API_URL;

  // Generar la clave de localStorage según el usuario
  const getStorageKey = () =>
    user ? `carrito_user_${user.id}` : "carrito_guest";

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    if (!user) return; // Si no hay usuario, no cargamos

    const savedCart = localStorage.getItem(getStorageKey());
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al parsear el carrito guardado:", e);
        localStorage.removeItem(getStorageKey());
      }
    }
  }, [user]);

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey(), JSON.stringify(cart));
  }, [cart, user]);

  const totalItems = cart.reduce(
    (total, detalle) => total + detalle.cantidad,
    0
  );

  let idCounter = 0;

  const generateUniqueId = (): number => {
    return Date.now() + idCounter++;
  };

  const addCarrito = (product: Producto) => {
    setCart((prevCart) => {
      const existe = prevCart.some(
        (detalle) => !detalle.esPromocion && detalle.producto.id === product.id
      );

      if (existe) {
        return prevCart.map((detalle) =>
          !detalle.esPromocion && detalle.producto.id === product.id
            ? {
                ...detalle,
                cantidad: detalle.cantidad + 1,
                precioAplicado: detalle.precioAplicado ?? product.precio,
              }
            : detalle
        );
      } else {
        const nuevoDetalle: DetalleVenta = {
          id: generateUniqueId(),
          cantidad: 1,
          producto: product,
          venta: null,
          precioAplicado: product.precio,
          esPromocion: false,
          promocionId: null,
          productosPromocion: [],
        };
        return [...prevCart, nuevoDetalle];
      }
    });
  };

  const descontarCarrito = (product: Producto) => {
    setCart((prevCart) => {
      const existe = prevCart.some(
        (detalle) => !detalle.esPromocion && detalle.producto.id === product.id
      );

      if (existe) {
        return prevCart
          .map((detalle) =>
            !detalle.esPromocion && detalle.producto.id === product.id
              ? { ...detalle, cantidad: detalle.cantidad - 1 }
              : detalle
          )
          .filter((detalle) => detalle.cantidad > 0);
      }
      return prevCart;
    });
  };

  const agregarPromocion = (promocion: Promocion) => {
    for (const dp of promocion.detallePromociones) {
      const productoExistente = cart.find(
        (item) => !item.esPromocion && item.producto.id === dp.producto.id
      );

      const cantidadEnCarrito = productoExistente?.cantidad || 0;
      //const stockDisponible = dp.producto.stock - cantidadEnCarrito;

      // Considerar también las promociones ya en el carrito
      const promocionesDelProducto = cart.filter(
        (item) =>
          item.esPromocion &&
          item.productosPromocion.some((p) => p.producto.id === dp.producto.id)
      );

      let cantidadEnPromociones = 0;
      for (const promo of promocionesDelProducto) {
        const detallePromo = promo.productosPromocion.find(
          (p) => p.producto.id === dp.producto.id
        );
        if (detallePromo) {
          cantidadEnPromociones += detallePromo.cantidad * promo.cantidad;
        }
      }

      const stockTotalDisponible =
        dp.producto.stock - cantidadEnCarrito - cantidadEnPromociones;

      if (stockTotalDisponible < dp.cantidad) {
        console.error(
          `No hay stock suficiente para ${dp.producto.denominacion} en la promoción`
        );
        // Podrías mostrar un mensaje al usuario aquí
        return;
      }
    }

    setCart((prevCart) => {
      const existe = prevCart.some(
        (detalle) => detalle.esPromocion && detalle.promocionId === promocion.id
      );

      if (existe) {
        return prevCart.map((detalle) =>
          detalle.esPromocion && detalle.promocionId === promocion.id
            ? { ...detalle, cantidad: detalle.cantidad + 1 }
            : detalle
        );
      } else {
        const nuevoDetalle: DetalleVenta = {
          id: generateUniqueId(),
          cantidad: 1,
          producto: promocion.detallePromociones[0].producto,
          venta: null,
          precioAplicado: promocion.precioPromocional,
          esPromocion: true,
          promocionId: promocion.id,
          productosPromocion: promocion.detallePromociones,
          promocionCompleta: promocion, // ✅ Guardamos la promoción completa
        };
        return [...prevCart, nuevoDetalle];
      }
    });
  };

  const descontarPromocion = (promocionId: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((detalle) =>
          detalle.esPromocion && detalle.promocionId === promocionId
            ? { ...detalle, cantidad: detalle.cantidad - 1 }
            : detalle
        )
        .filter((detalle) => detalle.cantidad > 0);
    });
  };

  const removeCarrito = (product: Producto) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.producto.id !== product.id)
    );
  };

  const removeItemCarrito = (product: Producto) => {
    setCart((prevCart) => {
      const existe = prevCart.some(
        (detalle) => detalle.producto.id === product.id
      );
      if (existe) {
        return prevCart
          .map((detalle) =>
            detalle.producto.id === product.id
              ? { ...detalle, cantidad: detalle.cantidad - 1 }
              : detalle
          )
          .filter((detalle) => detalle.cantidad > 0);
      }
      return prevCart;
    });
  };

  const limpiarCarrito = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(getStorageKey());
    }
  };

  const crearPedidoDetalle = async (
    formaPago: "EFECTIVO" | "MERCADOPAGO",
    envio: number,
    observaciones?: string
  ): Promise<number> => {
    try {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const nuevaVenta = new Venta();
      nuevaVenta.total = cart.reduce(
        (total, detalle) =>
          total +
          (detalle.precioAplicado ?? detalle.producto.precio) *
            detalle.cantidad,
        0
      );
      nuevaVenta.estadoVenta = "PENDIENTE";
      nuevaVenta.formaPago = formaPago;
      nuevaVenta.envio = envio;
      nuevaVenta.observaciones = observaciones || "";
      nuevaVenta.user = await userService.get(url + "user", user.id);

      console.log("Venta a crear:", nuevaVenta);

      // Enviamos la venta y obtenemos el ID generado
      const respuestaVenta = await ventaService.post(url + "venta", nuevaVenta);
      const ventaId = respuestaVenta.id;

      if (typeof ventaId !== "number") {
        throw new Error("El ID de la venta no es válido");
      }

      const detallesDTO = cart.flatMap((detalle) => {
        if (detalle.esPromocion) {
          // Para promociones, crear un detalle por cada producto
          return detalle.productosPromocion.map((dp) => ({
            cantidad: dp.cantidad * detalle.cantidad, // Cantidad total
            precioAplicado:
              (detalle.precioAplicado ?? detalle.producto.precio) /
              detalle.productosPromocion.length,
            productoId: dp.producto.id as number,
            ventaId: ventaId,
            esPromocion: true,
          }));
        } else {
          // Productos individuales
          return [
            {
              cantidad: detalle.cantidad,
              precioAplicado: detalle.precioAplicado ?? detalle.producto.precio,
              productoId: detalle.producto.id as number,
              ventaId: ventaId,
              esPromocion: false,
            },
          ];
        }
      });

      // Enviamos todos los detalles

      for (const detalleDTO of detallesDTO) {
        await detalleVentaService.postDTO(url + "detalleVenta/dto", detalleDTO);
      }

      limpiarCarrito();
      return ventaId;
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      throw error;
    }
  };

  const agregarPromocionAlCarrito = (promocion: Promocion) => {
    if (!promocion.detallePromociones?.length) return;

    // Verificar stock (código existente)
    for (const dp of promocion.detallePromociones) {
      const productoExistente = cart.find(
        (item) => item.producto.id === dp.producto.id
      );
      const cantidadEnCarrito = productoExistente?.cantidad || 0;
      const stockDisponible = dp.producto.stock - cantidadEnCarrito;

      if (stockDisponible < dp.cantidad) {
        console.error(
          `No hay stock suficiente para ${dp.producto.denominacion}`
        );
        return;
      }
    }

    agregarPromocion(promocion);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addCarrito,
        descontarCarrito,
        removeCarrito,
        removeItemCarrito,
        limpiarCarrito, // ✅ ahora sí lo pasamos
        crearPedidoDetalle,
        usuario: user,
        totalItems,
        agregarPromocionAlCarrito,
        agregarPromocion,
        descontarPromocion,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
