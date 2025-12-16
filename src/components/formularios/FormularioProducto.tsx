import { useEffect, useState } from "react";
import { Form, Button, Col, Alert } from "react-bootstrap";
import Producto from "../../entities/Producto";
import Categoria from "../../entities/Categoria";
import "./FormularioProducto.css";
import ProductoService from "../../services/ProductoService";
import { useParams, useNavigate } from "react-router-dom";

const FormularioProducto = () => {
  const navigate = useNavigate();
  const { idProducto = "0" } = useParams();
  const productoId = idProducto ? parseInt(idProducto) : 0;
  const [costoInput, setCostoInput] = useState('');
  const [porcentajeInput, setPorcentajeInput] = useState('');
  const [productoObjeto, setProductoObjeto] = useState<Producto>(new Producto());
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const productoService = new ProductoService();
  const url = import.meta.env.VITE_API_URL;

  // Carga inicial de datos
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        // Cargar categorías primero
        const categoriasResponse = await fetch(`${url}categoria`, { signal });
        if (!categoriasResponse.ok) throw new Error("Error al cargar categorías");
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);

        // Si es edición, cargar el producto
        if (productoId > 0) {
          const productoResponse = await fetch(`${url}producto/${productoId}`, { signal });
          if (!productoResponse.ok) throw new Error("Error al cargar producto");
          const productoData = await productoResponse.json();

          setProductoObjeto(productoData);
          setCostoInput(productoData.costo.toString().replace('.', ','));
          setPorcentajeInput(productoData.porcentaje.toString().replace('.', ','));
        } else {
          // Si es nuevo, asignar primera categoría por defecto si existe
          setProductoObjeto({
            ...new Producto(),
            cantidadVendida: 0,
            categoria: categoriasData.length > 0 ? categoriasData[0] : new Categoria()
          });
        }
      } catch (error) {
        if (!signal.aborted) {
          setError(error instanceof Error ? error.message : "Error al cargar datos");
          console.error("Error:", error);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
      if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    };
  }, [productoId, url]);

  // Limpieza de URL de vista previa
  useEffect(() => {
    return () => {
      if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    };
  }, [previewImageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    if (!validateForm()) return;

    setIsSaving(true);
    setError(null);

    try {
      const isUpdate = productoId > 0;
      const method = productoId > 0 ? 'put' : 'post';
      const productoGuardado = await productoService.saveWithImage(
        `${url}producto`,
        productoObjeto,
        selectedImageFile,
        method
      );

      alert(`Producto ${isUpdate ? 'actualizado' : 'creado'} correctamente: ${productoGuardado.denominacion}`);
      navigate("/grillaProducts");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al guardar");
      console.error("Error detallado:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const validateForm = (): boolean => {
    const errors = [];

    if (!productoObjeto.denominacion?.trim()) errors.push("La denominación es obligatoria");
    if (!productoObjeto.codigo?.trim()) errors.push("El código es obligatorio");
    if (productoObjeto.costo <= 0) errors.push("El costo debe ser mayor a cero");
    if (productoObjeto.porcentaje <= 0) errors.push("El porcentaje debe ser mayor a cero");
    if (productoObjeto.stock < 0) errors.push("El stock no puede ser negativo");
    if (!productoObjeto.categoria?.id) errors.push("Debe seleccionar una categoría");

    if (errors.length > 0) {
      setError(errors.join(". "));
      return false;
    }
    return true;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('image/')) throw new Error("Solo se permiten imágenes");
      if (file.size > 5 * 1024 * 1024) throw new Error("La imagen no debe superar 5MB");

      setSelectedImageFile(file);
      setPreviewImageUrl(URL.createObjectURL(file));
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error con la imagen");
      event.target.value = ''; // Limpiar input
    }
  };

  const calcularYSetearPrecio = (costo: number, porcentaje: number) => {
    const precioCalculado = costo * (1 + porcentaje / 100);
    setProductoObjeto(prev => ({
      ...prev,
      costo,
      porcentaje,
      precio: precioCalculado,
    }));
  };

  return (
    <div className="form-prod-container">
      <Form onSubmit={handleSubmit} className="formulario-producto shadow-sm">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <h3 className="titulo-product">Formulario de Producto</h3>

        <Form.Group>
          <Form.Label>Denominación</Form.Label>
          <Form.Control
            type="text"
            value={productoObjeto.denominacion}
            onChange={(e) =>
              setProductoObjeto({
                ...productoObjeto,
                denominacion: e.target.value,
              })
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Marca</Form.Label>
          <Form.Control
            type="text"
            value={productoObjeto.marca}
            onChange={(e) =>
              setProductoObjeto({ ...productoObjeto, marca: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Costo</Form.Label>
          <Form.Control
            type="text"
            inputMode="decimal"
            value={costoInput}
            onChange={(e) => {
              const input = e.target.value;
              setCostoInput(input); // ✅ siempre lo guarda, incluso si es '1,' o '1.'
              const valor = parseFloat(input.replace(',', '.'));
              if (!isNaN(valor)) {
                calcularYSetearPrecio(valor, productoObjeto.porcentaje);
              }
            }}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Porcentaje venta</Form.Label>
          <Form.Control
            type="text"
            inputMode="decimal"
            value={porcentajeInput}
            onChange={(e) => {
              const input = e.target.value;
              setPorcentajeInput(input); // ✅ almacena lo que el usuario ve
              const valor = parseFloat(input.replace(',', '.'));
              if (!isNaN(valor)) {
                calcularYSetearPrecio(productoObjeto.costo, valor);
              }
            }}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="text"
            value={productoObjeto.precio}
            readOnly
            className="bg-light"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            value={productoObjeto.stock}
            onChange={(e) =>
              setProductoObjeto({
                ...productoObjeto,
                stock: Number(e.target.value),
              })
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Código</Form.Label>
          <Form.Control
            type="text"
            value={productoObjeto.codigo}
            onChange={(e) =>
              setProductoObjeto({
                ...productoObjeto,
                codigo: e.target.value,
              })
            }
          />
        </Form.Group>

        {/* Imagen como archivo (se guarda en base64) */}
        <Form.Group>
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Form.Group>

        {(previewImageUrl || (productoObjeto.imagen && !selectedImageFile)) && (
          <div className="preview-img-container mt-2">
            <img
              alt="Vista previa"
              src={
                previewImageUrl
                  ? previewImageUrl
                  : `${url}uploads/${productoObjeto.imagen}`
              }
              style={{ maxHeight: "150px", border: "1px solid #ccc" }}
            />
          </div>
        )}

        <Form.Group>
          <Form.Label>Cantidad Vendida</Form.Label>
          <Form.Control
            type="number"
            value={productoObjeto.cantidadVendida}
            readOnly
            className="bg-light"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Categoría</Form.Label>
          <Form.Select
            value={productoObjeto.categoria?.id || 0}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const cat = categorias.find((c) => c.id === selectedId);
              setProductoObjeto({
                ...productoObjeto,
                categoria: cat || new Categoria(),
              });
            }}
          >
            <option value={0}>Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id ?? 0} value={cat.id ?? 0}>
                {cat.denominacion}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Col md={12}>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={productoObjeto.descripcion}
              onChange={(e) =>
                setProductoObjeto({
                  ...productoObjeto,
                  descripcion: e.target.value,
                })
              }
            />
          </Form.Group>
        </Col>

        <div className="form-buttons">
          <Button type="submit" className="btn-lila-prod" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button type="button" className="btn-volver-prod" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormularioProducto;