// src/componentes/TablaObservaciones/TablaObservaciones.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TablaObservaciones({ limite = 8, onVerTodas }) {
  const [observaciones, setObservaciones] = useState([]);

  useEffect(() => {
    async function cargar() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('⚠️ No hay token en localStorage.');
          setObservaciones([]);
          return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/observaciones/detalles`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 👈 token JWT
          },
          credentials: 'include', // 👈 permite enviar cookies si las hubiera
        });

        if (!res.ok) {
          console.error(`❌ Error HTTP ${res.status}: No autorizado o fallo en servidor.`);
          setObservaciones([]);
          return;
        }

        const data = await res.json();
        setObservaciones(Array.isArray(data) ? data : []);

      } catch (error) {
        console.error('❌ Error al cargar observaciones:', error);
        setObservaciones([]);
      }
    }

    cargar();
  }, []);

  const gravedadAEstrellas = (gravedad) => {
    switch (gravedad) {
      case 'Leve': return 1;
      case 'Moderado': return 3;
      case 'Grave': return 5;
      default: return 0;
    }
  };

  const renderEstrellas = (cantidad) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < cantidad ? 'text-warning' : 'text-muted'}>
        ★
      </span>
    ));

  const ultimasObservaciones = observaciones.slice(-limite);

  return (
    <div className="container mt-4 mb-4 p-3 rounded shadow-sm bg-light">
      <h3 className="text-center mb-3">📋 Últimas Observaciones</h3>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
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
            {ultimasObservaciones.length > 0 ? (
              ultimasObservaciones.map((obs, i) => (
                <tr key={i}>
                  <td>{obs.estudiante}</td>
                  <td>{obs.tipo}</td>
                  <td>{obs.profesor}</td>
                  <td>{obs.fecha}</td>
                  <td>{renderEstrellas(gravedadAEstrellas(obs.gravedad))}</td>
                  <td className="text-start">{obs.observacion}</td>
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

      {observaciones.length > limite && (
        <div className="text-center mt-3">
          <button
            className="btn btn-primary"
            onClick={onVerTodas}
          >
            Ver todas las observaciones
          </button>
        </div>
      )}
    </div>
  );
}

export default TablaObservaciones;
