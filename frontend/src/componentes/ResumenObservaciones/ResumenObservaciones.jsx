import React, { useState, useEffect } from 'react';
import GraficoBarras from '../GraficoBarras/GraficoBarras';
import GraficoTorta from '../GraficoTorta/GraficoTorta';
import './ResumenObservaciones.css'; // ✅ Estilos externos

function ResumenObservaciones() {
  const [datosGravedad, setDatosGravedad] = useState(null);
  const [datosTipo, setDatosTipo] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const resGravedad = await fetch('http://localhost:3000/api/observaciones/contar/gravedad');
        const gravedad = await resGravedad.json();

        setDatosGravedad({
          Leve: parseFloat(gravedad.porcentajes?.Leve?.replace('%', '') || '0'),
          Moderado: parseFloat(gravedad.porcentajes?.Moderado?.replace('%', '') || '0'),
          Grave: parseFloat(gravedad.porcentajes?.Grave?.replace('%', '') || '0'),
        });

        const resTipo = await fetch('http://localhost:3000/api/observaciones/contar/tipo');
        const tipo = await resTipo.json();

        const tipoArray = Object.entries(tipo).map(([nombre, cantidad]) => ({
          nombre,
          cantidad
        }));

        setDatosTipo(tipoArray);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
      }
    }

    cargarDatos();
  }, []);

  if (!datosGravedad || !datosTipo) {
    return <p className="text-center">Cargando estadísticas de observaciones...</p>;
  }

  return (
    <div className="resumen-container">
      <div className="resumen-card">
        <h5 className="text-primary">Observaciones por tipo</h5>
        <div className="grafico-barras">
          <GraficoBarras datos={datosTipo} />
        </div>
      </div>

      <div className="resumen-card">
        <h5 className="text-primary">Porcentaje por gravedad</h5>
        <div className="grafico-torta">
          <GraficoTorta datos={datosGravedad} />
        </div>
      </div>
    </div>
  );
}

export default ResumenObservaciones;
