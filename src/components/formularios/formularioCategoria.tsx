import { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Categoria from "../../entities/Categoria";
import CategoriaService from "../../services/CategoriaService";
import "./FormularioCategoria.css";

const FormularioCategoria = () => {
  const navigate = useNavigate();
  const { idCategoria = "0" } = useParams();
  const categoriaId = parseInt(idCategoria);
  const [categoria, setCategoria] = useState<Categoria>(new Categoria());
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categoriaService = new CategoriaService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCategoria = async () => {
      if (categoriaId > 0) {
        try {
          const response = await fetch(`${url}categoria/${categoriaId}`, {
            signal,
          });
          if (!response.ok) throw new Error("No se pudo cargar la categoría");
          const data = await response.json();
          setCategoria(data);
        } catch (err) {
          if (!signal.aborted) {
            setError(err instanceof Error ? err.message : "Error al cargar");
          }
        }
      } else {
        setCategoria(new Categoria());
      }
    };

    fetchCategoria();

    return () => controller.abort();
  }, [categoriaId, url]);

  const validate = () => {
    if (!categoria.denominacion || categoria.denominacion.trim() === "") {
      setError("La denominación es obligatoria");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    setError(null);

    try {
      if (categoriaId > 0 && categoria.id) {
        const categoriaDTO = {
          id: categoria.id,
          denominacion: categoria.denominacion,
        };
        await categoriaService.put(
          `${url}categoria`,
          categoria.id,
          categoriaDTO
        );
        alert("Categoría actualizada correctamente");
      } else {
        await categoriaService.post(`${url}categoria`, categoria);
        alert("Categoría creada correctamente");
      }
      navigate("/grillaCategorias");
    } catch (err) {
      setError("No se pudo guardar la categoría. Intenta nuevamente.");
      console.error("Error al guardar categoría", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="form-cat-container">
      <Form onSubmit={handleSubmit} className="formulario-categoria shadow-sm">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <h3 className="titulo-categoria">Formulario de Categoría</h3>

        <Form.Group controlId="denominacion">
          <Form.Label>Denominación</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: Navidad"
            value={categoria.denominacion}
            onChange={(e) =>
              setCategoria({ ...categoria, denominacion: e.target.value })
            }
          />
        </Form.Group>

        <div className="form-buttons">
          <Button
            type="submit"
            className="btn-guardar-categoria"
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            className="btn-cancelar-categoria"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormularioCategoria;
