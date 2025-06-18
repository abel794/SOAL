import React from 'react';

function TablaObservaciones() {
  const observaciones = [
    { estudiante: 'laura lopez', tipo: 'academica', fecha: '2023-01-15', gravedad: 2, observacion: 'Llego tarde nueve días' },
    { estudiante: 'pedro ropero', tipo: 'disciplina', fecha: '2023-02-20', gravedad: 4, observacion: 'No entrega las tareas' },
    { estudiante: 'nicolas aguirre', tipo: 'psicologico', fecha: '2023-03-10', gravedad: 1, observacion: 'Llanto constante' },
  ];

  const renderEstrellas = (cantidad) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < cantidad ? 'estrella activa' : 'estrella'}>★</span>
    ));
  };

  return (
    <div className="tabla-container">
      <table className="tabla">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Gravedad</th>
            <th>Observación</th>
          </tr>
        </thead>
        <tbody>
          {observaciones.map((obs, i) => (
            <tr key={i}>
              <td>{obs.estudiante}</td>
              <td>{obs.tipo}</td>
              <td>{obs.fecha}</td>
              <td>{renderEstrellas(obs.gravedad)}</td>
              <td>{obs.observacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaObservaciones;

