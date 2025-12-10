import React, { useState, useCallback, useEffect } from 'react';
import ModalMensaje from "../../ui/ModalMensaje";
import ModalDetallesEstudiante from "./ModalDetallesEstudiante"; // 👈 IMPORTAR EL NUEVO MODAL
import "./BuscarEstudiante.css"

function BuscarEstudiante() {
  const [nombre, setNombre] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [showModalDetalles, setShowModalDetalles] = useState(false);

  // paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const ejecutarAccion = useCallback(() => {
    console.log("Acción confirmada");
  }, []);

  // helper para obtener token
  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

  // Función para obtener estudiantes (si filtro vacío trae todo)
  const fetchEstudiantes = useCallback(async (filtro = '') => {
    try {
      setMensaje('');
      setTipoMensaje('');
      setLoading(true);
      setEstudiantes([]);

      const token = getToken();
      if (!token) {
        setMensaje('⚠️ Necesitas iniciar sesión para buscar estudiantes.');
        setTipoMensaje('error');
        setLoading(false);
        return;
      }

      const url = filtro && filtro.trim()
        ? `http://localhost:3000/api/coordinador/estudiante/buscar?filtro=${encodeURIComponent(filtro.trim())}`
        : `http://localhost:3000/api/coordinador/estudiante/buscar`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (res.status === 401 || res.status === 403) {
        setMensaje('🔐 Tu sesión ha expirado. Inicia sesión nuevamente.');
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
        setPaginaActual(1);
        if (filtro && filtro.trim()) {
          setMensaje(`✅ Se encontraron ${data.length} estudiante(s)`);
          setTipoMensaje('success');
        } else {
          setMensaje(`📋 Se cargaron ${data.length} estudiante(s) en total`);
          setTipoMensaje('info');
        }
      } else {
        setEstudiantes([]);
        if (filtro && filtro.trim()) {
          setMensaje('📭 No se encontraron estudiantes con ese criterio de búsqueda.');
          setTipoMensaje('info');
        } else {
          setMensaje('📭 No hay estudiantes registrados actualmente.');
          setTipoMensaje('info');
        }
      }
    } catch (err) {
      console.error('❌ Error en fetchEstudiantes:', err);
      setMensaje('🚨 Error al conectar con el servidor. Intenta nuevamente.');
      setTipoMensaje('error');
      setEstudiantes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstudiantes('');
  }, [fetchEstudiantes]);

  const buscar = useCallback(async () => {
    await fetchEstudiantes(nombre);
  }, [nombre, fetchEstudiantes]);

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
    setMensaje('');
    setTipoMensaje('');
    setUsuarioGenerado(null);
    fetchEstudiantes('');
  }, [fetchEstudiantes]);

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(estudiantes.length / itemsPorPagina));
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const estudiantesPaginados = estudiantes.slice(inicio, fin);

  const irPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
    const cont = document.querySelector('.tabla-container') || document.querySelector('.tarjetas-container');
    if (cont) cont.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="buscar_container">
      <div className="buscar-card">
        {/* Header */}
              <div className="hero-section">

        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenido <span className="gradient-text">Coordinador</span>
          </h1>
          <p className="hero-subtitle">
            Panel de control para buscar estudiantes
          </p>
        </div>


        {/* Formulario de búsqueda */}

        <div className="hero-graphic">
          <div className="floating-elements">
            <div className="floating-element element-1">🎓</div>
            <div className="floating-element element-2">📚</div>
            <div className="floating-element element-3">⭐</div>
          </div>
        </div>

      </div>

        {/* 🔸 Formulario de búsqueda */}

        <form onSubmit={onSubmit} className="buscar-form">
          <div className="form-container">
            <div className="input-group-wrapper">
              <label className="form-label">
                Nombre o Documento del Estudiante <span className="required">*</span>
              </label>
              <div className="input-button-group">
                <input
                  type="text"
                  className="input-busqueda"
                  placeholder="Ej: Juan Pérez o 1012345678"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <div className="botones-accion ">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-buscar"
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Buscando...
                      </>
                    ) : (
                      <>
                        <span className="icono-buscar">🔍</span>
                        Buscar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Mensajes de estado */}
        {mensaje && (
          <div className={`mensaje-alerta ${tipoMensaje}`}>
            <span className="icono-alerta">
              {tipoMensaje === 'success' ? '✅' :
               tipoMensaje === 'error' ? '❌' :
               tipoMensaje === 'info' ? 'ℹ️' : '⚠️'}
            </span>
            <span>{mensaje}</span>
          </div>
        )}

        {/* Resumen de resultados */}
        {estudiantes.length > 0 && (
          <div className="resumen-resultados">
            <div className="contador-estudiantes">
              <span className="numero">{estudiantes.length}</span>
              <span className="texto">estudiante(s) encontrado(s)</span>
            </div>
          </div>
        )}

        {/* Tabla desktop */}
        {estudiantesPaginados.length > 0 && (
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesPaginados.map((est) => {
                    const acudiente = est.acudientes?.[0];
                    const personaEst = est.persona;
                    const personaAcu = acudiente?.persona;

                    return (
                      <tr key={est.id_estudiante} className="fila-estudiante">
                        <td>
                          <div className="info-estudiante">
                            <strong className="nombre">
                              {personaEst?.nombre} {personaEst?.apellido}
                            </strong>
                            <span className="grado">Grado: {est.grado || 'No asignado'}</span>
                          </div>
                        </td>

                        <td>
                          <span className="documento">{personaEst?.numero_documento || '—'}</span>
                        </td>

                        <td>
                          <span className="eps">{est.eps?.nombre || '—'}</span>
                        </td>

                        <td>
                          <span className={`estado ${est.estadoAcademico?.nombre?.toLowerCase() || 'sin-estado'}`}>
                            {est.estadoAcademico?.nombre || '—'}
                          </span>
                        </td>

                        <td>
                          {acudiente ? (
                            <div className="info-acudiente">
                              <strong>{personaAcu?.nombre} {personaAcu?.apellido}</strong>
                              <span>Doc: {acudiente.numero_documento || '—'}</span>
                            </div>
                          ) : (
                            <span className="sin-acudiente">Sin acudiente</span>
                          )}
                        </td>

                        <td>
                          {acudiente ? (
                            <div className="contacto-acudiente">
                              <span className="telefono">📞 {personaAcu?.telefono || '—'}</span>
                              <span className="email">📧 {personaAcu?.correo || '—'}</span>
                              <span className="direccion">🏠 {personaAcu?.direccion || '—'}</span>
                            </div>
                          ) : (
                            <span className="sin-contacto">—</span>
                          )}
                        </td>

                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setEstudianteSeleccionado(est);
                              setShowModalDetalles(true);
                            }}
                          >
                            Ver más
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tarjetas móviles */}
        {estudiantesPaginados.length > 0 && (
          <div className="tarjetas-container mobile">
            {estudiantesPaginados.map((est) => {
              const acudiente = est.acudientes?.[0];
              const personaEst = est.persona;
              const personaAcu = acudiente?.persona;
              
              return (
                <div key={est.id_estudiante} className="tarjeta-estudiante">
                  <div className="tarjeta-header">
                    <h3 className="nombre-estudiante">{personaEst?.nombre} {personaEst?.apellido}</h3>
                    <span className="grado-estudiante">Grado {est.grado || 'No asignado'}</span>
                  </div>
                  
                  <div className="tarjeta-content">
                    <div className="info-section">
                      <h4>👤 Información Personal</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Documento:</span>
                          <span className="value">{personaEst?.numero_documento || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">EPS:</span>
                          <span className="value">{est.eps?.nombre || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Estado:</span>
                          <span className={`value estado ${est.estadoAcademico?.nombre?.toLowerCase() || 'sin-estado'}`}>
                            {est.estadoAcademico?.nombre || '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {acudiente ? (
                      <div className="acudiente-section">
                        <h4>👨‍👩‍👧‍👦 Acudiente</h4>
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
                            <span className="label">Teléfono:</span>
                            <span className="value">{personaAcu?.telefono || '—'}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Email:</span>
                            <span className="value">{personaAcu?.correo || '—'}</span>
                          </div>
                          <div className="info-item full-width">
                            <span className="label">Dirección:</span>
                            <span className="value">{personaAcu?.direccion || '—'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="sin-acudiente-section">
                        <span className="icono">👤</span>
                        <p>Sin acudiente registrado</p>
                      </div>
                    )}

                    {/* 👈 AGREGAR BOTÓN EN TARJETA MÓVIL */}
                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={() => {
                        setEstudianteSeleccionado(est);
                        setShowModalDetalles(true);
                      }}
                    >
                      Ver más detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Paginación */}
        {estudiantes.length > 0 && (
          <div className="paginacion">
            <button
              onClick={() => irPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="btn-pagina"
            >
              ◀ Anterior
            </button>

            <span className="pagina-info">Página {paginaActual} de {totalPaginas}</span>

            <button
              onClick={() => irPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="btn-pagina"
            >
              Siguiente ▶
            </button>
          </div>
        )}

        {/* Estado inicial */}
        {!estudiantes.length && !loading && !mensaje && (
          <div className="estado-inicial">
            <div className="estado-content">
              <span className="icono-estado">🔍</span>
              <h3>Buscar Estudiantes</h3>
              <p>Ingresa el nombre o documento de un estudiante para comenzar la búsqueda</p>
              <div className="tips-busqueda">
                <div className="tip">
                  <strong>📝 Por nombre</strong>
                  <p>Busca por nombre completo o parcial</p>
                </div>
                <div className="tip">
                  <strong>🆔 Por documento</strong>
                  <p>Ingresa el número de documento</p>
                </div>
                <div className="tip">
                  <strong>🎯 Resultados</strong>
                  <p>Se mostrarán todos los estudiantes que coincidan</p>
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

{/* 👈 REEMPLAZAR EL MODAL VIEJO CON EL NUEVO */}
{showModalDetalles && estudianteSeleccionado && (
  <ModalDetallesEstudiante
    estudiante={estudianteSeleccionado}
    onClose={() => {
      setShowModalDetalles(false);
      setEstudianteSeleccionado(null);
    }}
  />
)}
</div>
);

}

export default BuscarEstudiante;