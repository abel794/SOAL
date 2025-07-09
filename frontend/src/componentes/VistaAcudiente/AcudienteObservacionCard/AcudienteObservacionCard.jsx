import React from 'react';
import './AcudienteObservacionCard.css';

function AcudienteObservacionCard({ observacion }) {
  return (
    <div className="card">
      <div className="card-header">
        <span><strong>Categoría:</strong> {observacion.categoria}</span>
        <span><strong>Grado:</strong> {observacion.grado}</span>
        <span className="fecha">{observacion.fecha}</span>
      </div>
      <h3>{observacion.estudiante}</h3>
      <p>{observacion.descripcion}</p>
    </div>
  );
}

export default AcudienteObservacionCard;
