import React, { useEffect, useState } from 'react';

function TablaObservaciones() {
  const [observaciones, setObservaciones] = useState([]);

  // 🔄 Cargar datos desde la API
  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch('http://localhost:3000/api/observaciones/detalles');
        const data = await res.json();

        console.log('Observaciones recibidas:', data);

        // ✅ Verificar si data es un array antes de setear
        if (Array.isArray(data)) {
          setObservaciones(data);
        } else {
          setObservaciones([]); // evita error si llega un objeto tipo {mensaje: "..."}
        }
      } catch (error) {
        console.error('❌ Error al cargar observaciones:', error);
        setObservaciones([]); // si hay error, setear vacío
      }
    }

    cargar();
  }, []);

  // ⭐ Convertir gravedad textual a cantidad de estrellas
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
          {Array.isArray(observaciones) && observaciones.length > 0 ? (
            observaciones.map((obs, i) => (
              <tr key={i}>
                <td>{obs.estudiante}</td>
                <td>{obs.tipo}</td>
                <td>{obs.profesor}</td>
                <td>{obs.fecha}</td>
                <td>{renderEstrellas(gravedadAEstrellas(obs.gravedad))}</td>
                <td>{obs.observacion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No hay observaciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaObservaciones;

