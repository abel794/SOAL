// src/componentes/TarjetasPorcentajes/TarjetasPorcentajes.jsx
import React from 'react';
import './TarjetasPorcentajes.css';
import GraficoTorta from '../GraficoTorta/GraficoTorta';
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
    <div className="porcentajes">
      {tarjetas.map((item, i) => (
        <div className="porcentaje-card" key={i}>
          <div className="mb-2">{item.icon}</div>
          <h4>{item.title}</h4>
          <h3>{item.count}</h3>
          <div className="grafico-torta">
            <GraficoTorta porcentaje={parseFloat(item.porcentaje)} />
          </div>
          <small>{item.porcentaje}%</small>
        </div>
      ))}
    </div>
  );
}

export default TarjetasPorcentajes;
