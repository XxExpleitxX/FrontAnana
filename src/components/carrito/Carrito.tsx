import { BiBasket, BiMinus, BiPlus } from "react-icons/bi";
import { useCarrito } from "../../hooks/useCarrito";
import { useState } from "react";
import "./Carrito.css";
import type { DetalleVenta } from "../../entities/DetalleVenta";
import { FaTrash } from "react-icons/fa";

interface CartItemProps {
  detalle: DetalleVenta;
  onAgregar: () => void;
  onDescontar: () => void;
}

interface CarritoProps {
  toggleCarrito: () => void;
}

function CartItem({ detalle, onAgregar, onDescontar }: CartItemProps) {
  return (
    <div className="cart-item">
      <div>
        <strong>
          {detalle.esPromocion && detalle.promocionCompleta
            ? `Promoción: ${detalle.promocionCompleta.denominacion}`
            : detalle.producto.denominacion}
        </strong>

        {detalle.precioAplicado != null && (
          <span className="precio-item">
            ${detalle.precioAplicado.toFixed(2)}
            {detalle.esPromocion && " (precio promo)"}
          </span>
        )}

        {detalle.esPromocion && detalle.promocionCompleta && (
          <div className="detalles-promocion">
            <small>
              Incluye:{" "}
              {detalle.productosPromocion
                .map((p) => `${p.cantidad} x ${p.producto.denominacion}`)
                .join(", ")}
            </small>
          </div>
        )}
      </div>

      <div className="botones-container">
        <span>
          {detalle.cantidad}{" "}
          {detalle.esPromocion
            ? "promoción"
            : detalle.cantidad === 1
            ? "unidad"
            : "unidades"}
        </span>
        <div className="botones-cambiar">
          <button onClick={onAgregar} className="btn-cambiar">
            <BiPlus size={12} />
          </button>
          <button onClick={onDescontar} className="btn-cambiar">
            <BiMinus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Carrito({ toggleCarrito }: CarritoProps) {
  const {
    cart,
    crearPedidoDetalle,
    addCarrito,
    descontarCarrito,
    limpiarCarrito,
    agregarPromocion,
    descontarPromocion, // ✅ Asegúrate de que estas funciones estén en tu hook
  } = useCarrito();

  const [idVenta, setIdVenta] = useState<number | null>(null);
  const [deseaEnvio, setDeseaEnvio] = useState<boolean>(false);
  const [mensajeExito, setMensajeExito] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");

  const totalProductos = cart.reduce(
    (total, detalle) =>
      total +
      (detalle.precioAplicado ?? detalle.producto.precio) * detalle.cantidad,
    0
  );

  const handleAgregarProducto = (detalle: DetalleVenta) => {
    const cantidadActual =
      cart.find((item) => item.producto.id === detalle.producto.id)?.cantidad ??
      0;

    if (detalle.producto.stock <= 0) {
      setMensajeExito("❌ El producto no tiene stock disponible.");
      setTimeout(() => setMensajeExito(""), 4000);
      return;
    }

    if (cantidadActual >= detalle.producto.stock) {
      setMensajeExito(
        `⚠️ Solo hay ${detalle.producto.stock} unidades disponibles.`
      );
      setTimeout(() => setMensajeExito(""), 4000);
      return;
    }

    addCarrito(detalle.producto);
  };

  const handleDescontarProducto = (detalle: DetalleVenta) => {
    descontarCarrito(detalle.producto);
  };

  const handleAgregarPromocion = (detalle: DetalleVenta) => {
    if (detalle.promocionCompleta) {
      // Verificación rápida antes de intentar agregar
      const sinStock = detalle.promocionCompleta.detallePromociones.some(
        (dp) => {
          const productoExistente = cart.find(
            (item) => !item.esPromocion && item.producto.id === dp.producto.id
          );
          const cantidadEnCarrito = productoExistente?.cantidad || 0;
          return dp.producto.stock - cantidadEnCarrito < dp.cantidad;
        }
      );

      if (sinStock) {
        setMensajeExito(
          "❌ No hay stock suficiente para agregar otra promoción"
        );
        setTimeout(() => setMensajeExito(""), 4000);
        return;
      }

      agregarPromocion(detalle.promocionCompleta);
    }
  };

  const handleDescontarPromocion = (detalle: DetalleVenta) => {
    if (detalle.promocionId) {
      descontarPromocion(detalle.promocionId);
    }
  };

  const handleGuardarCarrito = async () => {
    try {
      const nuevoIdVenta = await crearPedidoDetalle(
        "EFECTIVO",
        deseaEnvio ? 1 : 0,
        observaciones
      );
      setObservaciones("");
      setIdVenta(nuevoIdVenta);
      setMensajeExito("✅ Pedido guardado con éxito");
      setTimeout(() => setMensajeExito(""), 4000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMercadoPago = async () => {
    try {
      const nuevoIdVenta = await crearPedidoDetalle(
        "MERCADOPAGO",
        deseaEnvio ? 1 : 0,
        observaciones
      );
      setIdVenta(nuevoIdVenta);
      setObservaciones("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}mercadoPago/createPreference`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: nuevoIdVenta }),
        }
      );

      if (!response.ok) {
        throw new Error("Error creando preferencia en Mercado Pago");
      }

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setMensajeExito("❌ No se pudo iniciar el pago con Mercado Pago.");
      }
    } catch (error) {
      console.error("Error en pago con MP:", error);
      setMensajeExito("❌ Error al procesar el pago con Mercado Pago.");
    }
  };

  return (
    <aside className="cart">
      <header className="cart-header">
        <BiBasket size={25} color="#8771c3" />
        <h2>Tu carrito</h2>
        <button
          onClick={toggleCarrito}
          className="btn-close"
          aria-label="Cerrar Carrito"
        >
          &times;
        </button>
      </header>

      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

      <div className="cart-items">
        {cart.length === 0 && (
          <p className="text-danger">Sin productos en el carrito.</p>
        )}

        {cart.map((detalle) => (
          <CartItem
            key={detalle.id}
            detalle={detalle}
            onAgregar={() =>
              detalle.esPromocion
                ? handleAgregarPromocion(detalle)
                : handleAgregarProducto(detalle)
            }
            onDescontar={() =>
              detalle.esPromocion
                ? handleDescontarPromocion(detalle)
                : handleDescontarProducto(detalle)
            }
          />
        ))}

        <div className="observaciones-container">
          <p>Observaciones del pedido:</p>
          <textarea
            placeholder="Escribí acá el color de los productos que lo requieran y todo lo que desees!"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            maxLength={255}
          />
          <p>{observaciones.length}/255</p>
        </div>

        <div className="acciones-carrito">
          <button
            className="btn-vaciar"
            onClick={limpiarCarrito}
            title="Limpiar Todo"
          >
            <FaTrash size={14} style={{ marginRight: "6px" }} />
            Vaciar carrito
          </button>

          <div className="checkbox-envio">
            <input
              type="checkbox"
              id="envio"
              checked={deseaEnvio}
              onChange={() => setDeseaEnvio(!deseaEnvio)}
            />
            <label htmlFor="envio">¿Deseás envío?</label>
          </div>
        </div>
      </div>

      <div className="cart-footer" style={{ paddingBottom: "80px" }}>
        <div className="cart-total">
          <span>Total pedido:</span>
          <span className="total-monto">${totalProductos.toFixed(2)}</span>
        </div>

        <div className="botones-container">
          <button className="btn-efectivo" onClick={handleGuardarCarrito}>
            Finalizar pedido (Retiro en tienda / Efectivo)
          </button>
          <button className="btn-mercado-pago" onClick={handleMercadoPago}>
            Pagar con Mercado Pago
          </button>
        </div>
      </div>

      {deseaEnvio && idVenta && (
        <button className="btn-whatsapp" style={{ marginTop: "3px" }}>
          Avisar por WhatsApp pedido {idVenta}
        </button>
      )}
    </aside>
  );
}
