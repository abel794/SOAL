import React, { useEffect, useState } from 'react';

function TablaObservaciones() {
  const [observaciones, setObservaciones] = useState([]);

  // Cargar datos desde la API
  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch('http://localhost:3001/api/observacion/detalladas');
        const data = await res.json();
        setObservaciones(data);
      } catch (error) {
        console.error('❌ Error al cargar observaciones:', error);
      }
    }

    cargar();
  }, []);

  // Función para renderizar estrellas según gravedad textual
  const gravedadAEstrellas = (gravedad) => {
    switch (gravedad) {
      case 'Leve': return 1;
      case 'Moderado': return 3;
      case 'Grave': return 5;
      default: return 0;
    }
  };

  const renderEstrellas = (cantidad) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < cantidad ? 'estrella activa' : 'estrella'}>★</span>
    ));
  };

  return (
    <div className="tabla-container mt-4">
      <h3 className="mb-3 text-primary">📋 Observaciones Detalladas</h3>
      <table className="tabla">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Tipo</th>
            <th>Profesor</th>
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
              <td>{obs.profesor}</td>
              <td>{obs.fecha}</td>
              <td>{renderEstrellas(gravedadAEstrellas(obs.gravedad))}</td>
              <td>{obs.observacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaObservaciones;

