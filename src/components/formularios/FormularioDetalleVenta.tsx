import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Producto from "../../entities/Producto";
import type { DetalleVenta } from "../../entities/DetalleVenta";
import DetalleVentaService from "../../services/DetalleVentaService";
import ProductoService from "../../services/ProductoService";
import VentaService from "../../services/VentaService";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  ListGroup,
  Row,
} from "react-bootstrap";
import "./FormularioDetalleVenta.css";

const FormularioDetalleVenta = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { idVenta = "0", idDetVenta = "0" } = useParams();
  const ventaId = parseInt(idVenta, 10) || 0;
  const detVentaId = parseInt(idDetVenta, 10) || 0;

  const [detallesVenta, setDetallesVenta] = useState<DetalleVenta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [detVentaObjeto, setDetVentaObjeto] = useState<DetalleVenta>({
    id: null,
    cantidad: 0,
    producto: new Producto(),
    venta: null,
    precioAplicado: 0,
    esPromocion: false,
    promocionId: null,
    productosPromocion: [],
  });

  const [searchNombre, setSearchNombre] = useState<string>("");
  const [searchCodigo, setSearchCodigo] = useState<string>("");
  const [filteredPorNombre, setFilteredPorNombre] = useState<Producto[]>([]);
  const [filteredPorCodigo, setFilteredPorCodigo] = useState<Producto[]>([]);

  const [isNombreDropdownOpen, setIsNombreDropdownOpen] = useState(false);
  const [isCodigoDropdownOpen, setIsCodigoDropdownOpen] = useState(false);

  const detalleVentaService = new DetalleVentaService();
  const ventaService = new VentaService();
  const productoService = new ProductoService();
  const [txtValidacion, setTxtValidacion] = useState<string>("");

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getDetVenta();
    productoService.getAll(url + "producto").then((data) => {
      setProductos(data);
      setFilteredPorNombre(data);
      setFilteredPorCodigo(data);
    });
  }, [idDetVenta]);

  useEffect(() => {
    cargarDetallesVenta();
  }, [ventaId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNombreDropdownOpen(false);
        setIsCodigoDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDetVenta = async () => {
    if (detVentaId > 0) {
      try {
        const detalleSelect = await detalleVentaService.get(
          url + "detalleVenta",
          detVentaId
        );
        if (detalleSelect) {
          setDetVentaObjeto(detalleSelect);
          setSearchNombre(detalleSelect.producto.denominacion);
          setSearchCodigo(detalleSelect.producto.codigo);
        } else {
          setTxtValidacion(
            "No se encontró el detalle con el ID proporcionado."
          );
        }
      } catch (error) {
        setTxtValidacion("Error al obtener los datos del detalle de la venta.");
        console.error(error);
      }
    }
  };

  const cargarDetallesVenta = async () => {
    try {
      const lista = await detalleVentaService.findAllByVentaId(
        url + "detalleVenta",
        ventaId
      );
      setDetallesVenta(lista);
    } catch (error) {
      console.error("Error al cargar detalles de venta:", error);
    }
  };

  const handleProductoChange = (producto: Producto) => {
    setDetVentaObjeto((prev) => ({ ...prev, producto }));
    setSearchNombre(producto.denominacion);
    setSearchCodigo(producto.codigo || "");
    setIsNombreDropdownOpen(false);
    setIsCodigoDropdownOpen(false);
  };

  const handleSearchNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchNombre(term);
    setSearchCodigo("");

    const filtered = productos.filter((producto) =>
      producto.denominacion.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPorNombre(filtered);
    setIsNombreDropdownOpen(true);
    setIsCodigoDropdownOpen(false);
  };

  const handleSearchCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchCodigo(term);
    setSearchNombre("");

    const filtered = productos.filter((producto) =>
      producto.codigo?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPorCodigo(filtered);
    setIsCodigoDropdownOpen(true);
    setIsNombreDropdownOpen(false);
  };

  const eliminarDetalle = async (id: number) => {
    try {
      await detalleVentaService.delete(url + "detalleVenta", id);
      cargarDetallesVenta(); // recargar lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar detalle:", error);
      setTxtValidacion("Ocurrió un error al eliminar el detalle.");
    }
  };

  const save = async () => {
    if (!detVentaObjeto.cantidad || detVentaObjeto.cantidad <= 0) {
      setTxtValidacion("Debe ingresar una cantidad válida.");
      return;
    }
    if (!detVentaObjeto.producto || !detVentaObjeto.producto.id) {
      setTxtValidacion("Debe seleccionar un producto válido.");
      return;
    }
    if (detVentaObjeto.producto.stock === 0) {
      setTxtValidacion("El producto seleccionado no tiene stock disponible.");
      return;
    }
    if (detVentaObjeto.cantidad > detVentaObjeto.producto.stock) {
      setTxtValidacion(
        `La cantidad no puede ser mayor al stock disponible (${detVentaObjeto.producto.stock}).`
      );
      return;
    }

    try {
      detVentaObjeto.venta = await ventaService.get(url + "venta", ventaId);
      if (detVentaId > 0) {
        await detalleVentaService.put(
          url + "detalleVenta",
          detVentaId,
          detVentaObjeto
        );
        navigate(`/formVenta/${ventaId}?refresh=1`);
      } else {
        await detalleVentaService.post(url + "detalleVenta", detVentaObjeto);
        setDetVentaObjeto((prev) => ({
          ...prev,
          producto: new Producto(),
        }));
        setSearchNombre("");
        setSearchCodigo("");
        setTxtValidacion("");
        cargarDetallesVenta();
      }
    } catch (error) {
      console.error("Error al guardar el detalle:", error);
      setTxtValidacion("Ocurrió un error al guardar el detalle.");
    }
  };

  return (
    <>
      <h2 className="titulo-detalle">
        {detVentaId > 0 ? "Editar Detalle de Venta" : "Nuevo Detalle de Venta"}
      </h2>
      <Form className="formulario-contenedor">
        <Row>
          <Col md={6}>
            <FormGroup>
              <FormLabel>Cantidad</FormLabel>
              <FormControl
                type="number"
                placeholder="Ingrese la cantidad"
                value={detVentaObjeto.cantidad || ""}
                min={1}
                max={detVentaObjeto.producto.stock || 1}
                onChange={(e) =>
                  setDetVentaObjeto({
                    ...detVentaObjeto,
                    cantidad: Number(e.target.value),
                  })
                }
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <div ref={dropdownRef} className="filtros-container">
              <div className="filtro-individual">
                <FormGroup
                  controlId="searchNombre"
                  className="position-relative"
                >
                  <FormLabel>Buscar por nombre</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Ingrese nombre del producto"
                    value={searchNombre}
                    onChange={handleSearchNombreChange}
                    onFocus={() => {
                      setIsNombreDropdownOpen(true);
                      setIsCodigoDropdownOpen(false);
                    }}
                  />
                  {isNombreDropdownOpen && filteredPorNombre.length > 0 && (
                    <ListGroup className="hay-productos">
                      {filteredPorNombre.map((producto) => (
                        <ListGroup.Item
                          key={producto.id}
                          action
                          onClick={() => handleProductoChange(producto)}
                        >
                          {producto.denominacion} -{" "}
                          <small>{producto.codigo}</small>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </FormGroup>
              </div>

              <div className="filtro-individual">
                <FormGroup
                  controlId="searchCodigo"
                  className="position-relative"
                >
                  <FormLabel>Buscar por código</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Ingrese código del producto"
                    value={searchCodigo}
                    onChange={handleSearchCodigoChange}
                    onFocus={() => {
                      setIsCodigoDropdownOpen(true);
                      setIsNombreDropdownOpen(false);
                    }}
                  />
                  {isCodigoDropdownOpen && filteredPorCodigo.length > 0 && (
                    <ListGroup className="hay-productos">
                      {filteredPorCodigo.map((producto) => (
                        <ListGroup.Item
                          key={producto.id}
                          action
                          onClick={() => handleProductoChange(producto)}
                        >
                          {producto.codigo} -{" "}
                          <small>{producto.denominacion}</small>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </FormGroup>
              </div>
            </div>

            {(searchNombre || searchCodigo) && (
              <Button
                variant="light"
                size="sm"
                onClick={() => {
                  setSearchNombre("");
                  setSearchCodigo("");
                  setDetVentaObjeto((prev) => ({
                    ...prev,
                    producto: new Producto(),
                  }));
                  setIsNombreDropdownOpen(false);
                  setIsCodigoDropdownOpen(false);
                }}
                className="btn-limpiar mt-2"
              >
                × Limpiar producto
              </Button>
            )}
          </Col>
        </Row>

        <Row className="d-flex justify-content-center">
          <Col md={6} className="d-flex justify-content-center">
            <Button onClick={save} className="btn-guardar">
              Guardar
            </Button>
          </Col>
          <Col md={6} className="d-flex justify-content-center">
            <Button
              onClick={() => navigate(`/formVenta/${ventaId}`)}
              className="btn-volver"
            >
              Volver
            </Button>
          </Col>
        </Row>
      </Form>

      {txtValidacion && (
        <div className="mb-3">
          <p className="texto-error">{txtValidacion}</p>
        </div>
      )}

      <br />
      <h3 className="subtitulo-detalles">Detalles de la Venta</h3>
      <hr />

      {detallesVenta.map((detalle) => (
        <div key={detalle.id} className="detalle-item">
          <div className="detalle-info">
            <span className="detalle-nombre">
              {detalle.producto.denominacion}
            </span>
            <span className="detalle-cantidad">Cant: {detalle.cantidad}</span>
            <span className="detalle-precio">
              $
              {typeof detalle.precioAplicado === "number"
                ? detalle.precioAplicado.toFixed(2)
                : "0.00"}
            </span>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => eliminarDetalle(detalle.id!)}
          >
            Eliminar
          </Button>
        </div>
      ))}
    </>
  );
};

export default FormularioDetalleVenta;
