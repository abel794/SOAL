import React, { useState } from 'react';

function HistorialObservaciones() {
  const [nombreBuscado, setNombreBuscado] = useState('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // ✅ success o error
  const [historial, setHistorial] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');

  // 🔹 Buscar estudiante
  const manejarBusqueda = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/historial/buscar?nombre=${nombreBuscado}`
      );
      const data = await res.json();

      if (res.ok && data.length > 0) {
        setHistorial(data);
        setNombre(nombreBuscado);
        setMensaje('');
      } else {
        setHistorial([]);
        setNombre(nombreBuscado);
        setTipoMensaje('error');
        setMensaje('❌ No se encontró historial para este estudiante.');
      }
    } catch (error) {
      console.error('⚠️ Error en la búsqueda:', error);
      setTipoMensaje('error');
      setMensaje('⚠️ Error al conectar con el servidor.');
    }
  };

  // 🔹 Activar modo edición
  const iniciarEdicion = (obs) => {
    if (!obs || !obs.id_observacion) {
      console.error('❌ Observación inválida:', obs);
      return;
    }
    setEditando(obs.id_observacion);
    setNuevaDescripcion(obs.descripcion);
  };

  // 🔹 Guardar cambios (PUT)
  const guardarEdicion = async (idObservacion) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/observaciones/${idObservacion}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            descripcion: nuevaDescripcion,
            descripcion_modificacion: `Se actualizó: ${nuevaDescripcion}`,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setTipoMensaje('success');
        setMensaje('✅ Observación actualizada correctamente.');
        setEditando(null);
        manejarBusqueda(); // Refresca historial
      } else {
        setTipoMensaje('error');
        setMensaje(data.error || '❌ Error al actualizar la observación.');
      }
    } catch (error) {
      console.error('Error al guardar edición:', error);
      setTipoMensaje('error');
      setMensaje('❌ Error al conectar con el servidor.');
    }
  };

  return (
    <div className="container mt-4">
      {/* Buscar estudiante */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar estudiante por nombre"
          value={nombreBuscado}
          onChange={(e) => setNombreBuscado(e.target.value)}
        />
        <button className="btn btn-primary" onClick={manejarBusqueda}>
          Buscar estudiante
        </button>
      </div>

      <h2 className="mb-3">Historial de observaciones de {nombre}</h2>

      {/* ✅ Mostrar mensaje en pantalla */}
      {mensaje && (
        <div
          className={`alert ${
            tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'
          }`}
          role="alert"
        >
          {mensaje}
        </div>
      )}

      {/* Tabla de historial */}
      {historial.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Fecha modificación</th>
                <th>Descripción modificación</th>
                <th>Observación original</th>
                <th>Gravedad</th>
                <th>Fecha observación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((obs, i) => (
                <React.Fragment key={`obs-${i}`}>
                  {/* Fila principal de la observación */}
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      {editando === obs.id_observacion ? (
                        <input
                          type="text"
                          className="form-control"
                          value={nuevaDescripcion}
                          onChange={(e) => setNuevaDescripcion(e.target.value)}
                        />
                      ) : (
                        obs.descripcion
                      )}
                    </td>
                    <td>{obs.gravedad?.nombre ?? 'Sin gravedad'}</td>
                    <td>{obs.fecha}</td>
                    <td>
                      {editando === obs.id_observacion ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => guardarEdicion(obs.id_observacion)}
                          >
                            💾 Guardar
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditando(null)}
                          >
                            ❌ Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => iniciarEdicion(obs)}
                        >
                          ✏️ Editar
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Filas de historial */}
                  {obs.historial && obs.historial.length > 0 ? (
                    obs.historial.map((h, idx) => (
                      <tr key={`hist-${i}-${idx}`} className="table-light">
                        <td>{h.fecha_modificacion.split('T')[0]}</td>
                        <td>{h.descripcion_modificacion}</td>
                        <td colSpan={4}></td>
                      </tr>
                    ))
                  ) : (
                    <tr key={`hist-empty-${i}`} className="table-light">
                      <td colSpan={6} className="text-center">
                        Sin historial
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistorialObservaciones;
