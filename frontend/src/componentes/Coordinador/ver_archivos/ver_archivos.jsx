// src/componentes/Coordinador/ver_archivos/ver_archivos.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ver_archivos.css';

export default function VerArchivos() {
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("todos");
  const [descargando, setDescargando] = useState({});

  useEffect(() => {
    const obtenerArchivos = async () => {
      try {
        setError(null);
        const res = await axios.get("http://localhost:3000/api/obtenerArchivos");
        setArchivos(res.data);
      } catch (error) {
        console.error("Error al obtener archivos:", error);
        setError("Error al cargar los archivos. Intente nuevamente.");
      } finally {
        setCargando(false);
      }
    };
    obtenerArchivos();
  }, []);

  // Obtener lista única de usuarios para filtro
  const usuarios = useMemo(() => {
    const usuariosUnicos = archivos.reduce((acc, archivo) => {
      if (archivo.usuario && archivo.usuario.id_usuario) {
        const key = archivo.usuario.id_usuario;
        if (!acc[key]) {
          acc[key] = {
            id_usuario: archivo.usuario.id_usuario,
            nombre: `${archivo.usuario.persona?.nombre || ''} ${archivo.usuario.persona?.apellido || ''}`.trim(),
            username: archivo.usuario.username
          };
        }
      }
      return acc;
    }, {});
    return Object.values(usuariosUnicos);
  }, [archivos]);

  const tiposArchivo = {
    imagen: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    pdf: ["application/pdf"],
    word: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    excel: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    texto: ["text/plain", "text/csv"],
    video: ["video/mp4", "video/mkv", "video/avi", "video/mov"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg"]
  };

  const archivosFiltrados = useMemo(() => {
    return archivos.filter(archivo => {
      // Filtro por búsqueda
      const coincideBusqueda = archivo.nombre_original
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
        archivo.tipo_documento?.toLowerCase().includes(busqueda.toLowerCase());
      
      // Filtro por tipo de archivo
      const coincideFiltroTipo = 
        filtro === "todos" ||
        (filtro === "imagen" && tiposArchivo.imagen.includes(archivo.tipo)) ||
        (filtro === "pdf" && tiposArchivo.pdf.includes(archivo.tipo)) ||
        (filtro === "documentos" && (tiposArchivo.word.includes(archivo.tipo) || tiposArchivo.excel.includes(archivo.tipo) || tiposArchivo.texto.includes(archivo.tipo))) ||
        (filtro === "multimedia" && (tiposArchivo.video.includes(archivo.tipo) || tiposArchivo.audio.includes(archivo.tipo))) ||
        (filtro === "otros" && !Object.values(tiposArchivo).flat().includes(archivo.tipo));
      
      // Filtro por usuario
      const coincideFiltroUsuario = 
        filtroUsuario === "todos" ||
        archivo.usuario?.id_usuario?.toString() === filtroUsuario;
      
      return coincideBusqueda && coincideFiltroTipo && coincideFiltroUsuario;
    });
  }, [archivos, filtro, busqueda, filtroUsuario]);

  const obtenerIconoArchivo = (tipo) => {
    if (tiposArchivo.imagen.includes(tipo)) return "bi-file-image text-primary";
    if (tiposArchivo.pdf.includes(tipo)) return "bi-file-pdf text-danger";
    if (tiposArchivo.word.includes(tipo)) return "bi-file-word text-primary";
    if (tiposArchivo.excel.includes(tipo)) return "bi-file-excel text-success";
    if (tiposArchivo.texto.includes(tipo)) return "bi-file-text text-info";
    if (tiposArchivo.video.includes(tipo)) return "bi-file-play text-warning";
    if (tiposArchivo.audio.includes(tipo)) return "bi-file-music text-warning";
    return "bi-file-earmark text-secondary";
  };

  const descargarArchivo = async (archivo) => {
    try {
      setDescargando(prev => ({ ...prev, [archivo.id_archivo]: true }));
      
      // Usar el endpoint de descarga directa
      const response = await axios.get(
      `http://localhost:3000/api/descargarArchivo/${archivo.id_archivo}`,
      { responseType: 'blob' }
    );
      
      // Crear URL para descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', archivo.nombre_original);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error al descargar:", error);
      // Fallback a base64 si la descarga directa falla
      if (archivo.contenido_base64) {
        const link = document.createElement('a');
        link.href = archivo.contenido_base64;
        link.download = archivo.nombre_original;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Error al descargar el archivo");
      }
    } finally {
      setDescargando(prev => ({ ...prev, [archivo.id_archivo]: false }));
    }
  };

  const formatearTamaño = (bytes) => {
    if (!bytes) return "N/A";
    const unidades = ['B', 'KB', 'MB', 'GB'];
    let tamaño = bytes;
    let unidad = 0;
    while (tamaño >= 1024 && unidad < unidades.length - 1) {
      tamaño /= 1024;
      unidad++;
    }
    return `${tamaño.toFixed(1)} ${unidades[unidad]}`;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando archivos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="ver-archivos-container">
        <h2 className="text-primary mb-4">
          <i className="bi bi-files me-2"></i>Archivos del Sistema
        </h2>

        {/* Controles de Filtrado y Búsqueda */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o tipo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="imagen">Imágenes</option>
              <option value="pdf">PDF</option>
              <option value="documentos">Documentos</option>
              <option value="multimedia">Multimedia</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
            >
              <option value="todos">Todos los usuarios</option>
              {usuarios.map(usuario => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre || usuario.username}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setBusqueda("");
                setFiltro("todos");
                setFiltroUsuario("todos");
              }}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Limpiar
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {/* Información de resultados */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted">
            Mostrando {archivosFiltrados.length} de {archivos.length} archivos
          </span>
          {(busqueda || filtro !== "todos" || filtroUsuario !== "todos") && (
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setBusqueda("");
                setFiltro("todos");
                setFiltroUsuario("todos");
              }}
            >
              <i className="bi bi-x-circle me-1"></i>
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Grid de Archivos */}
        {archivosFiltrados.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-folder-x fs-1 text-muted"></i>
            <p className="text-muted mt-2">
              {busqueda || filtro !== "todos" || filtroUsuario !== "todos" 
                ? "No se encontraron archivos con los filtros aplicados." 
                : "No hay archivos registrados en el sistema."}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {archivosFiltrados.map((archivo) => (
              <div key={archivo.id_archivo} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card shadow-sm border-0 h-100 file-card">
                  {archivo.tipo.startsWith("image/") ? (
                    <div className="file-image-container">
                      <img
                        src={archivo.contenido_base64}
                        alt={archivo.nombre_original}
                        className="card-img-top file-image"
                      />
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light file-icon-container">
                      <i className={`bi ${obtenerIconoArchivo(archivo.tipo)} fs-1`}></i>
                    </div>
                  )}
                  <div className="card-body">
                    <h6 className="card-title text-truncate" title={archivo.nombre_original}>
                      {archivo.nombre_original}
                    </h6>
                    
                    <div className="file-info mb-2">
                      <small className="text-muted d-block">
                        <strong>Tipo:</strong> {archivo.tipo.split('/')[1]?.toUpperCase() || archivo.tipo}
                      </small>
                      <small className="text-muted d-block">
                        <strong>Tamaño:</strong> {formatearTamaño(archivo.tamaño)}
                      </small>
                      {archivo.tipo_documento && (
                        <small className="text-muted d-block">
                          <strong>Documento:</strong> {archivo.tipo_documento}
                        </small>
                      )}
                    </div>

                    <div className="user-info border-top pt-2">
                      <small className="text-muted d-block">
                        <i className="bi bi-person me-1"></i>
                        {archivo.usuario?.persona?.nombre 
                          ? `${archivo.usuario.persona.nombre} ${archivo.usuario.persona.apellido}`
                          : archivo.usuario?.username || 'Usuario desconocido'
                        }
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        {formatearFecha(archivo.fecha_subida)}
                      </small>
                    </div>

                    <button
                      onClick={() => descargarArchivo(archivo)}
                      disabled={descargando[archivo.id_archivo]}
                      className="btn btn-outline-primary btn-sm mt-3 w-100"
                    >
                      {descargando[archivo.id_archivo] ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Descargando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-download me-1"></i>Descargar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}