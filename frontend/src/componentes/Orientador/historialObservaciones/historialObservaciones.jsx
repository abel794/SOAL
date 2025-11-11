import React, { useState, useCallback } from 'react';
import './HistorialObservaciones.css';
import ModalMensaje from '../../ui/ModalMensaje';

// 🔒 Cerrar sesión (mantenido por compatibilidad)
export const cerrarSesion = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) throw new Error('VITE_API_URL no está definido');

    const res = await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      console.error('❌ Error al cerrar sesión:', res.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error al cerrar sesión en backend:', error);
    return false;
  }
};

function HistorialObservaciones({ token }) {
  const [nombreBuscado, setNombreBuscado] = useState('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Acción del modal de confirmación
  const ejecutarAccion = useCallback(() => {
    console.log("Acción confirmada desde el modal ✅");
    setShowConfirm(false);
  }, []);

  // 🔍 Buscar estudiante optimizado
  const manejarBusqueda = useCallback(async () => {
    if (!nombreBuscado.trim()) {
      setMensaje({
        tipo: 'error',
        texto: '❌ Por favor ingresa un nombre para buscar',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/coordinador/historialObservacion/buscar?nombre=${encodeURIComponent(nombreBuscado)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setHistorial([]);
        setNombre(nombreBuscado);
        setMensaje({
          tipo: 'error',
          texto: `❌ No se encontró historial para "${nombreBuscado}"`,
        });
        return;
      }

      const data = await res.json();

      if (data.length > 0) {
        setHistorial(data);
        setNombre(nombreBuscado);
        setMensaje(null);
      } else {
        setHistorial([]);
        setNombre(nombreBuscado);
        setMensaje({
          tipo: 'error',
          texto: `❌ No se encontró historial para "${nombreBuscado}"`,
        });
      }
    } catch (error) {
      console.error('⚠️ Error en la búsqueda:', error);
      setMensaje({
        tipo: 'error',
        texto: '⚠️ Error al conectar con el servidor.',
      });
    } finally {
      setLoading(false);
    }
  }, [nombreBuscado, token]);

  // ✏️ Iniciar edición optimizado
  const iniciarEdicion = useCallback((obs) => {
    if (!obs || !obs.id_observacion) {
      console.error('❌ Observación inválida:', obs);
      return;
    }
    setEditando(obs.id_observacion);
    setNuevaDescripcion(obs.descripcion);
  }, []);

  // 💾 Guardar edición optimizado
  const guardarEdicion = useCallback(async (idObservacion) => {
    if (!nuevaDescripcion.trim()) {
      setMensaje({
        tipo: 'error',
        texto: '❌ La descripción no puede estar vacía.',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/coordinador/observaciones/${idObservacion}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            descripcion: nuevaDescripcion,
            descripcion_modificacion: `Se actualizó: ${nuevaDescripcion}`,
          }),
        }
      );

      if (!res.ok) {
        let errorMsg = `❌ Error al guardar edición (${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData?.message) errorMsg += `: ${errorData.message}`;
        } catch {}
        setMensaje({ tipo: 'error', texto: errorMsg });
        return;
      }

      const data = await res.json();
      setMensaje({
        tipo: 'success',
        texto: '💾 Observación actualizada correctamente.',
      });
      setEditando(null);

      // 🔁 Actualizar historial local
      setHistorial((prev) =>
        prev.map((obs) =>
          obs.id_observacion === idObservacion
            ? {
                ...obs,
                descripcion: nuevaDescripcion,
                historial: [
                  ...(obs.historial || []),
                  {
                    fecha_modificacion: new Date().toISOString(),
                    descripcion_modificacion: `Se actualizó: ${nuevaDescripcion}`,
                  },
                ],
              }
            : obs
        )
      );
    } catch (error) {
      console.error('❌ Error al guardar edición:', error);
      setMensaje({
        tipo: 'error',
        texto: '❌ Error al conectar con el servidor.',
      });
    } finally {
      setLoading(false);
    }
  }, [nuevaDescripcion, token]);

  // 🎯 Manejo de teclado en búsqueda
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      manejarBusqueda();
    }
  }, [manejarBusqueda]);

  // ❌ Cancelar edición
  const cancelarEdicion = useCallback(() => {
    setEditando(null);
    setNuevaDescripcion('');
  }, []);

  return (
    <div className="historial-container">
      {/* 🔍 BUSCADOR RESPONSIVE */}
      <div className="buscador-container">
        <div className="buscador-input-group">
          <input
            type="text"
            className="buscador-input"
            placeholder="Buscar estudiante por nombre"
            value={nombreBuscado}
            onChange={(e) => setNombreBuscado(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            aria-label="Buscar estudiante por nombre"
          />
          <button 
            className="btn-buscar"
            onClick={manejarBusqueda}
            disabled={loading}
            aria-label="Buscar estudiante"
          >
            <span className="btn-buscar-icon">🔍</span>
            <span className="btn-buscar-text">Buscar</span>
          </button>
        </div>
      </div>

      {/* 📱 TÍTULO RESPONSIVE */}
      <div className="titulo-container">
        <h2 className="titulo-principal">
          Historial de observaciones {nombre && <span className="nombre-estudiante">de {nombre}</span>}
        </h2>
        {loading && <div className="cargando-indicador">Cargando...</div>}
      </div>

      {/* 💬 MENSAJES */}
      {mensaje && (
        <div className={`mensaje-alerta ${mensaje.tipo}`} role="alert">
          {mensaje.texto}
        </div>
      )}

      {/* 📊 CONTENIDO PRINCIPAL */}
      {historial.length > 0 ? (
        <div className="contenido-historial">
          {/* 🖥️ VERSIÓN DESKTOP */}
          <div className="tabla-desktop">
            <div className="tabla-container">
              <table className="tabla-historial">
                <thead>
                  <tr>
                    <th className="col-fecha">Fecha modificación</th>
                    <th className="col-descripcion">Descripción modificación</th>
                    <th className="col-observacion">Observación original</th>
                    <th className="col-gravedad">Gravedad</th>
                    <th className="col-fecha-obs">Fecha observación</th>
                    <th className="col-acciones">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((obs, i) => (
                    <React.Fragment key={`obs-${obs.id_observacion || i}`}>
                      {/* Fila principal de observación */}
                      <tr className="fila-observacion">
                        <td className="col-fecha">-</td>
                        <td className="col-descripcion">-</td>
                        <td className="col-observacion">
                          {editando === obs.id_observacion ? (
                            <div className="edicion-container">
                              <textarea
                                className="input-edicion"
                                value={nuevaDescripcion}
                                onChange={(e) => setNuevaDescripcion(e.target.value)}
                                rows="3"
                                aria-label="Editar observación"
                              />
                            </div>
                          ) : (
                            <div className="observacion-texto">{obs.descripcion}</div>
                          )}
                        </td>
                        <td className="col-gravedad">
                          <span className={`badge-gravedad ${obs.gravedad?.nombre?.toLowerCase() || 'sin-gravedad'}`}>
                            {obs.gravedad?.nombre || 'Sin gravedad'}
                          </span>
                        </td>
                        <td className="col-fecha-obs">{obs.fecha}</td>
                        <td className="col-acciones">
                          {editando === obs.id_observacion ? (
                            <div className="acciones-edicion">
                              <button
                                className="btn-guardar"
                                onClick={() => guardarEdicion(obs.id_observacion)}
                                disabled={loading}
                                aria-label="Guardar cambios"
                              >
                                💾 Guardar
                              </button>
                              <button
                                className="btn-cancelar"
                                onClick={cancelarEdicion}
                                disabled={loading}
                                aria-label="Cancelar edición"
                              >
                                ❌ Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn-editar"
                              onClick={() => iniciarEdicion(obs)}
                              disabled={loading}
                              aria-label="Editar observación"
                            >
                              ✏️ Editar
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Filas de historial de modificaciones */}
                      {obs.historial?.length > 0 ? (
                        obs.historial.map((h, idx) => (
                          <tr key={`hist-${obs.id_observacion}-${idx}`} className="fila-historial">
                            <td className="col-fecha">{h.fecha_modificacion.split('T')[0]}</td>
                            <td className="col-descripcion">{h.descripcion_modificacion}</td>
                            <td className="col-observacion" colSpan="4"></td>
                          </tr>
                        ))
                      ) : (
                        <tr className="fila-historial vacia">
                          <td colSpan="6" className="sin-historial">
                            Sin historial de modificaciones
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 📱 VERSIÓN MÓVIL */}
          <div className="vista-movil">
            {historial.map((obs, i) => (
              <div key={`card-${obs.id_observacion || i}`} className="card-observacion">
                <div className="card-header">
                  <div className="card-fecha">{obs.fecha}</div>
                  <div className={`card-gravedad ${obs.gravedad?.nombre?.toLowerCase() || 'sin-gravedad'}`}>
                    {obs.gravedad?.nombre || 'Sin gravedad'}
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="card-label">Observación:</div>
                  {editando === obs.id_observacion ? (
                    <textarea
                      className="input-edicion-movil"
                      value={nuevaDescripcion}
                      onChange={(e) => setNuevaDescripcion(e.target.value)}
                      rows="3"
                      aria-label="Editar observación"
                    />
                  ) : (
                    <div className="observacion-texto">{obs.descripcion}</div>
                  )}
                </div>

                <div className="card-actions">
                  {editando === obs.id_observacion ? (
                    <div className="acciones-edicion-movil">
                      <button
                        className="btn-guardar"
                        onClick={() => guardarEdicion(obs.id_observacion)}
                        disabled={loading}
                      >
                        💾 Guardar
                      </button>
                      <button
                        className="btn-cancelar"
                        onClick={cancelarEdicion}
                        disabled={loading}
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-editar"
                      onClick={() => iniciarEdicion(obs)}
                      disabled={loading}
                    >
                      ✏️ Editar
                    </button>
                  )}
                </div>

                {/* Historial de modificaciones en móvil */}
                {obs.historial && obs.historial.length > 0 && (
                  <div className="card-historial">
                    <div className="historial-label">Modificaciones:</div>
                    {obs.historial.map((h, idx) => (
                      <div key={`hist-movil-${obs.id_observacion}-${idx}`} className="historial-item">
                        <div className="historial-fecha">
                          📅 {h.fecha_modificacion.split('T')[0]}
                        </div>
                        <div className="historial-descripcion">
                          {h.descripcion_modificacion}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        !loading && (
          <div className="estado-vacio">
            <div className="estado-vacio-icono">📋</div>
            <div className="estado-vacio-texto">
              {nombreBuscado 
                ? `No se encontró historial para "${nombreBuscado}"`
                : 'Ingresa un nombre para buscar historial de observaciones'
              }
            </div>
          </div>
        )
      )}

      {/* 🪟 MODALES */}
      <ModalMensaje
        visible={showConfirm}
        tipo="confirmacion"
        titulo="Confirmación"
        mensaje={confirmMessage}
        onClose={() => setShowConfirm(false)}
        onConfirm={ejecutarAccion}
      />

      <ModalMensaje
        visible={!!mensaje}
        tipo={mensaje?.tipo || "info"}
        titulo="Notificación"
        mensaje={mensaje?.texto || ""}
        onClose={() => {
          setMensaje(null);
          setUsuarioGenerado(null);
        }}
      />
    </div>
  );
}

export default HistorialObservaciones;