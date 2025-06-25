import React from 'react';
import GraficoTorta from './GraficoTorta';
import { FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';

function TarjetasPorcentajes() {
  const totalObservaciones = 320;

  const tarjetas = [
    {
      title: 'Casos críticos',
      count: 4,
      porcentaje: ((4 / totalObservaciones) * 100).toFixed(1),
      icon: <FaExclamationTriangle size={40} />,
    },
    {
      title: 'Citas programadas',
      count: 8,
      porcentaje: ((8 / totalObservaciones) * 100).toFixed(1),
      icon: <FaCalendarAlt size={40} />,
    },
  ];

  return (
    <div className="porcentajes d-flex flex-wrap justify-content-center gap-3">
      {tarjetas.map((item, i) => (
        <div className="card" style={{ width: '25rem', height: '22rem' }} key={i}>
          <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
            <div className="mb-3">{item.icon}</div>
            <h4 className="card-title">{item.title}</h4>
            <h3 className="card-text">{item.count}</h3>

            {/* Contenedor fijo para el gráfico */}
            <div className="grafico-torta mt-3" style={{ width: '120px', height: '120px' }}>
              <GraficoTorta porcentaje={parseFloat(item.porcentaje)} />
            </div>

            {/* Porcentaje en texto (opcional) */}
            <small className="text-muted mt-2">{item.porcentaje}%</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TarjetasPorcentajes;
