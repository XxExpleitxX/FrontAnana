import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Promocion from "../../entities/Promocion";
import PromocionService from "../../services/PromocionService";
import { Button, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import "./FormularioPromocion.css"

const FormularioPromocion = () => {
    const [promocion, setPromocion] = useState<Promocion>(new Promocion());
    const navigate = useNavigate();
    const promocionService = new PromocionService();
    const url = import.meta.env.VITE_API_URL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPromocion((prev) => ({
            ...prev,
            [name]: name.includes("fecha") ? new Date(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const nuevaPromocion = await promocionService.post(url + "promocion", promocion);
            navigate(`/detallePromocion/${nuevaPromocion.id}`);
        } catch (error) {
            console.error("Error al crear la promoción:", error);
        }
    };

return (
  <div className="contenedor-promocion">
    <div className="formulario">
      <h2 className="titulo-formulario">Nueva Promoción</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Denominación</FormLabel>
          <FormControl
            type="text"
            name="denominacion"
            value={promocion.denominacion}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Descripción</FormLabel>
          <FormControl
            type="text"
            name="descripcion"
            value={promocion.descripcion}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Precio Promocional</FormLabel>
          <FormControl
            type="number"
            name="precioPromocional"
            value={promocion.precioPromocional}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Fecha de Inicio</FormLabel>
          <FormControl
            type="date"
            name="fechaInicio"
            value={promocion.fechaInicio.toISOString().split('T')[0]}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Fecha de Fin</FormLabel>
          <FormControl
            type="date"
            name="fechaFin"
            value={promocion.fechaFin.toISOString().split('T')[0]}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <div className="contenedor-boton-centrado">
          <Button type="submit" className="btn-crear-promocion">
            Crear Promoción
          </Button>
        </div>
      </Form>
    </div>
  </div>
);

};

export default FormularioPromocion;
