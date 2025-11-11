// src/componentes/Coordinador/Common/DetalleCita.jsx
import React from 'react';

export default function DetalleCita({ citaSeleccionada, setVista }) {
  return (
    <div className="container mt-4">
      <h2 className="text-primary">📌 Detalle de la cita</h2>
      <hr />
      {citaSeleccionada ? (
        <div className="card p-3 shadow-sm">
          <p>
            <strong>Estudiante:</strong>{' '}
            {citaSeleccionada.estudiante?.persona?.nombre}{' '}
            {citaSeleccionada.estudiante?.persona?.apellido}
          </p>
          <p>
            <strong>Acudiente:</strong>{' '}
            {citaSeleccionada.acudiente?.persona?.nombre}{' '}
            {citaSeleccionada.acudiente?.persona?.apellido}
          </p>
          <p>
            <strong>Funcionario:</strong>{' '}
            {citaSeleccionada.funcionario?.usuario?.usuario}
          </p>
          <p>
            <strong>Fecha:</strong>{' '}
            {new Date(citaSeleccionada.fecha_cita).toLocaleString()}
          </p>
          <p>
            <strong>Motivo:</strong> {citaSeleccionada.motivo}
          </p>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setVista('Ver citas')}
          >
            🔙 Volver
          </button>
        </div>
      ) : (
        <p>No se ha seleccionado ninguna cita.</p>
      )}
    </div>
  );
}