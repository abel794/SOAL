// src/componentes/VistaAcudiente/AcudienteObservacionCard/AcudienteObservacionCard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../AcudienteObservacionCard/AcudienteObservacionCard.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

/* ---------- ObservacionCard (presentacional) ---------- */
const ObservacionCard = ({ observacion, onToggleLeida }) => {
  const estudianteNombre = observacion.estudianteNombre ?? observacion.nombre ?? "";
  const estudianteApellido = observacion.estudianteApellido ?? observacion.apellido ?? "";
  const nombreCompleto = `${estudianteNombre} ${estudianteApellido}`.trim();

  const grado = observacion.grado ?? observacion.nombre_grado ?? "No definido";
  const categoria = observacion.categoria ?? "General";
  const gravedad = observacion.gravedad ?? "Leve";
  const descripcion = observacion.descripcion ?? "-";

  const fecha = observacion.fecha ?? observacion.createdAt ?? null;
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto || "Alumno")}&background=0D6EFD&color=fff&size=128`;

  // Colores según gravedad
  const getBadgeColor = (nivel) => {
    const colores = {
      'Leve': 'success',
      'Moderada': 'warning',
      'Grave': 'orange',
      'Crítica': 'danger',
      'Urgente': 'danger'
    };
    return colores[nivel] || 'secondary';
  };

  return (
    <div 
      className="card mb-3 shadow-sm border-start" 
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: observacion.leida ? '#6c757d' : '#0d6efd',
        borderRadius: '12px',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start">
          {/* Avatar */}
          <div 
            className="flex-shrink-0 mb-3 mb-md-0 me-md-3"
            style={{ 
              width: '70px', 
              height: '70px' 
            }}
          >
            <img
              src={avatar}
              alt={nombreCompleto}
              className="rounded-circle w-100 h-100"
              style={{ 
                objectFit: 'cover',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onError={(e) => { 
                e.currentTarget.onerror = null; 
                e.currentTarget.src = "https://ui-avatars.com/api/?name=Usuario&background=6c757d&color=fff&size=128"; 
              }}
            />
          </div>
          
          {/* Contenido */}
          <div className="flex-grow-1 w-100">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-2">
              <div className="mb-2 mb-md-0 w-100">
                <h5 
                  className="card-title mb-2 fw-bold" 
                  style={{ 
                    fontSize: '1.1rem',
                    color: '#212529'
                  }}
                >
                  {nombreCompleto || "Nombre desconocido"}
                </h5>
                <div 
                  className="d-flex flex-wrap gap-2 mb-2"
                  style={{ gap: '0.5rem' }}
                >
                  <span 
                    className="badge d-flex align-items-center"
                    style={{ 
                      backgroundColor: '#f8f9fa', 
                      color: '#212529',
                      borderRadius: '20px',
                      padding: '0.35rem 0.75rem'
                    }}
                  >
                    <i className="bi bi-mortarboard me-1"></i>
                    {grado}
                  </span>
                  <span 
                    className={`badge bg-${getBadgeColor(gravedad)} d-flex align-items-center`}
                    style={{ 
                      borderRadius: '20px',
                      padding: '0.35rem 0.75rem'
                    }}
                  >
                    {categoria}
                  </span>
                  <span 
                    className={`badge bg-${getBadgeColor(gravedad)}`}
                    style={{ 
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem'
                    }}
                  >
                    {gravedad}
                  </span>
                </div>
              </div>
              
              {/* Indicador de no leída */}
              {!observacion.leida && (
                <span 
                  className="badge bg-danger d-flex align-items-center"
                  style={{ 
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    padding: 0,
                    justifyContent: 'center',
                    fontSize: '0.8rem'
                  }}
                  title="Nueva observación"
                >
                  <i className="bi bi-exclamation-circle"></i>
                </span>
              )}
            </div>
            
            {/* Descripción */}
            <div 
              className="mb-3"
              style={{
                backgroundColor: '#f8f9fa',
                padding: '0.75rem',
                borderRadius: '8px',
                borderLeft: '3px solid #dee2e6',
                color: '#6c757d',
                lineHeight: '1.5'
              }}
            >
              <i className="bi bi-chat-text me-2"></i>
              {descripcion}
            </div>
            
            {/* Footer */}
            <div 
              className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
              style={{ 
                paddingTop: '0.75rem',
                borderTop: '1px solid #e9ecef'
              }}
            >
              <small 
                className="text-muted mb-2 mb-md-0 d-flex align-items-center"
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-clock me-1"></i>
                {fecha ? new Date(fecha).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : "Fecha no disponible"}
              </small>
              
              {/* Botón marcar como leída */}
              {!observacion.leida ? (
                <button
                  onClick={() => onToggleLeida(observacion.id_observacion)}
                  className="btn btn-outline-primary d-flex align-items-center"
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}
                  title="Marcar como leída"
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Marcar leída
                </button>
              ) : (
                <span 
                  className="text-success d-flex align-items-center"
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-check2-circle me-1"></i>
                  Leída
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Componente principal ---------- */
const AcudienteObservacionCard = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("todos");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No se encontró el token de autenticación");
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/acudientes/observaciones`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
          }
        );

        if (res.data && res.data.success) {
          const estudiantesData = res.data.data.estudiantes || [];
          const observacionesData = res.data.data.observaciones || [];
          
          setEstudiantes(estudiantesData);
          setObservaciones(observacionesData.map(obs => ({ ...obs, leida: false })));
          
          if (estudiantesData.length > 0) {
            setSelectedStudentId(estudiantesData[0].id_estudiante);
          }
        } else {
          setError("Formato de respuesta inesperado");
        }
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
        setError(
          err.response?.data?.message || 
          err.message || 
          "Error al cargar la información de observaciones"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectStudent = (est) => {
    const id = est.id_estudiante;
    setSelectedStudentId(id);
  };

  const handleToggleLeida = (observacionId) => {
    setObservaciones(prev => 
      prev.map(obs => 
        obs.id_observacion === observacionId 
          ? { ...obs, leida: true }
          : obs
      )
    );
  };

  const observacionesDelSeleccionado = selectedStudentId 
    ? observaciones.filter(obs => {
        if (obs.id_estudiante !== selectedStudentId) return false;
        
        switch (activeFilter) {
          case "no-leidas":
            return !obs.leida;
          case "leidas":
            return obs.leida;
          default:
            return true;
        }
      })
    : [];

  const estudianteSeleccionado = estudiantes.find(est => est.id_estudiante === selectedStudentId);

  const countObservaciones = (estId) => {
    const total = observaciones.filter(obs => obs.id_estudiante === estId).length;
    const noLeidas = observaciones.filter(obs => obs.id_estudiante === estId && !obs.leida).length;
    return { total, noLeidas };
  };

  // Estilos responsivos
  const styles = {
    container: {
      width: '100%',
      padding: '0.5rem'
    },
    pageHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    },
    studentCard: {
      border: '2px solid transparent',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%'
    },
    studentCardSelected: {
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13, 110, 253, 0.05)',
      boxShadow: '0 6px 16px rgba(13, 110, 253, 0.1)'
    },
    filterBtn: {
      minWidth: '80px',
      padding: '0.5rem',
      border: '2px solid #dee2e6',
      background: 'white',
      color: '#6c757d',
      borderRadius: '50px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    filterBtnActive: {
      background: '#0d6efd',
      color: 'white',
      borderColor: '#0d6efd'
    },
    emptyState: {
      padding: '3rem 1rem',
      textAlign: 'center'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div 
          className="d-flex justify-content-center align-items-center" 
          style={{ minHeight: '300px' }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted">Cargando observaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div 
          className="alert alert-danger" 
          role="alert"
          style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
            <div>
              <h5 className="alert-heading mb-2">Error al cargar datos</h5>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div style={styles.container}>
        <div className="alert alert-info" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-3 fs-4"></i>
            <div>
              <h5 className="alert-heading mb-2">No hay estudiantes</h5>
              <p className="mb-0">No hay estudiantes asociados a tu cuenta.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.pageHeader} className="mb-4">
        <div className="d-flex align-items-center">
          <i className="bi bi-clipboard-check me-3 fs-2"></i>
          <div>
            <h1 className="h4 fw-bold mb-1">Observaciones</h1>
            <p className="mb-0 opacity-90">Visualiza y gestiona las observaciones de tus estudiantes</p>
          </div>
        </div>
      </div>

      {/* Selector de estudiantes */}
      <div 
        className="card mb-4 shadow-sm" 
        style={{ 
          border: 'none', 
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <div 
          className="card-header text-white"
          style={{ 
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            border: 'none',
            padding: '1rem'
          }}
        >
          <h5 className="card-title mb-0 d-flex align-items-center">
            <i className="bi bi-people-fill me-2"></i>
            Estudiantes a cargo
          </h5>
        </div>
        <div className="card-body p-3 p-md-4">
          <div className="row g-3">
            {estudiantes.map(est => {
              const { total, noLeidas } = countObservaciones(est.id_estudiante);
              const isSelected = selectedStudentId === est.id_estudiante;
              
              return (
                <div key={est.id_estudiante} className="col-12 col-md-6 col-lg-4">
                  <div 
                    className="card h-100"
                    style={{
                      ...styles.studentCard,
                      ...(isSelected ? styles.studentCardSelected : {})
                    }}
                    onClick={() => handleSelectStudent(est)}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(est.nombre + ' ' + est.apellido)}&background=0D6EFD&color=fff&size=64`}
                          alt={est.nombre}
                          className="rounded-circle me-3"
                          style={{ 
                            width: '50px', 
                            height: '50px',
                            border: '3px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <h6 
                              className="card-title fw-bold mb-0" 
                              style={{ fontSize: '1rem' }}
                            >
                              {est.nombre} {est.apellido}
                            </h6>
                            {noLeidas > 0 && (
                              <span 
                                className="badge bg-danger"
                                style={{ 
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.7rem'
                                }}
                              >
                                {noLeidas}
                              </span>
                            )}
                          </div>
                          <div className="mb-2">
                            <span 
                              className="badge bg-light text-dark"
                              style={{ 
                                borderRadius: '20px',
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem'
                              }}
                            >
                              <i className="bi bi-mortarboard me-1"></i>
                              {est.grado}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                              <i className="bi bi-clipboard me-1"></i>
                              {total} observaciones
                            </small>
                            {isSelected && (
                              <span className="badge bg-primary" style={{ fontSize: '0.75rem' }}>
                                <i className="bi bi-check-lg me-1"></i>
                                Seleccionado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lista de observaciones */}
      {selectedStudentId && estudianteSeleccionado && (
        <div 
          className="card shadow-sm mb-4"
          style={{ 
            border: 'none', 
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <div 
            className="card-header bg-white border-bottom p-3"
            style={{ borderBottom: '1px solid #e9ecef' }}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div className="mb-2 mb-md-0">
                <h5 
                  className="card-title mb-1 fw-bold" 
                  style={{ fontSize: '1.1rem', color: '#212529' }}
                >
                  Observaciones de{" "}
                  <span className="text-primary">
                    {estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}
                  </span>
                </h5>
                <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                  {estudianteSeleccionado.grado}
                </p>
              </div>
              
              <div className="d-flex align-items-center gap-2 w-100 w-md-auto flex-wrap">
                <div className="d-flex gap-2 mb-1 mb-md-0 flex-wrap">
                  <button
                    type="button"
                    style={{
                      ...styles.filterBtn,
                      ...(activeFilter === 'todos' ? styles.filterBtnActive : {})
                    }}
                    onClick={() => setActiveFilter('todos')}
                  >
                    <i className="bi bi-list-check me-1"></i> Todas
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.filterBtn,
                      ...(activeFilter === 'no-leidas' ? styles.filterBtnActive : {})
                    }}
                    onClick={() => setActiveFilter('no-leidas')}
                  >
                    <i className="bi bi-envelope-exclamation me-1"></i> No leídas
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.filterBtn,
                      ...(activeFilter === 'leidas' ? styles.filterBtnActive : {})
                    }}
                    onClick={() => setActiveFilter('leidas')}
                  >
                    <i className="bi bi-envelope-check me-1"></i> Leídas
                  </button>
                </div>
                
                <span 
                  className="badge bg-primary"
                  style={{ 
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem'
                  }}
                >
                  {observacionesDelSeleccionado.length}
                </span>
              </div>
            </div>
          </div>
          
          <div className="card-body p-3">
            {observacionesDelSeleccionado.length === 0 ? (
              <div style={styles.emptyState}>
                <div className="mb-3">
                  <i 
                    className="bi bi-clipboard-x" 
                    style={{ 
                      fontSize: '3rem', 
                      color: '#dee2e6' 
                    }}
                  ></i>
                </div>
                <h5 
                  className="text-muted mb-3" 
                  style={{ fontSize: '1.1rem' }}
                >
                  {activeFilter === 'todos' 
                    ? "No hay observaciones para este estudiante" 
                    : activeFilter === 'no-leidas' 
                      ? "No hay observaciones sin leer" 
                      : "No hay observaciones leídas"}
                </h5>
                {activeFilter !== 'todos' && (
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setActiveFilter('todos')}
                    style={{ borderRadius: '20px' }}
                  >
                    Ver todas las observaciones
                  </button>
                )}
              </div>
            ) : (
              <div>
                {observacionesDelSeleccionado.map(obs => (
                  <ObservacionCard
                    key={obs.id_observacion}
                    observacion={obs}
                    onToggleLeida={handleToggleLeida}
                  />
                ))}
              </div>
            )}
          </div>
          
          {observacionesDelSeleccionado.length > 0 && (
            <div 
              className="card-footer bg-white border-top p-3"
              style={{ 
                borderTop: '1px solid #e9ecef',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <small className="text-muted mb-2 mb-md-0" style={{ fontSize: '0.85rem' }}>
                  Mostrando {observacionesDelSeleccionado.length} observaciones
                </small>
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                  <span 
                    className="badge bg-light text-dark border d-flex align-items-center"
                    style={{ 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem'
                    }}
                  >
                    <i className="bi bi-circle-fill text-success me-1" style={{ fontSize: '0.6rem' }}></i>
                    Leve
                  </span>
                  <span 
                    className="badge bg-light text-dark border d-flex align-items-center"
                    style={{ 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem'
                    }}
                  >
                    <i className="bi bi-circle-fill text-warning me-1" style={{ fontSize: '0.6rem' }}></i>
                    Moderada
                  </span>
                  <span 
                    className="badge bg-light text-dark border d-flex align-items-center"
                    style={{ 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem'
                    }}
                  >
                    <i className="bi bi-circle-fill text-danger me-1" style={{ fontSize: '0.6rem' }}></i>
                    Grave/Crítica
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcudienteObservacionCard;