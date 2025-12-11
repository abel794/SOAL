import React, { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";


const VerJustificacionesEstudiantes = () => {
  const [justificaciones, setJustificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstudiante, setFiltroEstudiante] = useState("");
  const [imagenActual, setImagenActual] = useState(null);
  const [cargandoImagen, setCargandoImagen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState("todos"); // todos, aprobado, pendiente, rechazado
  const [filtroFecha, setFiltroFecha] = useState("");
  const [orden, setOrden] = useState("desc"); // asc, desc

  useEffect(() => {
    const obtenerJustificaciones = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token de sesión");

        const response = await fetch(
          "http://localhost:3000/api/coordinador/justificacion/mis-justificaciones",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok)
          throw new Error("Error al obtener las justificaciones");

        const data = await response.json();
        console.log("✅ Justificaciones recibidas:", data);
        setJustificaciones(data);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerJustificaciones();
  }, []);

  // 📥 Descargar archivo
  const descargarArchivo = async (idJustificacion, estudianteNombre, estudianteApellido) => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      
      console.log(`📥 Iniciando descarga para justificación ID: ${idJustificacion}`);
      
      const response = await fetch(
        `http://localhost:3000/api/coordinador/justificacion/descargar/${idJustificacion}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Error ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      
      console.log(`📦 Archivo recibido:`, {
        tamaño: blob.size,
        tipo: blob.type
      });

      if (blob.size === 0) {
        throw new Error('El archivo recibido está vacío');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `justificacion_${idJustificacion}_${estudianteNombre}_${estudianteApellido}.jpg`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log("✅ Descarga completada exitosamente");
      
    } catch (error) {
      console.error("❌ Error al descargar:", error);
      setError(`Error al descargar: ${error.message}`);
      alert(`Error al descargar el archivo: ${error.message}`);
    }
  };

  // 👁️ Función para ver la imagen
  const verImagen = async (idJustificacion, estudianteNombre, estudianteApellido) => {
    try {
      setCargandoImagen(true);
      setError("");
      setZoomLevel(1);
      const token = localStorage.getItem("token");
      
      console.log(`👁️ Solicitando imagen para justificación ID: ${idJustificacion}`);
      
      const response = await fetch(
        `http://localhost:3000/api/coordinador/justificacion/descargar/${idJustificacion}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setImagenActual({
        url: url,
        nombre: `${estudianteNombre} ${estudianteApellido}`,
        id: idJustificacion,
        fecha: new Date().toLocaleDateString()
      });
      
    } catch (error) {
      console.error("❌ Error al cargar la imagen:", error);
      setError(`Error al cargar la imagen: ${error.message}`);
    } finally {
      setCargandoImagen(false);
    }
  };

  // Cerrar la vista de imagen
  const cerrarImagen = () => {
    if (imagenActual && imagenActual.url) {
      window.URL.revokeObjectURL(imagenActual.url);
    }
    setImagenActual(null);
    setZoomLevel(1);
  };

  // Controles de zoom
  const zoomIn = () => {
    setZoomLevel(prev => {
      if (prev >= 3) return prev;
      return prev + 0.25;
    });
  };

  const zoomOut = () => {
    setZoomLevel(prev => {
      if (prev <= 0.5) return prev;
      return prev - 0.25;
    });
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  // 🔍 Ver información del archivo
  const verInfoArchivo = async (idJustificacion) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/coordinador/justificacion/verificar-archivo/${idJustificacion}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const data = await response.json();
      
      let tipoArchivo = 'Desconocido';
      if (data.primerosBytes) {
        const hex = data.primerosBytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        if (hex.startsWith('FFD8')) tipoArchivo = 'JPEG';
        else if (hex === '89504E47') tipoArchivo = 'PNG';
        else if (hex === '25504446') tipoArchivo = 'PDF';
        else if (hex === '47494638') tipoArchivo = 'GIF';
      }
      
      // Crear un modal de Bootstrap para mostrar la información
      const modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-info text-white">
              <h5 class="modal-title">
                <i class="bi bi-file-earmark-text me-2"></i>
                Información del Archivo
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <h6><i class="bi bi-card-text me-2"></i>Detalles Técnicos</h6>
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <tbody>
                          <tr>
                            <th>ID Justificación:</th>
                            <td>${data.id_justificacion}</td>
                          </tr>
                          <tr>
                            <th>Tamaño:</th>
                            <td>${data.tamaño} bytes (${(data.tamaño / 1024).toFixed(2)} KB)</td>
                          </tr>
                          <tr>
                            <th>Tipo detectado:</th>
                            <td><span class="badge bg-primary">${tipoArchivo}</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Este archivo es una imagen JPEG, no un PDF. Formato aceptado para visualización.
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
      
      modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
      });
      
    } catch (error) {
      console.error('Error al verificar archivo:', error);
      alert('Error al obtener información del archivo.');
    }
  };

  // 🔎 Filtrar justificaciones
  const justificacionesFiltradas = justificaciones
    .filter((j) => {
      // Filtro por nombre de estudiante
      if (filtroEstudiante) {
        const nombre = `${j?.estudiante?.persona?.nombre || ""} ${j?.estudiante?.persona?.apellido || ""}`.toLowerCase();
        if (!nombre.includes(filtroEstudiante.toLowerCase())) return false;
      }

      // Filtro por estado
      if (filtroEstado !== "todos" && j.estado !== filtroEstado) return false;

      // Filtro por fecha
      if (filtroFecha) {
        const fechaJustificacion = new Date(j.fecha).toISOString().split('T')[0];
        if (fechaJustificacion !== filtroFecha) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (orden === "desc") {
        return new Date(b.fecha) - new Date(a.fecha);
      } else {
        return new Date(a.fecha) - new Date(b.fecha);
      }
    });

  // Obtener estadísticas
  const estadisticas = {
    total: justificaciones.length,
    aprobadas: justificaciones.filter(j => j.estado === "aprobado").length,
    pendientes: justificaciones.filter(j => j.estado === "pendiente").length,
    rechazadas: justificaciones.filter(j => j.estado === "rechazado").length,
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h1 className="h2 fw-bold">
                <i className="bi bi-file-text me-2"></i>
                Justificaciones de Estudiantes
              </h1>
              <p className="text-muted mb-0">
                Gestiona y revisa las justificaciones enviadas por tus estudiantes
              </p>
            </div>
            <div className="mt-2 mt-md-0">
              <span className="badge bg-primary fs-6">
                <i className="bi bi-journal-check me-1"></i>
                {estadisticas.total} justificaciones
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-start border-success border-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-check-circle-fill text-success fs-3"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-0">Aprobadas</h6>
                  <h4 className="fw-bold mb-0">{estadisticas.aprobadas}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-start border-warning border-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-clock-fill text-warning fs-3"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-0">Pendientes</h6>
                  <h4 className="fw-bold mb-0">{estadisticas.pendientes}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-start border-danger border-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-x-circle-fill text-danger fs-3"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-0">Rechazadas</h6>
                  <h4 className="fw-bold mb-0">{estadisticas.rechazadas}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-start border-primary border-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-files text-primary fs-3"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-0">Total</h6>
                  <h4 className="fw-bold mb-0">{estadisticas.total}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h6 className="card-title mb-0">
                <i className="bi bi-funnel me-2"></i>
                Filtros de Búsqueda
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-search me-2"></i>
                    Buscar Estudiante
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre del estudiante..."
                      value={filtroEstudiante}
                      onChange={(e) => setFiltroEstudiante(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-filter me-2"></i>
                    Estado
                  </label>
                  <select 
                    className="form-select"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>
                
                <div className="col-md-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-calendar me-2"></i>
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                  />
                </div>
                
                <div className="col-md-2">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-sort-down me-2"></i>
                    Ordenar por
                  </label>
                  <select 
                    className="form-select"
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                  >
                    <option value="desc">Más reciente</option>
                    <option value="asc">Más antiguo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de justificaciones */}
      <div className={`row ${imagenActual ? 'gx-4' : ''}`}>
        <div className={`${imagenActual ? 'col-lg-8' : 'col-12'}`}>
          <div className="card shadow-lg border-0">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="card-title mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  Lista de Justificaciones
                </h5>
                <div className="text-muted small mt-2 mt-md-0">
                  Mostrando {justificacionesFiltradas.length} de {justificaciones.length}
                </div>
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                    <div>
                      <h6 className="alert-heading mb-1">Error</h6>
                      <p className="mb-0">{error}</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}
              
              {cargando ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-3 text-muted">Cargando justificaciones...</p>
                </div>
              ) : justificaciones.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-folder-x display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No hay justificaciones registradas</h5>
                  <p className="text-muted">No se encontraron justificaciones para tus estudiantes.</p>
                </div>
              ) : justificacionesFiltradas.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-search display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No se encontraron resultados</h5>
                  <p className="text-muted">Intenta con otros criterios de búsqueda.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th width="20%">
                          <i className="bi bi-person me-1"></i>
                          Estudiante
                        </th>
                        <th width="15%">
                          <i className="bi bi-calendar me-1"></i>
                          Fecha
                        </th>
                        <th width="25%">
                          <i className="bi bi-chat-text me-1"></i>
                          Motivo
                        </th>
                        <th width="15%">
                          <i className="bi bi-tag me-1"></i>
                          Estado
                        </th>
                        <th width="25%">
                          <i className="bi bi-gear me-1"></i>
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {justificacionesFiltradas.map((j) => {
                        const tieneArchivo = j.archivo && 
                          (j.archivo.data?.length > 0 || j.archivo.length > 0);
                        
                        const getEstadoBadge = (estado) => {
                          switch(estado) {
                            case 'aprobado':
                              return <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Aprobado</span>;
                            case 'pendiente':
                              return <span className="badge bg-warning"><i className="bi bi-clock me-1"></i>Pendiente</span>;
                            case 'rechazado':
                              return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>Rechazado</span>;
                            default:
                              return <span className="badge bg-secondary">{estado}</span>;
                          }
                        };
                        
                        return (
                          <tr key={j.id_justificacion} className={!tieneArchivo ? 'table-warning' : ''}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                                       style={{width: '36px', height: '36px', fontSize: '14px'}}>
                                    {j?.estudiante?.persona?.nombre?.charAt(0)}{j?.estudiante?.persona?.apellido?.charAt(0)}
                                  </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <strong className="d-block">
                                    {j?.estudiante?.persona?.nombre} {j?.estudiante?.persona?.apellido}
                                  </strong>
                                  <small className="text-muted">{j?.estudiante?.grado}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="fw-semibold">{formatearFecha(j.fecha)}</span>
                            </td>
                            <td>
                              <div className="text-truncate" style={{maxWidth: '250px'}} title={j.motivo}>
                                {j.motivo}
                              </div>
                            </td>
                            <td>
                              {getEstadoBadge(j.estado)}
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-2">
                                <button
                                  onClick={() => descargarArchivo(
                                    j.id_justificacion, 
                                    j?.estudiante?.persona?.nombre, 
                                    j?.estudiante?.persona?.apellido
                                  )}
                                  className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                  disabled={!tieneArchivo}
                                  title="Descargar archivo"
                                >
                                  <i className="bi bi-download me-1"></i>
                                  <span className="d-none d-md-inline">Descargar</span>
                                </button>
                                
                                <button
                                  onClick={() => verImagen(
                                    j.id_justificacion,
                                    j?.estudiante?.persona?.nombre,
                                    j?.estudiante?.persona?.apellido
                                  )}
                                  className="btn btn-sm btn-outline-success d-flex align-items-center"
                                  disabled={!tieneArchivo}
                                  title="Vista previa"
                                >
                                  <i className="bi bi-eye me-1"></i>
                                  <span className="d-none d-md-inline">Ver</span>
                                </button>
                                
                                <button
                                  onClick={() => verInfoArchivo(j.id_justificacion)}
                                  className="btn btn-sm btn-outline-info d-flex align-items-center"
                                  title="Información del archivo"
                                >
                                  <i className="bi bi-info-circle me-1"></i>
                                </button>
                                
                                {!tieneArchivo && (
                                  <span className="badge bg-warning">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    Sin archivo
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel de vista previa de imagen */}
        {imagenActual && (
          <div className="col-lg-4 col-12">
            <div className="card shadow-lg border-0 h-100">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 className="card-title mb-0">
                  <i className="bi bi-image me-2"></i>
                  Vista Previa
                </h6>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={cerrarImagen}
                  aria-label="Cerrar"
                ></button>
              </div>
              
              <div className="card-body d-flex flex-column">
                {cargandoImagen ? (
                  <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Cargando imagen...</span>
                    </div>
                    <p className="text-muted">Cargando imagen...</p>
                  </div>
                ) : (
                  <>
                    {/* Contenedor de imagen con scroll */}
                    <div 
                      className="flex-grow-1 border rounded overflow-auto mb-3" 
                      style={{ minHeight: '300px', maxHeight: '400px' }}
                    >
                      <div className="d-flex justify-content-center align-items-center p-3" style={{ minHeight: '300px' }}>
                        <img 
                          src={imagenActual.url} 
                          alt={`Justificación de ${imagenActual.nombre}`}
                          className="img-fluid"
                          style={{ 
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: 'center center',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Información de la imagen */}
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Información
                      </h6>
                      <div className="row g-2">
                        <div className="col-6">
                          <small className="text-muted">Estudiante</small>
                          <div className="fw-semibold">{imagenActual.nombre}</div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">ID</small>
                          <div className="fw-semibold">{imagenActual.id}</div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Fecha vista</small>
                          <div className="fw-semibold">{imagenActual.fecha}</div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Zoom</small>
                          <div className="fw-semibold">{Math.round(zoomLevel * 100)}%</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Controles de zoom */}
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3">
                        <i className="bi bi-zoom-in me-2"></i>
                        Controles de Zoom
                      </h6>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={zoomOut}
                            disabled={zoomLevel <= 0.5}
                            title="Alejar"
                          >
                            <i className="bi bi-dash-lg"></i>
                          </button>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={resetZoom}
                            title="Resetear zoom"
                          >
                            <i className="bi bi-arrow-counterclockwise"></i>
                          </button>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={zoomIn}
                            disabled={zoomLevel >= 3}
                            title="Acercar"
                          >
                            <i className="bi bi-plus-lg"></i>
                          </button>
                        </div>
                        <span className="badge bg-primary fs-6 px-3">
                          {Math.round(zoomLevel * 100)}%
                        </span>
                      </div>
                      
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ width: `${((zoomLevel - 0.5) / 2.5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Botón de descarga */}
                    <div className="mt-auto">
                      <a 
                        href={imagenActual.url} 
                        download={`justificacion_${imagenActual.id}.jpg`}
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                      >
                        <i className="bi bi-download me-2"></i>
                        Descargar Imagen
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerJustificacionesEstudiantes;