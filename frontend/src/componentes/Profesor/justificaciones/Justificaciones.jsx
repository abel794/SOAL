import React, { useEffect, useState } from "react";
import './Justificaciones.css';

const VerJustificacionesEstudiantes = () => {
  const [justificaciones, setJustificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstudiante, setFiltroEstudiante] = useState("");
  const [imagenActual, setImagenActual] = useState(null);
  const [cargandoImagen, setCargandoImagen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const obtenerJustificaciones = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token de sesión");

        const response = await fetch(
          "http://localhost:3000/api/coordinador/justificacion/justificaciones-grupo",
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
        id: idJustificacion
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
      return prev + 0.5;
    });
  };

  const zoomOut = () => {
    setZoomLevel(prev => {
      if (prev <= 0.5) return prev;
      return prev - 0.5;
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
      
      alert(`📊 Información del archivo:\n\n` +
            `ID: ${data.id_justificacion}\n` +
            `Tamaño: ${data.tamaño} bytes\n` +
            `Tipo detectado: ${tipoArchivo}\n` +
            `Primeros bytes: [${data.primerosBytes?.join(', ')}]\n\n` +
            `ℹ️ Este archivo es una imagen JPEG, no un PDF.`);
      
    } catch (error) {
      console.error('Error al verificar archivo:', error);
    }
  };

  // 🔎 Filtrar por estudiante
  const justificacionesFiltradas = justificaciones.filter((j) => {
    if (!filtroEstudiante) return true;
    const nombre = `${j?.estudiante?.persona?.nombre || ""} ${j?.estudiante?.persona?.apellido || ""}`.toLowerCase();
    return nombre.includes(filtroEstudiante.toLowerCase());
  });

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Card principal de justificaciones */}
        <div className={`${imagenActual ? 'col-lg-8' : 'col-12'}`}>
          <div className="card shadow-lg mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>📚 Justificaciones de Estudiantes</h5>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por estudiante..."
                  value={filtroEstudiante}
                  onChange={(e) => setFiltroEstudiante(e.target.value)}
                />
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Error:</strong> {error}
                  <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
              )}
              
              {cargando ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : justificaciones.length === 0 ? (
                <p className="text-muted text-center">
                  No hay justificaciones registradas para sus estudiantes.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Estudiante</th>
                        <th>Fecha</th>
                        <th>Motivo</th>
                        <th>Tipo Archivo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {justificacionesFiltradas.map((j) => {
                        const tieneArchivo = j.archivo && 
                          (j.archivo.data?.length > 0 || j.archivo.length > 0);
                        
                        return (
                          <tr key={j.id_justificacion}>
                            <td>
                              <strong>
                                {j?.estudiante?.persona?.nombre} {j?.estudiante?.persona?.apellido}
                              </strong>
                            </td>
                            <td>{new Date(j.fecha).toLocaleDateString()}</td>
                            <td>
                              {j.motivo?.length > 80
                                ? `${j.motivo.substring(0, 80)}...`
                                : j.motivo}
                            </td>
                            <td>
                              {tieneArchivo ? (
                                <span className="badge bg-info">🖼️ JPEG</span>
                              ) : (
                                <span className="badge bg-secondary">Sin archivo</span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group">
                                <button
                                  onClick={() => descargarArchivo(
                                    j.id_justificacion, 
                                    j?.estudiante?.persona?.nombre, 
                                    j?.estudiante?.persona?.apellido
                                  )}
                                  className="btn btn-sm btn-outline-primary"
                                  disabled={!tieneArchivo}
                                >
                                  📥 Descargar
                                </button>
                                <button
                                  onClick={() => verImagen(
                                    j.id_justificacion,
                                    j?.estudiante?.persona?.nombre,
                                    j?.estudiante?.persona?.apellido
                                  )}
                                  className="btn btn-sm btn-outline-success"
                                  disabled={!tieneArchivo}
                                >
                                  👁️ Ver
                                </button>
                                <button
                                  onClick={() => verInfoArchivo(j.id_justificacion)}
                                  className="btn btn-sm btn-outline-info"
                                  title="Ver información del archivo"
                                >
                                  ℹ️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {justificacionesFiltradas.length === 0 &&
                    justificaciones.length > 0 && (
                      <div className="text-center text-muted mt-3">
                        No se encontraron coincidencias con la búsqueda.
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card de vista de imagen - se muestra al lado en desktop, debajo en mobile */}
        {imagenActual && (
          <div className="col-lg-4 col-12">
            <div className="card shadow-lg mb-4 image-preview-card">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  👁️ Vista Previa
                </h6>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={cerrarImagen}
                  aria-label="Cerrar"
                ></button>
              </div>
              
              <div className="card-body p-0">
                {cargandoImagen ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando imagen...</span>
                    </div>
                    <p className="mt-2 mb-0">Cargando imagen...</p>
                  </div>
                ) : (
                  <>
                    <div className="image-container" style={{ maxHeight: '400px', overflow: 'auto' }}>
                      <img 
                        src={imagenActual.url} 
                        alt={`Justificación de ${imagenActual.nombre}`}
                        className="img-fluid w-100"
                        style={{ 
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: 'center center'
                        }}
                      />
                    </div>
                    
                    <div className="p-3 bg-light border-top">
                      <div className="mb-2">
                        <strong>Estudiante:</strong> {imagenActual.nombre}
                      </div>
                      <div className="mb-3">
                        <strong>ID Justificación:</strong> {imagenActual.id}
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="zoom-controls-small">
                          <button 
                            className="btn btn-sm btn-outline-secondary me-1"
                            onClick={zoomOut}
                            disabled={zoomLevel <= 0.5}
                            title="Alejar"
                          >
                            −
                          </button>
                          <span className="mx-2">{Math.round(zoomLevel * 100)}%</span>
                          <button 
                            className="btn btn-sm btn-outline-secondary ms-1"
                            onClick={zoomIn}
                            disabled={zoomLevel >= 3}
                            title="Acercar"
                          >
                            +
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary ms-2"
                            onClick={resetZoom}
                            title="Resetear zoom"
                          >
                            ↺
                          </button>
                        </div>
                        
                        <a 
                          href={imagenActual.url} 
                          download={`justificacion_${imagenActual.id}.jpg`}
                          className="btn btn-primary btn-sm"
                        >
                          📥 Descargar
                        </a>
                      </div>
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