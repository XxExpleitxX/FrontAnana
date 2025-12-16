import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Col, Button, Badge } from "react-bootstrap";
import "./DetalleProducto.css";
import { useCarrito } from "../../hooks/useCarrito";
import { toast } from "react-toastify";
import Producto from "../../entities/Producto";
import Categoria from "../../entities/Categoria";

// Interface para el producto con descuento en el detalle
interface ProductoConDescuento {
  producto: Producto;
  precioConDescuento: number;
  tieneDescuento: boolean;
  porcentajeDescuento: number;
}

const DetalleProducto = () => {
  const { addCarrito } = useCarrito();
  const { idProducto } = useParams();
  const navigate = useNavigate();
  const productoId = idProducto ? parseInt(idProducto) : 0;
  const [productoConDescuento, setProductoConDescuento] = useState<ProductoConDescuento | null>(null);
  const [loading, setLoading] = useState(true);
  const baseImageUrl = import.meta.env.VITE_URL_IMAGES;

  useEffect(() => {
    const fetchProductoConDescuento = async () => {
      try {
        setLoading(true);
        
        // 1. Primero obtener el descuento global
        const responseDescuento = await fetch(
          `${import.meta.env.VITE_API_URL}config/discount`
        );
        const descuentoGlobal = await responseDescuento.json();

        // 2. Obtener el producto completo
        const responseProducto = await fetch(
          `${import.meta.env.VITE_API_URL}producto/${productoId}`
        );
        const data = await responseProducto.json();

        // 3. Crear el producto completo
        const productoCompleto = new Producto();
        productoCompleto.id = data.id ?? null;
        productoCompleto.denominacion = data.denominacion ?? "";
        productoCompleto.marca = data.marca ?? "";
        productoCompleto.codigo = data.codigo ?? "";
        productoCompleto.imagen = data.imagen ?? "";
        productoCompleto.precio = data.precio ?? 0;
        productoCompleto.costo = data.costo ?? 0;
        productoCompleto.porcentaje = data.porcentaje ?? 0;
        productoCompleto.stock = data.stock ?? 0;
        productoCompleto.cantidadVendida = data.cantidadVendida ?? 0;
        productoCompleto.descripcion = data.descripcion ?? "";
        productoCompleto.categoria = data.categoria ?? new Categoria();

        // 4. Calcular precio con descuento
        const precioConDescuento = productoCompleto.precio * (1 - descuentoGlobal / 100);
        const tieneDescuento = descuentoGlobal > 0;

        setProductoConDescuento({
          producto: productoCompleto,
          precioConDescuento,
          tieneDescuento,
          porcentajeDescuento: descuentoGlobal
        });

      } catch (error) {
        console.error("Error al obtener el producto:", error);
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (productoId > 0) {
      fetchProductoConDescuento();
    }
  }, [productoId]);

  const handleAddCarrito = () => {
    if (!productoConDescuento) return;

    // Crear producto para el carrito con el precio con descuento
    const productoParaCarrito: Producto = {
      ...productoConDescuento.producto,
      precio: productoConDescuento.precioConDescuento // ✅ Precio con descuento
    };

    addCarrito(productoParaCarrito);
    toast.success("Producto agregado al carrito");
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (!productoConDescuento) {
    return <p>Producto no encontrado</p>;
  }

  const { producto, precioConDescuento, tieneDescuento, porcentajeDescuento } = productoConDescuento;

  return (
    <div className="detalle-producto-container">
      <Col xs={12} className="col-card-horizontal">
        <Card className="card-producto-detalle-horizontal">
          <div className="card-horizontal-content">
            <div className="imagen-con-badge-prod">
              <Card.Img
                variant="top"
                src={
                  producto.imagen
                    ? baseImageUrl + producto.imagen
                    : baseImageUrl + "placeholder.jpg"
                }
                alt={producto.denominacion}
                className="img-horizontal-prod"
              />
              <Badge
                className={`stock-badge-imagen-prod ${
                  producto.stock > 0 ? "disponible" : "no-disponible"
                }`}
              >
                {producto.stock > 0 ? "Disponible" : "No disponible"}
              </Badge>
              {tieneDescuento && (
                <Badge className="descuento-badge-detalle">
                  -{porcentajeDescuento}% OFF
                </Badge>
              )}
            </div>

            <Card.Body className="card-body-horizontal">
              <Card.Title className="titulo-producto">
                {producto.denominacion}
              </Card.Title>
              <Card.Text className="card-marca-detalle">
                Marca: {producto.marca}
              </Card.Text>
              
              {/* Mostrar precio con descuento */}
              <div className="precio-container-detalle">
                {tieneDescuento ? (
                  <>
                    <span className="precio-original-detalle">
                      ${producto.precio.toFixed(2)}
                    </span>
                    <span className="precio-descuento-detalle">
                      ${precioConDescuento.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="precio-normal-detalle">
                    ${producto.precio.toFixed(2)}
                  </span>
                )}
              </div>

              <Card.Text className="card-descripcion-detalle">
                {producto.descripcion}
              </Card.Text>
            </Card.Body>
          </div>
        </Card>
      </Col>

      <div className="botones-detalle">
        <Button
          variant="outline-dark"
          className="btn-volver"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
        {producto.stock > 0 && (
          <Button
            className="btn-agregar-carrito"
            onClick={handleAddCarrito}
          >
            Agregar al carrito
          </Button>
        )}
      </div>
    </div>
  );
};

export default DetalleProducto;