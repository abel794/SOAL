import React, { useState, useEffect } from "react";
import GraficoBarras from "../GraficoBarras/GraficoBarras";
import GraficoTorta from "../GraficoTorta/GraficoTorta";
import "./ResumenObservaciones.css";

function ResumenObservaciones() {
  const [datosGravedad, setDatosGravedad] = useState(null);
  const [datosTipo, setDatosTipo] = useState(null);
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

        setDatosGravedad({
          Leve: parseFloat(gravedad.porcentajes?.Leve?.replace("%", "") || "0"),
          Moderado: parseFloat(gravedad.porcentajes?.Moderado?.replace("%", "") || "0"),
          Grave: parseFloat(gravedad.porcentajes?.Grave?.replace("%", "") || "0"),
        });

        const tipoArray = Object.entries(tipo).map(([nombre, cantidad]) => ({
          nombre,
          cantidad,
        }));

        setDatosTipo(tipoArray);
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
      <div className="resumen-loading">
        <div className="spinner"></div>
        <p>Cargando estadísticas de observaciones...</p>
      </div>
    );
  }

  if (!datosGravedad || !datosTipo) {
    return (
      <div className="resumen-error">
        <p>No se pudieron cargar los datos de observaciones 😔</p>
      </div>
    );
  }

  return (
    <div className="resumen-container">
      <div className="resumen-card">
        <h5>📊 Observaciones por tipo</h5>
        <div className="grafico-contenedor">
          <GraficoBarras datos={datosTipo} />
        </div>
      </div>

      <div className="resumen-card">
        <h5>⚖️ Porcentaje por gravedad</h5>
        <div className="grafico-contenedor">
          <GraficoTorta datos={datosGravedad} />
        </div>
      </div>
    </div>
  );
}

export default ResumenObservaciones;
