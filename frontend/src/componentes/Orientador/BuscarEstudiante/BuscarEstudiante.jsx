import React, { useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BuscarEstudiante.css';
import ModalMensaje from "../../ui/ModalMensaje";
import {
  FaSearch,
  FaTrash,
  FaUserGraduate,
  FaIdCard,
  FaHeartbeat,
  FaUserCheck,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

function BuscarEstudiante() {
  const [nombre, setNombre] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  const ejecutarAccion = useCallback(() => {
    console.log("Acción confirmada");
  }, []);

  // 🔍 Función principal de búsqueda optimizada
  const buscar = useCallback(async () => {
    try {
      setMensaje('');
      setTipoMensaje('');

      if (!nombre.trim()) {
        setMensaje('Por favor, ingresa un nombre o documento para buscar.');
        setTipoMensaje('error');
        return;
      }

      setLoading(true);
      setEstudiantes([]);

      const url = `http://localhost:3000/api/coordinador/estudiante/buscar?filtro=${encodeURIComponent(nombre.trim())}`;
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        setMensaje('Necesitas iniciar sesión para buscar estudiantes.');
        setTipoMensaje('error');
        setLoading(false);
        return;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (res.status === 401 || res.status === 403) {
        setMensaje('Tu sesión ha expirado. Inicia sesión nuevamente.');
        setTipoMensaje('error');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setEstudiantes(data);
        setMensaje(`Se encontraron ${data.length} estudiante(s)`);
        setTipoMensaje('success');
      } else {
        setEstudiantes([]);
        setMensaje('No se encontraron estudiantes con ese criterio de búsqueda.');
        setTipoMensaje('info');
      }
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setMensaje('Error al conectar con el servidor. Intenta nuevamente.');
      setTipoMensaje('error');
      setEstudiantes([]);
    } finally {
      setLoading(false);
    }
  }, [nombre]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    buscar();
  }, [buscar]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscar();
    }
  }, [buscar]);

  const limpiarBusqueda = useCallback(() => {
    setNombre('');
    setEstudiantes([]);
    setMensaje('');
    setTipoMensaje('');
  }, []);

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    switch (estadoLower) {
      case 'activo': return '#28a745';
      case 'inactivo': return '#dc3545';
      case 'graduado': return '#17a2b8';
      case 'retirado': return '#6c757d';
      default: return '#6c757d';
    }
  };

  return (
    <div className="buscar-container">
      <div className="buscar-card">
        {/* Header */}
        <div className="buscar-header">
          <div className="header-icon">
            <FaSearch />
          </div>
          <div className="header-content">
            <h1 className="titulo-principal">Buscar Estudiante</h1>
            <p className="subtitulo">Sistema de Gestión Académica</p>
          </div>
        </div>

        {/* 🔸 Formulario de búsqueda */}
        <form onSubmit={onSubmit} className="buscar-form">
          <div className="form-container">
            <div className="input-group-wrapper">
              <label className="form-label">
                <FaUserGraduate className="me-2" />
                Nombre o Documento del Estudiante 
                <span className="required">*</span>
              </label>
              <div className="input-button-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="input-busqueda"
                    placeholder="Ej: Juan Pérez o 1012345678"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  {loading && (
                    <div className="input-loading">
                      <div className="spinner-small"></div>
                    </div>
                  )}
                </div>
                <div className="botones-accion">
                  <button
                    type="submit"
                    disabled={loading || !nombre.trim()}
                    className="btn-buscar"
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Buscando...
                      </>
                    ) : (
                      <>
                        <FaSearch className="me-2" />
                        Buscar
                      </>
                    )}
                  </button>
                  {(nombre || estudiantes.length > 0) && (
                    <button
                      type="button"
                      onClick={limpiarBusqueda}
                      className="btn-limpiar"
                      disabled={loading}
                    >
                      <FaTrash className="me-2" />
                      Limpiar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* 🔹 Mensajes de estado */}
        {mensaje && (
          <div className={`mensaje-alerta ${tipoMensaje}`}>
            <div className="icono-alerta">
              {tipoMensaje === 'success' ? <FaUserCheck /> : 
               tipoMensaje === 'error' ? <FaExclamationTriangle /> : 
               <FaInfoCircle />}
            </div>
            <span className="mensaje-texto">{mensaje}</span>
          </div>
        )}

        {/* 📊 Resumen de resultados */}
        {estudiantes.length > 0 && (
          <div className="resumen-resultados">
            <div className="contador-estudiantes">
              <span className="numero">{estudiantes.length}</span>
              <span className="texto">estudiante(s) encontrado(s)</span>
            </div>
          </div>
        )}

        {/* 🧭 Tabla desktop */}
        {estudiantes.length > 0 && (
          <div className="tabla-container desktop">
            <div className="table-responsive">
              <table className="tabla-estudiantes">
                <thead>
                  <tr>
                    <th>Información del Estudiante</th>
                    <th>Documento</th>
                    <th>EPS</th>
                    <th>Estado</th>
                    <th>Acudiente</th>
                    <th>Contacto</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((est) => {
                    const acudiente = est.acudientes?.[0];
                    const personaEst = est.persona;
                    const personaAcu = acudiente?.persona;
                    
                    return (
                      <tr key={est.id_estudiante} className="fila-estudiante">
                        <td>
                          <div className="info-estudiante">
                            <div className="avatar-estudiante">
                              <FaUserGraduate />
                            </div>
                            <div className="info-content">
                              <strong className="nombre">{personaEst?.nombre} {personaEst?.apellido}</strong>
                              <span className="grado">
                                <FaUserGraduate className="me-1" />
                                {est.grado || 'No asignado'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="documento-info">
                            <FaIdCard className="me-2 text-muted" />
                            <span>{personaEst?.numero_documento || '—'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="eps-info">
                            <FaHeartbeat className="me-2 text-muted" />
                            <span>{est.eps?.nombre || '—'}</span>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="estado-badge"
                            style={{ 
                              backgroundColor: getEstadoColor(est.estadoAcademico?.nombre),
                              color: 'white'
                            }}
                          >
                            {est.estadoAcademico?.nombre || '—'}
                          </span>
                        </td>
                        <td>
                          {acudiente ? (
                            <div className="info-acudiente">
                              <div className="acudiente-header">
                                <FaUsers className="me-2" />
                                <strong>{personaAcu?.nombre} {personaAcu?.apellido}</strong>
                              </div>
                              <span className="acudiente-doc">
                                Doc: {acudiente.numero_documento || '—'}
                              </span>
                            </div>
                          ) : (
                            <span className="sin-acudiente">
                              <FaUsers className="me-2" />
                              Sin acudiente
                            </span>
                          )}
                        </td>
                        <td>
                          {acudiente ? (
                            <div className="contacto-acudiente">
                              <div className="contacto-item">
                                <FaPhone className="me-2" />
                                <span>{personaAcu?.telefono || '—'}</span>
                              </div>
                              <div className="contacto-item">
                                <FaEnvelope className="me-2" />
                                <span>{personaAcu?.correo || '—'}</span>
                              </div>
                              <div className="contacto-item">
                                <FaHome className="me-2" />
                                <span>{personaAcu?.direccion || '—'}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="sin-contacto">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 📱 Tarjetas móviles */}
        {estudiantes.length > 0 && (
          <div className="tarjetas-container mobile">
            {estudiantes.map((est) => {
              const acudiente = est.acudientes?.[0];
              const personaEst = est.persona;
              const personaAcu = acudiente?.persona;
              
              return (
                <div key={est.id_estudiante} className="tarjeta-estudiante">
                  <div className="tarjeta-header">
                    <div className="avatar-estudiante">
                      <FaUserGraduate />
                    </div>
                    <div className="header-content">
                      <h3 className="nombre-estudiante">{personaEst?.nombre} {personaEst?.apellido}</h3>
                      <span className="grado-estudiante">
                        <FaUserGraduate className="me-1" />
                        Grado {est.grado || 'No asignado'}
                      </span>
                    </div>
                    <span 
                      className="estado-badge-mobile"
                      style={{ 
                        backgroundColor: getEstadoColor(est.estadoAcademico?.nombre),
                        color: 'white'
                      }}
                    >
                      {est.estadoAcademico?.nombre || '—'}
                    </span>
                  </div>
                  
                  <div className="tarjeta-content">
                    <div className="info-section">
                      <h4>
                        <FaIdCard className="me-2" />
                        Información Personal
                      </h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Documento:</span>
                          <span className="value">{personaEst?.numero_documento || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">
                            <FaHeartbeat className="me-1" />
                            EPS:
                          </span>
                          <span className="value">{est.eps?.nombre || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {acudiente ? (
                      <div className="acudiente-section">
                        <h4>
                          <FaUsers className="me-2" />
                          Acudiente
                        </h4>
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">Nombre:</span>
                            <span className="value">{personaAcu?.nombre} {personaAcu?.apellido}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Documento:</span>
                            <span className="value">{acudiente.numero_documento || '—'}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">
                              <FaPhone className="me-1" />
                              Teléfono:
                            </span>
                            <span className="value">{personaAcu?.telefono || '—'}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">
                              <FaEnvelope className="me-1" />
                              Email:
                            </span>
                            <span className="value">{personaAcu?.correo || '—'}</span>
                          </div>
                          <div className="info-item full-width">
                            <span className="label">
                              <FaHome className="me-1" />
                              Dirección:
                            </span>
                            <span className="value">{personaAcu?.direccion || '—'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="sin-acudiente-section">
                        <FaUsers className="icono" />
                        <p>Sin acudiente registrado</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Información cuando no hay búsquedas */}
        {!estudiantes.length && !loading && !mensaje && (
          <div className="estado-inicial">
            <div className="estado-content">
              <div className="icono-estado">
                <FaSearch />
              </div>
              <h3>Buscar Estudiantes</h3>
              <p>Ingresa el nombre o documento de un estudiante para comenzar la búsqueda</p>
              <div className="tips-busqueda">
                <div className="tip">
                  <div className="tip-icon">
                    <FaUserGraduate />
                  </div>
                  <div className="tip-content">
                    <strong>Por nombre</strong>
                    <p>Busca por nombre completo o parcial</p>
                  </div>
                </div>
                <div className="tip">
                  <div className="tip-icon">
                    <FaIdCard />
                  </div>
                  <div className="tip-content">
                    <strong>Por documento</strong>
                    <p>Ingresa el número de documento</p>
                  </div>
                </div>
                <div className="tip">
                  <div className="tip-icon">
                    <FaSearch />
                  </div>
                  <div className="tip-content">
                    <strong>Resultados</strong>
                    <p>Se mostrarán todos los estudiantes que coincidan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalMensaje
        visible={showConfirm}
        tipo="confirmacion"
        titulo="Confirmación"
        mensaje={confirmMessage}
        onClose={() => setShowConfirm(false)}
        onConfirm={ejecutarAccion}
      />

      <ModalMensaje
        visible={!!mensaje && tipoMensaje !== 'success' && tipoMensaje !== 'info'}
        tipo={tipoMensaje === 'error' ? 'error' : 'advertencia'}
        titulo="Notificación"
        mensaje={mensaje}
        onClose={() => {
          setMensaje("");
          setUsuarioGenerado(null);
        }}
      />
    </div>
  );
}

export default BuscarEstudiante;