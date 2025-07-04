import React, { useState, useEffect } from 'react';
import './TomarAsistencia.css';

export default function TomarAsistenciaPorGrado() {
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [observaciones, setObservaciones] = useState({});

  // Simulación de grados
  useEffect(() => {
    const gradosSimulados = [
      { id_grado: 1, nombre: '3A' },
      { id_grado: 2, nombre: '4B' },
      { id_grado: 3, nombre: '5C' }
    ];
    setGrados(gradosSimulados);
  }, []);

  // Al seleccionar un grado, carga estudiantes simulados
  const obtenerEstudiantes = (idGrado) => {
    setGradoSeleccionado(idGrado);
    const estudiantesSimulados = {
      1: [
        { id_estudiante: 101, nombre: 'Laura Gómez' },
        { id_estudiante: 102, nombre: 'Pedro Díaz' }
      ],
      2: [
        { id_estudiante: 201, nombre: 'Ana Torres' },
        { id_estudiante: 202, nombre: 'Juan Pérez' }
      ],
      3: [
        { id_estudiante: 301, nombre: 'Carlos Ríos' },
        { id_estudiante: 302, nombre: 'Daniela Suárez' }
      ]
    };

    const lista = estudiantesSimulados[idGrado] || [];
    setEstudiantes(lista);

    const estadoInicial = {};
    const obsInicial = {};
    lista.forEach(e => {
      estadoInicial[e.id_estudiante] = 'Presente';
      obsInicial[e.id_estudiante] = '';
    });
    setAsistencias(estadoInicial);
    setObservaciones(obsInicial);
  };

  const manejarCambioAsistencia = (id, estado) => {
    setAsistencias(prev => ({ ...prev, [id]: estado }));
  };

  const manejarCambioObservacion = (id, texto) => {
    setObservaciones(prev => ({ ...prev, [id]: texto }));
  };

  const enviarAsistencias = () => {
    const payload = estudiantes.map(est => ({
      id_estudiante: est.id_estudiante,
      id_funcionario: 1, // Simulado
      id_grado_asistencia: gradoSeleccionado,
      estado: asistencias[est.id_estudiante],
      observacion: observaciones[est.id_estudiante]
    }));

    console.log("📤 Enviando asistencia:", payload);
    alert("✅ Asistencia registrada (simulado)");
  };

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
          <option key={g.id_grado} value={g.id_grado}>{g.nombre}</option>
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
                <td>{e.nombre}</td>
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
    </div>
  );
}
