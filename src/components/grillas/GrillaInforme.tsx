import { useState } from "react";
import CierreCajaService from "../../services/CierreCajaService";
import "./grillaInforme.css";

const GrillaInforme = () => {
  const url = import.meta.env.VITE_API_URL;
  const cierreCajaService = new CierreCajaService();
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [fechaDiaria, setFechaDiaria] = useState("");
  const [añoMensual, setAñoMensual] = useState(new Date().getFullYear());
  const [mesMensual, setMesMensual] = useState(new Date().getMonth() + 1);

  const handleCierreHoy = () => {
    cierreCajaService.descargarCierreCajaHoy(url + "cierre-caja");
  };

  const handleCierreEntreFechas = () => {
    if (!desde || !hasta) {
      alert("Debes seleccionar ambas fechas");
      return;
    }
    cierreCajaService.descargarCierreCajaEntreFechas(
      url + "cierre-caja",
      desde,
      hasta
    );
  };

  const handleInformeDiarioDetalle = () => {
    if (!fechaDiaria) {
      alert("Debes seleccionar una fecha");
      return;
    }
    cierreCajaService.descargarInformeDiarioDetalle(
      url + "cierre-caja",
      fechaDiaria
    );
  };

  const handleInformeDiarioHoy = () => {
    cierreCajaService.descargarInformeDiarioHoy(url + "cierre-caja");
  };

  const handleInformeMensualDetalle = () => {
    if (!añoMensual || !mesMensual) {
      alert("Debes seleccionar año y mes");
      return;
    }
    cierreCajaService.descargarInformeMensualDetalle(
      url + "cierre-caja",
      añoMensual,
      mesMensual
    );
  };

  const handleInformeMensualActual = () => {
    cierreCajaService.descargarInformeMensualActual(url + "cierre-caja");
  };

  const generarOpcionesAños = () => {
    const añoActual = new Date().getFullYear();
    const años = [];
    for (let i = añoActual - 5; i <= añoActual + 2; i++) {
      años.push(i);
    }
    return años;
  };

  const meses = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" }
  ];

  return (
    <div className="grilla-informe-container">
      <h1>Informes de Cierre de Caja</h1>

      <div className="grid-informe">
        {/* Columna 1: Cierres de Caja */}
        <div className="columna">
          <h3>📊 Cierres de Caja</h3>
          <button onClick={handleCierreHoy}>📅 Cierre del día</button>

          <hr style={{ width: '80%', margin: '1rem 0', borderColor: '#ccc' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <label>
              Desde:
              <input
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </label>
            <label>
              Hasta:
              <input
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </label>
            <button onClick={handleCierreEntreFechas}>
              📆 Cierre entre fechas
            </button>
          </div>
        </div>


        {/* Columna 2: Informes Diarios Detallados */}
        <div className="columna">
          <h3>📋 Informes Diarios Detallados</h3>
          <button onClick={handleInformeDiarioHoy}>
            📝 Informe detallado de hoy
          </button>
          <hr style={{ width: '80%', margin: '1rem 0', borderColor: '#ccc' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <label>
              Seleccionar día:
              <input
                type="date"
                value={fechaDiaria}
                onChange={(e) => setFechaDiaria(e.target.value)}
              />
            </label>
            <button onClick={handleInformeDiarioDetalle}>
              📋 Informe detallado
              <br />del día seleccionado
            </button>
          </div>
        </div>

        {/* Columna 3: Informes Mensuales Detallados */}
        <div className="columna">
          <h3>📈 Informes Mensuales Detallados</h3>
          <button onClick={handleInformeMensualActual}>
            📅 Informe mensual actual
          </button>
          <hr style={{ width: '80%', margin: '1rem 0', borderColor: '#ccc' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <label>
              Año:
              <select
                value={añoMensual}
                onChange={(e) => setAñoMensual(Number(e.target.value))}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  fontSize: '1rem'
                }}
              >
                {generarOpcionesAños().map((año) => (
                  <option key={año} value={año}>
                    {año}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Mes:
              <select
                value={mesMensual}
                onChange={(e) => setMesMensual(Number(e.target.value))}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  fontSize: '1rem'
                }}
              >
                {meses.map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={handleInformeMensualDetalle}>
              📊 Informe detallado
              <br /> del mes seleccionado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrillaInforme;