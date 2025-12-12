import React, { useEffect, useState } from 'react';
import './CasosCriticos.css';

function CasosCriticos() {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const casosPorPagina = 5;

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/observaciones/serias/listar`)
      .then(res => res.json())
      .then(data => {
        console.log('📡 Datos recibidos desde la API:', data);
        if (Array.isArray(data)) {
          setCasos(data);
        } else if (Array.isArray(data.data)) {
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

  const indiceUltimoCaso = paginaActual * casosPorPagina;
  const indicePrimerCaso = indiceUltimoCaso - casosPorPagina;
  const casosActuales = casos.slice(indicePrimerCaso, indiceUltimoCaso);

  const totalPaginas = Math.ceil(casos.length / casosPorPagina);

  const cambiarPagina = (numero) => {
    if (numero < 1 || numero > totalPaginas) return;
    setPaginaActual(numero);
  };

  if (loading) return <p className="mt-4 text-center">⏳ Cargando casos críticos...</p>;

  return (
    <div className="container mt-4">
      <h2>Casos Críticos</h2>
      {casos.length === 0 ? (
        <p className="mt-3">✅ No hay casos críticos registrados.</p>
      ) : (
        <>
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
              {casosActuales.map((c, i) => (
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

          {/* 🔹 Paginación con botones numerados y color dinámico */}
          <div className="pagination mt-3" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
              « Anterior
            </button>

            {[...Array(totalPaginas)].map((_, num) => {
              const numero = num + 1;
              return (
                <button
                  key={numero}
                  onClick={() => cambiarPagina(numero)}
                  className={paginaActual === numero ? 'activo' : ''}
                  style={{
                    backgroundColor: paginaActual === numero ? '#004aad' : '#f5f5f5',
                    color: paginaActual === numero ? '#fff' : '#000',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    transition: '0.2s ease-in-out',
                  }}
                >
                  {numero}
                </button>
              );
            })}

            <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
              Siguiente »
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CasosCriticos;
