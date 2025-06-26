import React, { useState, useEffect } from 'react';
import GraficoBarras from './GraficoBarras';
import GraficoTorta from './GraficoTorta';

function ResumenObservaciones() {
  const [datosGravedad, setDatosGravedad] = useState(null);
  const [datosTipo, setDatosTipo] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        // Cargar porcentajes de gravedad
        const resGravedad = await fetch('http://localhost:3001/api/observacion/por-gravedad');
        const gravedad = await resGravedad.json();
        setDatosGravedad({
          Leve: parseFloat(gravedad.leve),
          Moderado: parseFloat(gravedad.moderado),
          Grave: parseFloat(gravedad.grave)
        });

        // Cargar conteo por tipo de observación
        const resTipo = await fetch('http://localhost:3001/api/observacion/por-tipo');
        const tipo = await resTipo.json();
        setDatosTipo(tipo);

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
    <div className="d-flex flex-wrap justify-content-center gap-4">
      {/* Tarjeta de tipo de observación (Gráfico de barras) */}
      <div style={cardStyle}>
        <h5 className="text-primary">Observaciones por tipo</h5>
        <div style={{ width: '100%', height: '250px' }}>
          <GraficoBarras datos={datosTipo} />
        </div>
      </div>

      {/* Tarjeta de gravedad (Gráfico de torta) */}
      <div style={cardStyle}>
        <h5 className="text-primary">Porcentaje por gravedad</h5>
        <div style={{ width: '200px', height: '200px', margin: 'auto' }}>
          <GraficoTorta datos={datosGravedad} />
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#f5f7ff',
  borderRadius: '12px',
  padding: '1rem',
  width: '500px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  textAlign: 'center'
};

export default ResumenObservaciones;
