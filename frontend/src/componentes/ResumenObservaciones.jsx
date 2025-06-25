import React from 'react';
import GraficoBarras from './GraficoBarras';
import GraficoTorta from './GraficoTorta';

function ResumenObservaciones() {
  const datosPorTipo = {
    Disciplina: 12,
    Académica: 8,
    Psicológica: 5
  };

  const datosPorGravedad = {
    Leve: 6,
    Moderado: 11,
    Grave: 8
  };

  return (
    <div className="d-flex flex-wrap justify-content-center gap-4">
      {/* Tarjeta de tipo */}
      <div style={cardStyle}>
        <h5 className="text-primary">Observaciones por tipo</h5>
        <div style={{ width: '100%', height: '200px' }}>
          <GraficoBarras datos={datosPorTipo} />
        </div>
      </div>

      {/* Tarjeta de gravedad */}
      <div style={cardStyle}>
        <h5 className="text-primary">Gravedad</h5>
        <div style={{ width: '180px', height: '180px', margin: 'auto' }}>
          <GraficoTorta datos={datosPorGravedad} />
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#f5f7ff',
  borderRadius: '12px',
  padding: '1rem',
  width: '520px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  textAlign: 'center'
};

export default ResumenObservaciones;
