import React, { useState, useEffect } from 'react';
import './TomarAsistencia.css';

export default function TomarAsistenciaPorGrado() {
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [mensaje, setMensaje] = useState(null);

  // 1. Cargar grados
  useEffect(() => {
    fetch('http://localhost:3000/api/grados')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setGrados(data))
      .catch(() => setMensaje({ tipo: 'error', texto: 'Error al cargar grados.' }));
  }, []);

  // 2. Obtener estudiantes del grado
  const obtenerEstudiantes = (idGrado) => {
    setGradoSeleccionado(idGrado);
    fetch(`http://localhost:3000/api/estudiantes/grado/${idGrado}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setEstudiantes(data);

        const estados = {};
        const obs = {};
        data.forEach(e => {
          estados[e.id_estudiante] = 'Presente';
          obs[e.id_estudiante] = '';
        });
        setAsistencias(estados);
        setObservaciones(obs);
      })
      .catch(() => {
        setEstudiantes([]);
        setMensaje({ tipo: 'error', texto: 'Error al cargar estudiantes.' });
      });
  };

  // 3. Manejar cambios de estado/observación
  const manejarCambioAsistencia = (id, estado) => {
    setAsistencias(prev => ({ ...prev, [id]: estado }));
  };

  const manejarCambioObservacion = (id, texto) => {
    setObservaciones(prev => ({ ...prev, [id]: texto }));
  };

  // 4. Enviar asistencias en lote
  const enviarAsistencias = () => {
    const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const payload = estudiantes.map(est => ({
      id_estudiante: est.id_estudiante,
      id_funcionario: 1, // 🔁 Reemplazar con ID real del profesor
      id_grado_asistencia: parseInt(gradoSeleccionado),
      estado: asistencias[est.id_estudiante],
      observacion: observaciones[est.id_estudiante],
      fecha: fechaHoy
    }));

    fetch('http://localhost:3000/api/asistencias/masivo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        setMensaje({ tipo: 'exito', texto: '✅ Asistencia registrada correctamente.' });
      })
      .catch(() => {
        setMensaje({ tipo: 'error', texto: '❌ No se pudo guardar la asistencia.' });
      });
  };

  // 5. Ocultar mensaje automáticamente
  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(() => setMensaje(null), 3000);
    return () => clearTimeout(timer);
  }, [mensaje]);

  return (
    <div className="asistencia-contenedor">
      <h2>Tomar Asistencia por Grado</h2>

      <label>Selecciona un grado:</label>
      <select
        value={gradoSeleccionado}
        onChange={(e) => obtenerEstudiantes(e.target.value)}
      >
        <option value="">-- Selecciona --</option>
        {grados.map(g => (
          <option key={g.id_grado} value={g.id_grado}>
            {g.nombre_grado || g.nombre}
          </option>
        ))}
      </select>

      {estudiantes.length > 0 && (
        <table className="asistencia-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Asistencia</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map(e => (
              <tr key={e.id_estudiante}>
                <td>{e.nombre} {e.apellido}</td>
                <td>
                  <select
                    value={asistencias[e.id_estudiante]}
                    onChange={(ev) => manejarCambioAsistencia(e.id_estudiante, ev.target.value)}
                  >
                    <option value="Presente">Presente</option>
                    <option value="Ausente">Ausente</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Justificada">Justificada</option>
                  </select>
                </td>
                <td>
                  <textarea
                    rows="1"
                    value={observaciones[e.id_estudiante]}
                    onChange={(ev) => manejarCambioObservacion(e.id_estudiante, ev.target.value)}
                    placeholder="Observaciones..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {estudiantes.length > 0 && (
        <button className="btn-guardar" onClick={enviarAsistencias}>
          Guardar asistencia
        </button>
      )}

      {mensaje && (
        <div className={`mensaje mensaje-${mensaje.tipo}`}>
          <p>{mensaje.texto}</p>
        </div>
      )}
    </div>
  );
}
