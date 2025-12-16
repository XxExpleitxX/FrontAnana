import { useContext, useEffect, useState } from "react";
import type entitiePromocion from "../../entities/Promocion";
import "./Promocion.css";
import { CartContext } from "../../context/CarritoContext";
import { FaWhatsapp } from "react-icons/fa";

const Promocion = () => {
  const { agregarPromocionAlCarrito, cart } = useContext(CartContext);
  const [promociones, setPromociones] = useState<entitiePromocion[]>([]);
  const [mensajeStock, setMensajeStock] = useState<string>("");
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await fetch(url + "promocion");
        const data = await response.json();

        const hoy = new Date();
        const promocionesVigentes = data.filter(
          (p: any) => new Date(p.fechaFin) >= hoy
        );

        setPromociones(promocionesVigentes);
      } catch (error) {
        console.error("Error al obtener promociones:", error);
      }
    };

    fetchPromociones();
  }, [url]);

  const verificarStockPromocion = (promo: entitiePromocion): boolean => {
    // Verificar stock para cada producto en la promoción
    for (const detalle of promo.detallePromociones || []) {
      const producto = detalle.producto;
      
      // Calcular cuántas unidades ya están en el carrito
      const cantidadEnCarrito = 
        cart.find(item => item.producto.id === producto.id)?.cantidad || 0;
      
      // Calcular stock disponible considerando lo que ya está en el carrito
      const stockDisponible = producto.stock - cantidadEnCarrito;
      
      // Verificar si hay suficiente stock para la cantidad requerida por la promoción
      if (stockDisponible < detalle.cantidad) {
        setMensajeStock(
          `❌ No hay suficiente stock para "${producto.denominacion}". 
           Disponible: ${Math.max(0, stockDisponible)}, Necesario: ${detalle.cantidad}`
        );
        setTimeout(() => setMensajeStock(""), 4000);
        return false;
      }
    }
    return true;
  };

  const tieneStockSuficiente = (promo: entitiePromocion): boolean => {
    for (const detalle of promo.detallePromociones || []) {
      const producto = detalle.producto;
      const cantidadEnCarrito = 
        cart.find(item => item.producto.id === producto.id)?.cantidad || 0;
      
      const stockDisponible = producto.stock - cantidadEnCarrito;
      
      if (stockDisponible < detalle.cantidad) {
        return false;
      }
    }
    return true;
  };

  const handleAgregarPromocion = (promo: entitiePromocion) => {
    if (!verificarStockPromocion(promo)) {
      return;
    }

    agregarPromocionAlCarrito(promo);
    setMensajeStock("✅ Promoción agregada al carrito");
    setTimeout(() => setMensajeStock(""), 4000);
  };

  return (
    <div className="container-promo">
      <h1 className="titulo-promociones">Promociones Activas</h1>
      
      {mensajeStock && (
        <div className="mensaje-stock">
          {mensajeStock}
        </div>
      )}

      <div className="row">
        {promociones.map((promo) => {
          const tieneStock = tieneStockSuficiente(promo);
          
          return (
            <div key={promo.id} className="card">
              <div className="card-header">{promo.denominacion}</div>
              <div className="card-body">
                <div className="fecha-hasta">
                  <span className="etiqueta">Finaliza</span>{" "}
                  {new Date(promo.fechaFin).toLocaleDateString()}
                </div>

                <h6>PRODUCTOS INCLUÍDOS:</h6>
                {promo.detallePromociones && promo.detallePromociones.length > 0 ? (
                  <div className="lista-productos">
                    {promo.detallePromociones.map((detalle) => {
                      const producto = detalle.producto;
                      const cantidadEnCarrito = 
                        cart.find(item => item.producto.id === producto.id)?.cantidad || 0;
                      const stockDisponible = producto.stock - cantidadEnCarrito;
                      
                      return (
                        <div key={detalle.id} className="item-producto">
                          <span className="nombre-producto">
                            {producto.denominacion} - Cantidad {detalle.cantidad}
                          </span>
                          <span className={`stock-info ${stockDisponible < detalle.cantidad ? 'stock-insuficiente' : ''}`}>
                            (Stock disponible: {Math.max(0, stockDisponible)})
                          </span>
                        </div>
                      );
                    })}
                    <span className="precio-descuento">
                      Precio promo: ${promo.precioPromocional.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <p>No hay productos en esta promoción.</p>
                )}
                <h5>*Hasta Agotar Stock</h5>
                <h2>¡IMPERDIBLE!</h2>
              </div>
              <button
                className={`btn-agregar-carrito-promocion ${!tieneStock ? 'disabled' : ''}`}
                onClick={() => tieneStock && handleAgregarPromocion(promo)}
                disabled={!tieneStock}
                title={!tieneStock ? "No hay stock suficiente para todos los productos" : ""}
              >
                {tieneStock ? 'Agregar al carrito' : 'Sin stock disponible'}
              </button>
            </div>
          );
        })}
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
    </div>
  );
};

export default Promocion;