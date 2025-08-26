// src/componentes/Profesor/ListaAsistencias.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListaAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/estadoAsistencia');
        setEstados(res.data);
      } catch (error) {
        console.error("Error cargando estados:", error);
      }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    const fetchAsistencias = async () => {
      setLoading(true);
      try {
        const profesorId = localStorage.getItem('profesorId');
        const token = localStorage.getItem('token');

        const params = {};
        if (filtroFecha) params.fecha = filtroFecha;
        if (filtroEstado) params.estado = filtroEstado;
        params.id_funcionario = profesorId; // filtro para asistencias del profesor

        const res = await axios.get('http://localhost:5000/api/asistencias', {
          params,
          headers: { Authorization: `Bearer ${token}` }
        });
        setAsistencias(res.data);
      } catch (error) {
        console.error("Error al cargar asistencias:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsistencias();
  }, [filtroFecha, filtroEstado]);

  return (
    <div>
      <h3>Listado de Asistencias</h3>

      <div>
        <label>Filtrar por fecha:</label>
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />

        <label>Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos</option>
          {estados.map((e) => (
            <option key={e.id_estado_asistencia} value={e.nombre}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : asistencias.length === 0 ? (
        <p>No hay asistencias para mostrar.</p>
      ) : (
        <table border="1" style={{ width: '100%', marginTop: 10 }}>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <tr key={a.id_asistencia || a.id}>
                <td>{a.estudiante?.persona?.nombre} {a.estudiante?.persona?.apellido}</td>
                <td>{a.fecha}</td>
                <td>{a.estadoAsistencia?.nombre || a.estado_asistencia?.nombre}</td>
                <td>{a.observacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaAsistencias;
