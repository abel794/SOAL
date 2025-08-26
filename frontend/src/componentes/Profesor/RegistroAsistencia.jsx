import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistroAsistencia = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
  const [estadoAsistencia, setEstadoAsistencia] = useState('');
  const [observacion, setObservacion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [estados, setEstados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Traer estudiantes asignados al profesor (asumiendo profesorId en localStorage)
    const fetchEstudiantes = async () => {
      try {
        const profesorId = localStorage.getItem('profesorId');
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/profesor/estudiantes', {
          params: { profesorId },
          headers: { Authorization: `Bearer ${token}` }
        });
        setEstudiantes(res.data.data || res.data); // ajustar según estructura backend
      } catch (error) {
        console.error("Error cargando estudiantes:", error);
      }
    };

    // Traer estados de asistencia para el dropdown
    const fetchEstados = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/estadoAsistencia');
        setEstados(res.data);
      } catch (error) {
        console.error("Error cargando estados de asistencia:", error);
      }
    };

    fetchEstudiantes();
    fetchEstados();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const profesorId = localStorage.getItem('profesorId');
      if (!estudianteSeleccionado || !estadoAsistencia) {
        setMensaje("Por favor, selecciona estudiante y estado.");
        return;
      }

      // Enviar registro
      const res = await axios.post('http://localhost:3000/api/asistencias', {
        id_estudiante: estudianteSeleccionado,
        id_funcionario: profesorId,
        id_estado_asistencia: estadoAsistencia,
        observacion,
        fecha
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 201) {
        setMensaje("Asistencia registrada correctamente.");
        // Limpiar formulario
        setEstudianteSeleccionado('');
        setEstadoAsistencia('');
        setObservacion('');
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      setMensaje("Error al registrar asistencia.");
    }
  };

  return (
    <div>
      <h3>Registrar Asistencia Individual</h3>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={manejarEnvio}>
        <label>Estudiante:</label>
        <select
          value={estudianteSeleccionado}
          onChange={(e) => setEstudianteSeleccionado(e.target.value)}
        >
          <option value="">-- Selecciona un estudiante --</option>
          {estudiantes.map((e) => (
            <option key={e.id_estudiante} value={e.id_estudiante}>
              {e.persona?.nombre} {e.persona?.apellido}
            </option>
          ))}
        </select>

        <label>Estado Asistencia:</label>
        <select
          value={estadoAsistencia}
          onChange={(e) => setEstadoAsistencia(e.target.value)}
        >
          <option value="">-- Selecciona estado --</option>
          {estados.map((estado) => (
            <option key={estado.id_estado_asistencia} value={estado.id_estado_asistencia}>
              {estado.nombre}
            </option>
          ))}
        </select>

        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <label>Observación:</label>
        <textarea
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          placeholder="Opcional"
        />

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroAsistencia;
