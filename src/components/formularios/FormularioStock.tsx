import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./FormularioStock.css";
import ProductoService from "../../services/ProductoService";
import Producto from "../../entities/Producto";

const FormularioStock = () => {
    const navigate = useNavigate();
    const url = import.meta.env.VITE_API_URL;
    const [productos, setProductos] = useState<Producto[]>([]);
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState(0);
    const [productoEncontrado, setProductoEncontrado] = useState<Producto | null>(null);
    const [sugerencias, setSugerencias] = useState<Producto[]>([]);
    const productoService = new ProductoService();

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const productosData = await productoService.getAll(url + "producto");
            setProductos(productosData);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCodigo(value);
        setNombre("");
        filtrarSugerencias(value, "codigo");
    };

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNombre(value);
        setCodigo("");
        filtrarSugerencias(value, "nombre");
    };

    const filtrarSugerencias = (valor: string, tipo: "codigo" | "nombre") => {
        if (valor.trim() === "") {
            setSugerencias([]);
            setProductoEncontrado(null);
            return;
        }

        const sugerenciasFiltradas = productos.filter((prod) =>
            tipo === "codigo"
                ? prod.codigo.toLowerCase().includes(valor.toLowerCase())
                : prod.denominacion.toLowerCase().includes(valor.toLowerCase())
        );

        setSugerencias(sugerenciasFiltradas.slice(0, 5)); // max 5 sugerencias
        setProductoEncontrado(null);
    };

    const seleccionarProducto = (producto: Producto) => {
        setProductoEncontrado(producto);
        setCodigo(producto.codigo);
        setNombre(producto.denominacion);
        setSugerencias([]);
    };

    const handleGuardarStock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (productoEncontrado && productoEncontrado.codigo) {
            try {
                await productoService.actualizarStock(`${url}producto`, productoEncontrado.codigo, cantidad);
                alert("Stock actualizado correctamente");

                setCodigo("");
                setNombre("");
                setCantidad(0);
                setProductoEncontrado(null);
                setSugerencias([]);

            } catch (error) {
                alert("Error al actualizar stock");
            }
        } else {
            alert("Debe seleccionar un producto válido");
        }
    };

    return (
        <div className="form-prod-container">
            <Form className="formulario-stock" onSubmit={handleGuardarStock}>
                <h3 className="titulo-stock">Carga de stock</h3>

                <div className="form-row">
                    <Form.Group className="input-metade position-relative">
                        <Form.Label>Código del Producto</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese el código del producto"
                            value={codigo}
                            onChange={handleCodigoChange}
                            autoComplete="off"
                        />
                    </Form.Group>

                    <Form.Group className="input-metade position-relative">
                        <Form.Label>Nombre del Producto</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese el nombre del producto"
                            value={nombre}
                            onChange={handleNombreChange}
                            autoComplete="off"
                        />
                    </Form.Group>
                </div>

                {sugerencias.length > 0 && (
                    <ul className="lista-sugerencias">
                        {sugerencias.map((prod) => (
                            <li key={prod.codigo} onClick={() => seleccionarProducto(prod)}>
                                {prod.codigo} - {prod.denominacion}
                            </li>
                        ))}
                    </ul>
                )}

                {productoEncontrado && (
                    <div className="alert alert-info mt-3">
                        <strong>Producto seleccionado:</strong> {productoEncontrado.denominacion} - Código: {productoEncontrado.codigo}
                    </div>
                )}

                <div className="form-actions-row">
                    <Form.Group className="input-cantidad">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Ingrese la cantidad"
                            value={cantidad}
                            onChange={(e) => setCantidad(parseInt(e.target.value))}
                        />
                    </Form.Group>

                    <div className="form-buttons">
                        <button type="submit" className="btn-lila-prod">Guardar Stock</button>
                        <button type="button" className="btn-volver-prod" onClick={() => navigate("/grillaProducts")}>Volver</button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default FormularioStock;
