import React, { useState, useEffect } from "react";
import { FaChartBar, FaChartPie, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import GraficoBarras from "../GraficoBarras/GraficoBarras";
import GraficoTorta from "../GraficoTorta/GraficoTorta";
import "./ResumenObservaciones.css";

function ResumenObservaciones() {
  const [datosGravedad, setDatosGravedad] = useState(null);
  const [datosTipo, setDatosTipo] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    totalObservaciones: 0,
    porcentajeLeve: 0,
    porcentajeModerado: 0,
    porcentajeGrave: 0
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resGravedad, resTipo] = await Promise.all([
          fetch("http://localhost:3000/api/coordinador/observaciones/contar/gravedad"),
          fetch("http://localhost:3000/api/coordinador/observaciones/contar/tipo"),
        ]);

        const gravedad = await resGravedad.json();
        const tipo = await resTipo.json();

        const leve = parseFloat(gravedad.porcentajes?.Leve?.replace("%", "") || "0");
        const moderado = parseFloat(gravedad.porcentajes?.Moderado?.replace("%", "") || "0");
        const grave = parseFloat(gravedad.porcentajes?.Grave?.replace("%", "") || "0");

        setDatosGravedad({
          Leve: leve,
          Moderado: moderado,
          Grave: grave,
        });

        const tipoArray = Object.entries(tipo).map(([nombre, cantidad]) => ({
          nombre,
          cantidad,
        }));

        setDatosTipo(tipoArray);

        // Calcular total de observaciones
        const total = tipoArray.reduce((sum, item) => sum + item.cantidad, 0);
        setEstadisticas({
          totalObservaciones: total,
          porcentajeLeve: leve,
          porcentajeModerado: moderado,
          porcentajeGrave: grave
        });

      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="resumen-observaciones-container">
        <div className="resumen-loading">
          <div className="spinner-modern"></div>
          <p className="loading-text">Cargando estadísticas de observaciones...</p>
        </div>
      </div>
    );
  }

  if (!datosGravedad || !datosTipo) {
    return (
      <div className="resumen-observaciones-container">
        <div className="resumen-error">
          <FaExclamationTriangle className="error-icon" />
          <p>No se pudieron cargar los datos de observaciones</p>
          <button className="btn-retry" onClick={() => window.location.reload()}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resumen-observaciones-container">
      {/* Header con estadísticas rápidas */}
      <div className="resumen-header">
        <div className="header-content">
          <h2 className="resumen-titulo">
            <FaChartBar className="titulo-icon" />
            Resumen de Observaciones
          </h2>
          <p className="resumen-subtitulo">Análisis estadístico del comportamiento estudiantil</p>
        </div>
      </div>

      {/* Cards de estadísticas rápidas */}
      <div className="estadisticas-rapidas">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <FaChartBar />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Observaciones</span>
            <span className="stat-value">{estadisticas.totalObservaciones}</span>
          </div>
        </div>

        <div className="stat-card stat-leve">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Leves</span>
            <span className="stat-value">{estadisticas.porcentajeLeve}%</span>
          </div>
        </div>

        <div className="stat-card stat-moderado">
          <div className="stat-icon">
            <FaInfoCircle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Moderadas</span>
            <span className="stat-value">{estadisticas.porcentajeModerado}%</span>
          </div>
        </div>

        <div className="stat-card stat-grave">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Graves</span>
            <span className="stat-value">{estadisticas.porcentajeGrave}%</span>
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="graficos-grid">
        <div className="resumen-card grafico-barras-card">
          <div className="card-header">
            <div className="header-icon">
              <FaChartBar />
            </div>
            <div className="header-text">
              <h3>Observaciones por Tipo</h3>
              <p>Distribución de observaciones según categoría</p>
            </div>
          </div>
          <div className="grafico-contenedor">
            <GraficoBarras datos={datosTipo} />
          </div>
          <div className="card-footer">
            <span className="footer-text">
              Total de {datosTipo.length} categorías registradas
            </span>
          </div>
        </div>

        <div className="resumen-card grafico-torta-card">
          <div className="card-header">
            <div className="header-icon">
              <FaChartPie />
            </div>
            <div className="header-text">
              <h3>Distribución por Gravedad</h3>
              <p>Porcentaje según nivel de severidad</p>
            </div>
          </div>
          <div className="grafico-contenedor">
            <GraficoTorta datos={datosGravedad} />
          </div>
          <div className="card-footer">
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-dot leve"></span>
                <span>Leve</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot moderado"></span>
                <span>Moderado</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot grave"></span>
                <span>Grave</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="info-adicional">
        <div className="info-card">
          <FaInfoCircle className="info-icon" />
          <div className="info-content">
            <h4>Sobre las estadísticas</h4>
            <p>Los datos se actualizan en tiempo real y reflejan todas las observaciones registradas en el sistema.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumenObservaciones;