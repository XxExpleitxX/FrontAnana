import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetallePromocion from "../../entities/DetallePromocion";
import Producto from "../../entities/Producto";
import ProductoService from "../../services/ProductoService";
import { Button, Form, FormControl, FormGroup, FormLabel, ListGroup } from "react-bootstrap";
import DetallePromocionService from "../../services/DetallePromocionService";
import "./FormularioDetallePromocion.css"

const FormularioDetallePromocion = () => {
    const { idPromocion = "0" } = useParams();
    const promocionId = parseInt(idPromocion, 10);
    const navigate = useNavigate();

    const productoService = new ProductoService();
    const detallePromoService = new DetallePromocionService();
    const url = import.meta.env.VITE_API_URL;

    const [productos, setProductos] = useState<Producto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const [cantidad, setCantidad] = useState<number>(1);
    const [mensaje, setMensaje] = useState("");
    const [detalles, setDetalles] = useState<DetallePromocion[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        productoService.getAll(url + "producto").then(setProductos);
        detallePromoService.findAllByPromocionId(url + "detallePromocion", promocionId).then(setDetalles);
    }, [promocionId]);

    useEffect(() => {
        const filtered = productos.filter(p =>
            p.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProductos(filtered);
    }, [searchTerm, productos]);

    const handleProductoSelect = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setSearchTerm(producto.denominacion);
    };

    const agregarDetalle = async () => {
        if (!productoSeleccionado || cantidad <= 0) {
            setMensaje("Seleccioná un producto válido y una cantidad mayor a 0.");
            return;
        }

        const nuevoDetalle = new DetallePromocion();
        nuevoDetalle.producto = productoSeleccionado;
        nuevoDetalle.cantidad = cantidad;
        nuevoDetalle.promocion.id = promocionId;

        try {
            console.log("Agregando detalle:", nuevoDetalle);
            const detalleGuardado = await detallePromoService.post(url + "detallePromocion", nuevoDetalle);
            setDetalles([
                ...detalles,
                {
                    ...detalleGuardado,
                    producto: productoSeleccionado!, // reutilizamos el que ya tenías cargado
                },
            ]);
            setProductoSeleccionado(null);
            setCantidad(1);
            setSearchTerm("");
            setMensaje("Detalle agregado con éxito.");
        } catch (error) {
            console.error(error);
            setMensaje("Error al agregar el detalle.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Agregar Detalles a Promoción</h2>
            <Form>
                <FormGroup className="mb-3">
                    <FormLabel>Producto</FormLabel>
                    <div ref={dropdownRef} className="position-relative">
                        <FormControl
                            type="text"
                            placeholder="Buscar producto"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {filteredProductos.length > 0 && (
                            <ListGroup>
                                {filteredProductos.map((p) => (
                                    <ListGroup.Item
                                        key={p.id}
                                        action
                                        as="button"
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault(); // Previene el submit del form
                                            handleProductoSelect(p);
                                        }}
                                    >
                                        {p.denominacion}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>
                </FormGroup>
                <FormGroup className="mb-3 cantidad">
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl
                        type="number"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                        min={1}
                    />
                </FormGroup>
                <Button type="button" onClick={agregarDetalle}>Agregar Detalle</Button>
            </Form>
            {mensaje && <p className="mt-3 text-info">{mensaje}</p>}

            
            <ul>
                {detalles.map((d) => (
                    <li key={d.id}>
                        {d.producto?.denominacion} - Cantidad: {d.cantidad}
                    </li>
                ))}
            </ul>
            <Button
                variant="secondary"
                className="mt-4"
                onClick={() => navigate("/promociones")}
            >
                Finalizar
            </Button>
        </div>
    );
};

export default FormularioDetallePromocion;
