import React, { useState, useEffect } from 'react';
import GraficoBarras from './GraficoBarras';
import GraficoTorta from './GraficoTorta';

function ResumenObservaciones() {
  const [datosGravedad, setDatosGravedad] = useState(null);
  const [datosTipo, setDatosTipo] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        // 🔹 Cargar datos de gravedad (porcentaje)
        const resGravedad = await fetch('http://localhost:3000/api/observaciones/contar/gravedad');
        const gravedad = await resGravedad.json();

        setDatosGravedad({
          Leve: parseFloat(gravedad.porcentajes?.Leve?.replace('%', '') || '0'),
          Moderado: parseFloat(gravedad.porcentajes?.Moderado?.replace('%', '') || '0'),
          Grave: parseFloat(gravedad.porcentajes?.Grave?.replace('%', '') || '0'),
        });

        // 🔹 Cargar datos por tipo (cantidad)
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

  // ⏳ Espera mientras se cargan los datos
  if (!datosGravedad || !datosTipo) {
    return <p className="text-center">Cargando estadísticas de observaciones...</p>;
  }

  return (
    <div className="d-flex flex-wrap justify-content-center gap-4 p-3">
      {/* 🔹 Gráfico de barras: por tipo */}
      <div style={cardStyle}>
        <h5 className="text-primary">Observaciones por tipo</h5>
        <div style={{ width: '100%', height: '250px' }}>
          <GraficoBarras datos={datosTipo} />
        </div>
      </div>

      {/* 🔹 Gráfico de torta: por gravedad */}
      <div style={cardStyle}>
        <h5 className="text-primary">Porcentaje por gravedad</h5>
        <div style={{ width: '200px', height: '200px', margin: 'auto' }}>
          <GraficoTorta datos={datosGravedad} />
        </div>
      </div>
    </div>
  );
}

// 💅 Estilo reutilizable para las tarjetas
const cardStyle = {
  backgroundColor: '#f5f7ff',
  borderRadius: '12px',
  padding: '1rem',
  width: '500px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  textAlign: 'center'
};

export default ResumenObservaciones;
