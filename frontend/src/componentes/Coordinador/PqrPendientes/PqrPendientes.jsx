// 📂 src/components/Dashboard/PqrPendientes.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PqrPendientes = () => {
  const [pqrs, setPqrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPqrs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/coordinador/dashboard/pqrs/SinResponder`);
      
      // Validar respuesta del servidor
      if (response.data && Array.isArray(response.data.pqrs)) {
        setPqrs(response.data.pqrs);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      console.error('Error al obtener PQR pendientes:', err);
      setError(err.response?.data?.message || err.message || 'No se pudieron cargar las PQR pendientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPqrs();
  }, []);

  // Función para renderizar información de persona con validación
  const renderPersonaInfo = (persona, label) => {
    if (!persona || !persona.persona) {
      return `Sin información de ${label}`;
    }

    const { nombre, apellido, correo, telefono } = persona.persona;
    return (
      <>
        {nombre || 'N/A'} {apellido || 'N/A'} <br />
        {correo || 'Sin correo'} <br />
        {telefono || 'Sin teléfono'}
      </>
    );
  };

  if (loading) return <div className="cargando">Cargando PQR pendientes...</div>;
  if (error) return <div className="error-alerta">{error}</div>;

  return (
    <div className="pqr-container">
      <h2>PQR Pendientes ({pqrs.length})</h2>
      
      {pqrs.length === 0 ? (
        <p>No hay PQR pendientes por atender</p>
      ) : (
        <table className="tabla-pqr">
          <thead>
            <tr>
              <th>ID PQR</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Estudiante</th>
              <th>Acudiente</th>
            </tr>
          </thead>
          <tbody>
            {pqrs.map(pqr => (
              <tr key={pqr.id_pqr}>
                <td>{pqr.id_pqr}</td>
                <td>{pqr.id_tipo_pqr || 'N/A'}</td>
                <td>{pqr.descripcion || 'Sin descripción'}</td>
                <td>{pqr.fecha ? new Date(pqr.fecha).toLocaleDateString() : 'Fecha no disponible'}</td>
                <td>{renderPersonaInfo(pqr.estudiante, 'estudiante')}</td>
                <td>{renderPersonaInfo(pqr.acudiente, 'acudiente')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PqrPendientes;