import { useEffect, useState } from "react";
import "./GrillaUsuario.css";
import PersonaService from "../../services/PersonaService";
import type Persona from "../../entities/Persona";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { RolesUsuario } from "../../entities/enums/RolesUsuario";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const GrillaUsuario = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [personaAEliminar, setPersonaAEliminar] = useState<Persona | null>(
    null
  );
  const rolesUsuario: RolesUsuario[] = ["ADMIN", "USER"];
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const url = import.meta.env.VITE_API_URL;

  const personaService = new PersonaService();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const personasData = await personaService.getAll(url + "persona");
        setPersonas(personasData);
      } catch (error) {
        console.error("Error al obtener personas:", error);
      }
    };
    fetchPersonas();
  }, []);

  const personasFiltradas = personas.filter(
    (persona) =>
      persona.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
      (persona.user?.rol || "").toLowerCase().includes(filtroRol.toLowerCase())
  );

  const handleDelete = async () => {
    if (personaAEliminar && personaAEliminar.id !== null) {
      try {
        await personaService.delete(`${url}persona`, personaAEliminar.id);

        // ✅ Actualizar el estado filtrando la persona eliminada
        setPersonas(personas.filter((p) => p.id !== personaAEliminar.id));

        console.log("Persona eliminada exitosamente");
        alert("Usuario eliminado correctamente"); // Opcional
      } catch (error: any) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar: " + (error.response?.data || error.message));
      } finally {
        setShowModal(false);
        setPersonaAEliminar(null);
      }
    }
  };

  const confirmarEliminacion = (persona: Persona) => {
    setPersonaAEliminar(persona);
    setShowModal(true);
  };

  return (
    <div className="tabla-usuarios-container">
      <div className="barra-superior-us">
        <button
          className="btn-agregar"
          onClick={() => (window.location.href = "/formUsuario/0")}
        >
          + Agregar Usuario
        </button>
        <input
          type="text"
          placeholder="Filtrar por nombre"
          className="input-filtro-us"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <select
          className="input-filtro-us"
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
        >
          <option value="">Todos los roles</option>
          {rolesUsuario.map((rol) => (
            <option key={rol} value={rol}>
              {rol}
            </option>
          ))}
        </select>
      </div>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personasFiltradas.map((persona) => (
            <tr key={persona.id}>
              <td>{persona.nombre}</td>
              <td>{persona.apellido}</td>
              <td>{persona.email}</td>
              <td>{persona.telefono}</td>
              <td>{persona.user.rol}</td>
              <td>
                <button
                  className="btn-editar-us"
                  onClick={() => navigate("/formUsuario/" + persona.id)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-eliminar-us"
                  onClick={() => confirmarEliminacion(persona)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="modal-confirmacion-eliminacion"
        backdropClassName="modal-backdrop-custom"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar al usuario{" "}
          <strong>
            {personaAEliminar?.nombre} {personaAEliminar?.apellido}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GrillaUsuario;
