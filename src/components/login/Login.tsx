import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!usuario.trim() || !clave.trim()) {
      setError("Ambos campos son obligatorios");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${url}auth/login`,
        { usuario: usuario.trim(), clave },
        { headers: { "Content-Type": "application/json; charset=utf-8" } }
      );

      const resData = response.data;

      if (resData.success) {
        login(resData.data); // Guardamos usuario en contexto
        navigate("/");
      } else {
        setError(resData.message || "Error del servidor");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Error del servidor. Intente nuevamente."
        );
      } else {
        setError("Error de conexión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = () => {
    navigate("/registro");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Iniciar Sesión</h2>

        {error && <p className="login-error">{error}</p>}

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="login-input"
        />

        <div className="password-input-container">
          <input
            type={mostrarClave ? "text" : "password"}
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="login-input"
          />
          <span
            className="toggle-password"
            onClick={() => setMostrarClave(!mostrarClave)}
            role="button"
            tabIndex={0}
          >
            {mostrarClave ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <button
          type="button"
          className="registrar-button"
          onClick={handleRegistro}
        >
          Registrate
        </button>
      </form>
    </div>
  );
};

export default Login;
