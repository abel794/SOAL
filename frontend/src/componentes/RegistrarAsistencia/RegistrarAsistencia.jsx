// Instrucciones de configuración:
// 1. Añade el script de Lordicon en public/index.html:
//    <script src="https://cdn.lordicon.com/lusqsztk.js"></script>
// 2. En src/index.js, importa React y ReactDOM:
//    import React from 'react';
//    import ReactDOM from 'react-dom';
//    import App from './App';
//    ReactDOM.render(<App />, document.getElementById('root'));

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ListarAsistencias from './ListarAsistencias';

const ESTADOS = {
  'Presente': 1,
  'Ausente': 2,
  'Tarde': 3,
  'Justificada': 4,
};

const ORDEN_ESTADOS = ['Presente', 'Ausente', 'Tarde', 'Justificada'];

const RegistrarAsistencia = () => {
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [cargando, setCargando] = useState(false);
  const [vista, setVista] = useState('registrar');
  const [mensaje, setMensaje] = useState(null);

  // Cargar grados
  useEffect(() => {
    axios.get('http://localhost:3000/api/grados')
      .then(res => setGrados(res.data))
      .catch(() => setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los grados.' }));
  }, []);

  // Cargar estudiantes al seleccionar grado
  useEffect(() => {
    if (!gradoSeleccionado) {
      setEstudiantes([]);
      setAsistencias({});
      setObservaciones({});
      return;
    }

    setCargando(true);
    axios.get(`http://localhost:3000/api/estudiantegrados/por-grado/${gradoSeleccionado}`)
      .then(res => {
        setEstudiantes(res.data);
        const inicialAsis = {};
        const inicialObs = {};
        res.data.forEach(e => {
          inicialAsis[e.id_estudiante] = '';
          inicialObs[e.id_estudiante] = '';
        });
        setAsistencias(inicialAsis);
        setObservaciones(inicialObs);
      })
      .catch(() => setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los estudiantes.' }))
      .finally(() => setCargando(false));
  }, [gradoSeleccionado]);

  // Ocultar mensaje automáticamente
  useEffect(() => {
    if (!mensaje) return;
    const timeout = setTimeout(() => setMensaje(null), 3000);
    const handleClick = () => setMensaje(null);
    document.addEventListener('click', handleClick);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', handleClick);
    };
  }, [mensaje]);

  // Cambiar estado asistencia
  const handleEstadoChange = (idEstudiante, estadoNombre) => {
    setAsistencias(prev => ({ ...prev, [idEstudiante]: ESTADOS[estadoNombre] }));
  };

  // Cambiar observación
  const handleObservacionChange = (idEstudiante, texto) => {
    setObservaciones(prev => ({ ...prev, [idEstudiante]: texto }));
  };

  // Guardar asistencias
  const handleSubmit = async () => {
    const fechaHoy = new Date().toISOString().split('T')[0];

    const payload = Object.entries(asistencias)
      .filter(([_, estadoId]) => estadoId)
      .map(([id_estudiante, id_estado_asistencia]) => ({
        id_estudiante: parseInt(id_estudiante, 10),
        id_funcionario: 1,
        id_grado_asistencia: parseInt(gradoSeleccionado, 10),
        id_estado_asistencia,
        observacion: observaciones[id_estudiante],
        fecha: fechaHoy,
      }));

    if (payload.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Debes marcar al menos una asistencia.' });
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/asistencias/masivo', payload);
      setMensaje({ tipo: 'exito', texto: 'Asistencias registradas correctamente.' });
    } catch (err) {
      console.error('❌ Error al registrar asistencias:', err);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al registrar las asistencias.' });
    }
  };

  // Vista Listar
  if (vista === 'listar') {
    return (
      <div className="container-fluid px-2 px-md-5 mt-3">
        <button
          className="btn btn-outline-primary mb-3 w-100 w-md-auto"
          onClick={() => setVista('registrar')}
        >
          ⬅ Volver a Registrar Asistencia
        </button>
        <ListarAsistencias />
      </div>
    );
  }

  // Vista Registrar
  return (
    <div className="container-fluid px-2 px-md-5 mt-3">
      <h2 className="text-primary mb-4 text-center" style={{ fontSize: '2rem' }}>
        Registrar Asistencia por Grado
      </h2>

      {/* Selector de grado */}
      <div className="mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <label className="form-label">Selecciona un grado:</label>
        <select
          className="form-select"
          value={gradoSeleccionado}
          onChange={e => setGradoSeleccionado(e.target.value)}
        >
          <option value="">-- Elige un grado --</option>
          {grados.map(grado => (
            <option key={grado.id_grado} value={grado.id_grado}>
              {grado.nombre_grado}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de estudiantes */}
      {cargando ? (
        <p className="text-center">Cargando estudiantes...</p>
      ) : estudiantes.length > 0 ? (
        <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Estudiante</th>
                <th>Estado</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map(est => (
                <tr key={est.id_estudiante}>
                  <td style={{ minWidth: '180px' }}>
                    {`${est.nombre} ${est.apellido} : ${est.numero_documento}`}
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={
                        Object.keys(ESTADOS).find(
                          k => ESTADOS[k] === asistencias[est.id_estudiante]
                        ) || ''
                      }
                      onChange={e => handleEstadoChange(est.id_estudiante, e.target.value)}
                    >
                      <option value="">-- Selecciona --</option>
                      {ORDEN_ESTADOS.map(estado => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Observación..."
                      className="form-control"
                      value={observaciones[est.id_estudiante] || ''}
                      onChange={e => handleObservacionChange(est.id_estudiante, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : gradoSeleccionado ? (
        <p className="text-center text-muted">No hay estudiantes en este grado.</p>
      ) : null}

      {/* Botones */}
      <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mt-4">
        {estudiantes.length > 0 && (
          <button className="btn btn-primary w-100 w-md-auto" onClick={handleSubmit}>
            Guardar Asistencia
          </button>
        )}
        <button
          className="btn btn-secondary w-100 w-md-auto"
          onClick={() => setVista('listar')}
        >
          📋 Listar Asistencias
        </button>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div className={`mensaje-card mensaje-${mensaje.tipo}`}>
          {mensaje.tipo === 'exito' ? (
            <lord-icon src="/icons/checkmark.json" trigger="loop" delay="500" style={{ width: '90px', height: '90px' }} />
          ) : (
            <lord-icon src="/icons/error.json" trigger="loop" delay="500" style={{ width: '90px', height: '90px' }} />
          )}
          <p className="mensaje-texto">{mensaje.texto}</p>
        </div>
      )}
    </div>
  );
};

export default RegistrarAsistencia;
