import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Persona from "../../entities/Persona";
import PersonaService from "../../services/PersonaService";
import { Button, Form } from "react-bootstrap";
import { PROVINCIAS, type Provincia } from "../../entities/enums/Provincia";
import { LOCALIDADES, type Localidad } from "../../entities/enums/Localidad";
import "./FormularioUsuarios.css";
import Domicilio from "../../entities/Domicilio";
import User from "../../entities/User";
import type { RolesUsuario } from "../../entities/enums/RolesUsuario";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importamos los iconos de react-icons
import axios from "axios";

interface DomicilioBackend {
  id?: number | null;
  calle: string;
  numero: string;
  localidad: number | null;
  provincia: number | null;
}

interface PersonaBackend {
  id?: number | null;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  domicilio: DomicilioBackend;
  user: Partial<User>;
}

const FormularioUsuarios = () => {
  const navigate = useNavigate();
  const { idUsuario = "0" } = useParams();
  const personaId = parseInt(idUsuario);

  const [personaObjeto, setPersonaObjeto] = useState<Persona>(new Persona());
  const [domicilioObjeto, setDomicilioObjeto] = useState<Domicilio>(
    new Domicilio()
  );
  const [userObjeto, setUserObjeto] = useState<User>(new User());
  const [clavePlana, setClavePlana] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false); // Estado para la contraseña
  const [mostrarConfirmarClave, setMostrarConfirmarClave] = useState(false); // Estado para repetir contraseña

  const personaService = new PersonaService();
  const url = import.meta.env.VITE_API_URL;

  const toggleMostrarClave = () => {
    setMostrarClave(!mostrarClave);
  };

  const toggleMostrarConfirmarClave = () => {
    setMostrarConfirmarClave(!mostrarConfirmarClave);
  };

  useEffect(() => {
    const fetchPersona = async () => {
      if (personaId > 0) {
        try {
          const response = await fetch(`${url}persona/${personaId}`);
          if (!response.ok) throw new Error("Error al obtener la persona");
          const data = await response.json();

          setPersonaObjeto(data);

          if (data.domicilio) {
            const domicilioMapeado = {
              ...data.domicilio,
              localidad:
                LOCALIDADES.find((l) => l.code === data.domicilio.localidad)
                  ?.key || "CAPITAL",
              provincia:
                PROVINCIAS.find((p) => p.code === data.domicilio.provincia)
                  ?.key || "MENDOZA",
            };
            setDomicilioObjeto(domicilioMapeado);
          } else {
            setDomicilioObjeto(new Domicilio());
          }

          setUserObjeto(data.user || new User());
          setClavePlana("");
          setConfirmarClave("");
        } catch (error) {
          console.error("Error fetching persona:", error);
        }
      } else {
        setPersonaObjeto(new Persona());
        setDomicilioObjeto(new Domicilio());
        setUserObjeto(new User());
        setClavePlana("");
        setConfirmarClave("");
      }
    };
    fetchPersona();
  }, [personaId]);

  const save = async () => {
    try {
      // 1. Validaciones de contraseña (mantener como están)
      if (
        (!userObjeto.id || userObjeto.id === null) &&
        (!clavePlana || clavePlana.trim() === "")
      ) {
        alert("La contraseña es obligatoria para nuevos usuarios");
        return false;
      }

      if (clavePlana && clavePlana.trim() !== "" && clavePlana.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return false;
      }

      if (
        clavePlana &&
        clavePlana.trim() !== "" &&
        clavePlana !== confirmarClave
      ) {
        alert("Las contraseñas no coinciden");
        return false;
      }

      // 2. Mapear domicilio con códigos numéricos (tipo DomicilioBackend)
      const domicilioParaGuardar: DomicilioBackend = {
        id: domicilioObjeto.id ?? null,
        calle: domicilioObjeto.calle,
        numero: domicilioObjeto.numero,
        localidad:
          LOCALIDADES.find((l) => l.key === domicilioObjeto.localidad)?.code ??
          null,
        provincia:
          PROVINCIAS.find((p) => p.key === domicilioObjeto.provincia)?.code ??
          null,
      };

      // 3. Preparar usuario
      const userParaGuardar: Partial<User> = { ...userObjeto };
      if (clavePlana && clavePlana.trim() !== "") {
        userParaGuardar.clave = clavePlana;
      } else {
        delete (userParaGuardar as any).clave;
      }

      if (typeof userParaGuardar.id === "undefined") {
        userParaGuardar.id = null;
      }

      // 4. Crear el objeto Persona con tipo PersonaBackend
      const personaAEnviar: PersonaBackend = {
        id: personaObjeto.id ?? null,
        nombre: personaObjeto.nombre,
        apellido: personaObjeto.apellido,
        telefono: personaObjeto.telefono,
        email: personaObjeto.email,
        domicilio: domicilioParaGuardar,
        user: userParaGuardar,
      };

      // 5. Llamada al backend (usar 'as any' para bypass de tipos)
      if (!personaAEnviar.id || personaAEnviar.id === null) {
        await personaService.post(url + "persona", personaAEnviar as any);
        alert("Persona creada correctamente.");
      } else {
        await personaService.put(
          url + "persona",
          personaAEnviar.id,
          personaAEnviar as any
        );
        alert("Persona actualizada correctamente.");
      }

      return true;
    } catch (error) {
      console.error("Error al guardar:", error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        alert(
          "Error al guardar: el nombre de usuario ya existe o datos inválidos."
        );
      } else {
        alert("Ocurrió un error al guardar la persona.");
      }
      return false;
    }
  };

  return (
    <div className="formulario-usuarios-container">
      <Form>
        <h1>Formulario de Usuarios</h1>

        <p>Datos personales</p>
        <input
          type="text"
          placeholder="Nombre"
          value={personaObjeto.nombre}
          onChange={(e) =>
            setPersonaObjeto({ ...personaObjeto, nombre: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Apellido"
          value={personaObjeto.apellido}
          onChange={(e) =>
            setPersonaObjeto({ ...personaObjeto, apellido: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={personaObjeto.email}
          onChange={(e) =>
            setPersonaObjeto({ ...personaObjeto, email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={personaObjeto.telefono}
          onChange={(e) =>
            setPersonaObjeto({ ...personaObjeto, telefono: e.target.value })
          }
        />

        <p>Datos de domicilio</p>
        <input
          type="text"
          placeholder="Calle"
          value={domicilioObjeto.calle}
          onChange={(e) =>
            setDomicilioObjeto({ ...domicilioObjeto, calle: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Número"
          value={domicilioObjeto.numero}
          onChange={(e) =>
            setDomicilioObjeto({ ...domicilioObjeto, numero: e.target.value })
          }
        />
        <select
          value={domicilioObjeto.localidad}
          onChange={(e) =>
            setDomicilioObjeto({
              ...domicilioObjeto,
              localidad: e.target.value as Localidad,
            })
          }
        >
          {LOCALIDADES.map((l) => (
            <option key={l.key} value={l.key}>
              {l.nombre}
            </option>
          ))}
        </select>
        <select
          value={domicilioObjeto.provincia}
          onChange={(e) =>
            setDomicilioObjeto({
              ...domicilioObjeto,
              provincia: e.target.value as Provincia,
            })
          }
        >
          {PROVINCIAS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.nombre}
            </option>
          ))}
        </select>

        <p>Datos de inicio de sesión</p>
        <input
          type="text"
          placeholder="Usuario"
          value={userObjeto.usuario}
          onChange={(e) =>
            setUserObjeto({ ...userObjeto, usuario: e.target.value })
          }
        />

        {/* Contraseña */}
        <div className="password-container">
          <input
            type={mostrarClave ? "text" : "password"}
            placeholder={
              personaId > 0
                ? "Dejar vacío para mantener actual"
                : "Contraseña obligatoria"
            }
            value={clavePlana}
            onChange={(e) => setClavePlana(e.target.value)}
          />
          <span className="toggle-password" onClick={toggleMostrarClave}>
            {mostrarClave ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Repetir contraseña */}
        <div className="password-container">
          <input
            type={mostrarConfirmarClave ? "text" : "password"}
            placeholder="Repetir contraseña"
            value={confirmarClave}
            onChange={(e) => setConfirmarClave(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={toggleMostrarConfirmarClave}
          >
            {mostrarConfirmarClave ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <select
          value={userObjeto.rol}
          onChange={(e) =>
            setUserObjeto({
              ...userObjeto,
              rol: e.target.value as RolesUsuario,
            })
          }
        >
          <option value="ADMIN">Administrador</option>
          <option value="USER">Usuario</option>
        </select>

        <button
          type="button"
          onClick={async (e) => {
            e.preventDefault();
            const success = await save();
            if (success) navigate("/grillaUsuarios");
          }}
        >
          Guardar
        </button>
        <Button
          className="btn-volver-us px-4"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
      </Form>
    </div>
  );
};

export default FormularioUsuarios;
