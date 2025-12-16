import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Spinner,
} from "react-bootstrap";
import type Producto from "../../entities/Producto";
import type Categoria from "../../entities/Categoria";
import type ProductoConDescuento from "../../entities/ProductoConDescuento";
import { FaShoppingBasket, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCarrito } from "../../hooks/useCarrito";
import ProductoService from "../../services/ProductoService";
import "./product.css";

const Products = () => {
  const { addCarrito, cart } = useCarrito();
  const [productos, setProductos] = useState<ProductoConDescuento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [ordenPrecio, setOrdenPrecio] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { categoria, marca } = useParams();

  const filtroInicialAplicado = useRef(false);
  const productoService = new ProductoService();
  const url = import.meta.env.VITE_API_URL;
  const baseImageUrl = import.meta.env.VITE_URL_IMAGES;

  const getImagenUrl = (imagen?: string) =>
    imagen ? `${baseImageUrl}${imagen}` : `${baseImageUrl}placeholder.jpg`;

  // --- Fetch de productos (optimizado con control de carga) ---
  const fetchProductos = async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = await productoService.getProductosConDescuento(
        url + "producto",
        {
          page: reset ? 0 : page,
          size,
          busqueda: busqueda?.trim() || "",
          marca: filtroMarca?.trim() || "",
          categoria: filtroCategoria?.trim() || "",
          orden: ordenPrecio || "asc",
        }
      );

      if (reset) {
        setProductos(data);
        setPage(0);
      } else {
        setProductos((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === size);
    } catch (error) {
      console.error("Error al obtener productos con descuento:", error);
      toast.error("No se pudieron cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fetch de categorías y marcas ---
  const fetchCategorias = async () => {
    try {
      const response = await fetch(url + "categoria");
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const fetchMarcas = async () => {
    try {
      const response = await fetch(url + "producto/marcas");
      const data = await response.json();
      setMarcas(data);
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  };

  // --- Aplicar filtro desde la URL (solo una vez) ---
  useEffect(() => {
    if (!filtroInicialAplicado.current) {
      const normalizar = (texto: string) =>
        texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

      if (categoria) {
        setFiltroCategoria(normalizar(categoria));
        setFiltroMarca("");
      } else if (marca) {
        setFiltroMarca(normalizar(marca));
        setFiltroCategoria("");
      }

      filtroInicialAplicado.current = true;
    }
  }, [categoria, marca]);

  // --- Fetch inicial y refetch cuando cambian filtros o búsqueda ---
  useEffect(() => {
    if (filtroInicialAplicado.current) {
      setPage(0);
      fetchProductos(true);
    }
  }, [busqueda, filtroMarca, filtroCategoria, ordenPrecio]);

  // --- Inicializar categorías y marcas al montar ---
  useEffect(() => {
    fetchCategorias();
    fetchMarcas();
  }, []);

  // --- Paginación ---
  useEffect(() => {
    if (page > 0) fetchProductos();
  }, [page]);

  const categoriasOrdenadas = useMemo(() => {
    return (categorias || [])
      .filter((c): c is Categoria => !!c && !!c.denominacion && !!c.id)
      .sort((a, b) =>
        a.denominacion.toLowerCase().localeCompare(b.denominacion.toLowerCase())
      );
  }, [categorias]);

  const productoEnCarrito = (id: number) =>
    cart.find((item) => item.producto.id === id);

  const handleAddCarrito = async (prodDTO: ProductoConDescuento) => {
    try {
      const producto: Producto = {
        id: prodDTO.id,
        denominacion: prodDTO.denominacion,
        descripcion: "",
        precio: prodDTO.precioConDescuento,
        stock: prodDTO.stock,
        imagen: prodDTO.imagen,
        marca: prodDTO.marca,
        codigo: prodDTO.codigo,
        categoria: prodDTO.categoria,
        costo: 0,
        porcentaje: 0,
        cantidadVendida: 0,
      };

      if (producto.stock <= 0) {
        toast.error("❌ Producto no disponible");
        return;
      }

      const itemCarrito = producto.id
        ? productoEnCarrito(producto.id)
        : undefined;

      if (itemCarrito && itemCarrito.cantidad >= producto.stock) {
        toast.error(`⚠️ Máximo disponible: ${producto.stock} unidades`);
        return;
      }

      addCarrito(producto);
      toast.success("✅ Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("❌ Error al agregar el producto");
    }
  };

  return (
    <Container fluid className="productos-container">
      <Row className="mb-4">
        <Col>
          <h2 className="titulo-prod">Nuestros Productos</h2>
        </Col>
      </Row>

      {/* --- Filtros --- */}
      <Row className="filtros-prod mb-4">
        <Col xs={12} md="auto">
          <Form.Control
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>

        <Col xs={12} md="auto">
          <Form.Select
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
          >
            <option value="">Todas las marcas</option>
            {marcas.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={12} md="auto">
          <Form.Select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categoriasOrdenadas.map((cat) => (
              <option key={cat.id} value={cat.denominacion}>
                {cat.denominacion}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={12} md="auto">
          <Button
            onClick={() =>
              setOrdenPrecio(ordenPrecio === "asc" ? "desc" : "asc")
            }
          >
            Orden: {ordenPrecio === "asc" ? "Menor a mayor" : "Mayor a menor"}
          </Button>
        </Col>

        <Col xs={12} md="auto">
          <Button
            variant="secondary"
            onClick={() => {
              setBusqueda("");
              setFiltroMarca("");
              setFiltroCategoria("");
              setOrdenPrecio("asc");
            }}
          >
            Limpiar filtros
          </Button>
        </Col>
      </Row>

      {/* --- Productos --- */}
      <Row className="productos-grid g-4">
        {productos.map((prod) => {
          const itemCarrito =
            prod.id != null ? productoEnCarrito(prod.id) : undefined;
          const disabledCarrito =
            prod.stock === 0 ||
            (itemCarrito && itemCarrito.cantidad >= prod.stock);

          return (
            <Col
              key={prod.id || `prod-${prod.denominacion}-${prod.codigo}`}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex"
            >
              <Card className="producto-card h-100 w-100 d-flex flex-column">
                <div className="img-container">
                  <Card.Img
                    variant="top"
                    src={getImagenUrl(prod.imagen)}
                    alt={prod.denominacion}
                    className="card-img-top"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = `${baseImageUrl}placeholder.png`;
                    }}
                  />
                  <Badge
                    className={`stock-badge ${
                      prod.stock > 0 ? "disponible" : "no-disponible"
                    }`}
                  >
                    {prod.stock > 0 ? "Disponible" : "No disponible"}
                  </Badge>
                </div>

                <Card.Body>
                  <Card.Title className="producto-titulo">
                    {prod.denominacion}
                  </Card.Title>
                  <div className="producto-marca">{prod.marca}</div>
                  {prod.stock <= 5 && prod.stock > 0 && (
                    <div className="stock-alert">
                      Unidades disponibles: {prod.stock}
                    </div>
                  )}
                </Card.Body>

                <Card.Footer className="producto-footer">
                  <div className="fila-precio-carrito">
                    <div className="precio-carrito">
                      ${prod.precioConDescuento.toFixed(2)}
                      {prod.precioConDescuento < prod.precioOriginal && (
                        <>
                          <span className="precio-original">
                            ${prod.precioOriginal.toFixed(2)}
                          </span>
                          <span className="etiqueta-descuento">
                            -
                            {Math.round(
                              ((prod.precioOriginal - prod.precioConDescuento) /
                                prod.precioOriginal) *
                                100
                            )}
                            %
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      className="btn-carrito-prod"
                      onClick={() => handleAddCarrito(prod)}
                      disabled={disabledCarrito}
                    >
                      <FaShoppingBasket />
                    </button>
                  </div>

                  <button
                    className="btn-detalle-prod"
                    onClick={() =>
                      (window.location.href = `/producto/${prod.id}`)
                    }
                  >
                    Ver detalles
                  </button>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* --- Spinner de carga --- */}
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" role="status" />
          <span className="spinner-text">Cargando productos...</span>
        </div>
      )}

      {/* --- Botón de paginación --- */}
      {!isLoading && hasMore && (
        <div className="cargar-mas-container">
          <Button onClick={() => setPage((prev) => prev + 1)}>
            Cargar más
          </Button>
        </div>
      )}

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
    </Container>
  );
};

export default Products;
