import React, { useEffect, useState } from 'react';

function CasosCriticos() {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch('http://localhost:3000/api/observaciones/criticas')
    .then(res => res.json())
    .then(data => {
      console.log('📡 Datos recibidos desde la API:', data); // <-- Necesitamos ver esto completo
      
      if (Array.isArray(data)) {
        setCasos(data);
      } else if (Array.isArray(data.data)) { // por si la API devuelve un objeto con "data"
        setCasos(data.data);
      } else {
        setCasos([]);
      }
    })
    .catch(err => {
      console.error('❌ Error:', err);
      setCasos([]);
    })
    .finally(() => setLoading(false));
}, []);


  if (loading) return <p className="mt-4 text-center">⏳ Cargando casos críticos...</p>;

  return (
    <div className="container mt-4">
      <h2>Casos Críticos</h2>
      {casos.length === 0 ? (
        <p className="mt-3">✅ No hay casos críticos registrados.</p>
      ) : (
        <table className="table table-striped mt-3">
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
            {casos.map((c, i) => (
              <tr key={i}>
                <td>{c.estudiante ?? 'Sin nombre'}</td>
                <td>{c.tipo ?? 'N/A'}</td>
                <td>{c.fecha ?? 'N/A'}</td>
                <td>{c.gravedad ?? 'N/A'}</td>
                <td>{c.observacion ?? 'Sin detalle'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CasosCriticos;
