// HistorialPQR.jsx - VERSIÓN SIMPLE Y FUNCIONAL
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const HistorialPQR = () => {
  // Estados principales
  const [misPqrs, setMisPqrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historial, setHistorial] = useState([]);
  const [selectedPqr, setSelectedPqr] = useState(null);
  const [search, setSearch] = useState("");

  // Obtener token
  const getToken = () => localStorage.getItem("token");

  // Formatear fecha
  const formatDate = (fecha) => {
    if (!fecha) return "-";
    try {
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return "-";
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
    } catch {
      return "-";
    }
  };

  // Estilo de badge según estado
  const getBadgeClass = (estado) => {
    if (!estado) return "badge bg-secondary";
    const estadoStr = estado.toString().toLowerCase();
    
    if (estadoStr.includes("pendiente")) return "badge bg-warning text-dark";
    if (estadoStr.includes("respondido")) return "badge bg-success";
    if (estadoStr.includes("cerrado")) return "badge bg-secondary";
    if (estadoStr.includes("proceso")) return "badge bg-info";
    if (estadoStr.includes("revisión") || estadoStr.includes("revision")) return "badge bg-primary";
    return "badge bg-secondary";
  };

  // Icono según tipo
  const getTipoIcon = (tipo) => {
    if (!tipo) return "bi-file-earmark-text";
    const tipoStr = tipo.toString().toLowerCase();
    
    if (tipoStr.includes("queja")) return "bi-exclamation-triangle";
    if (tipoStr.includes("peticion") || tipoStr.includes("petición")) return "bi-chat-square-text";
    if (tipoStr.includes("reclamo")) return "bi-flag";
    return "bi-file-earmark-text";
  };

  // Cargar PQRS
  const cargarPqrs = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = getToken();
      if (!token) {
        setError("No hay sesión activa. Inicia sesión.");
        setMisPqrs([]);
        return;
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/acudientes/pqr/mis-pqrs`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log("Datos recibidos:", res.data);

      // Extraer datos de diferentes formatos
      let data = [];
      
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      } else if (res.data?.pqrs && Array.isArray(res.data.pqrs)) {
        data = res.data.pqrs;
      } else if (res.data?.solicitudes && Array.isArray(res.data.solicitudes)) {
        data = res.data.solicitudes;
      } else {
        // Buscar cualquier array
        for (const key in res.data) {
          if (Array.isArray(res.data[key])) {
            data = res.data[key];
            break;
          }
        }
      }

      // Mapear datos
      const mapeados = data.map((item, index) => ({
        id_pqr: item.id_pqr || item.id || item.codigo || `PQR-${index + 1}`,
        asunto: item.asunto || item.titulo || item.descripcion || "Sin asunto",
        descripcion: item.descripcion || item.detalle || item.asunto || "",
        tipo: item.tipo || item.categoria || item.tipo_pqr || "General",
        estado: item.estado || item.status || "Pendiente",
        fecha: item.fecha || item.createdAt || item.fecha_creacion || new Date().toISOString()
      }));

      setMisPqrs(mapeados);

    } catch (err) {
      console.error("Error:", err);
      
      if (err.response?.status === 401) {
        setError("Sesión expirada. Inicia sesión nuevamente.");
      } else if (err.response?.status === 404) {
        setError("No se encontraron PQRs.");
      } else if (!navigator.onLine) {
        setError("Sin conexión a internet.");
      } else {
        setError("Error al cargar las PQRs. Intenta de nuevo.");
      }
      
      setMisPqrs([]);
    } finally {
      setLoading(false);
    }
  };

  // Ver historial
  const verHistorial = async (idPqr) => {
    if (!idPqr) return;
    
    setSelectedPqr(idPqr);
    setHistorial([]);

    try {
      const token = getToken();
      const url = `${process.env.REACT_APP_API_URL}/api/acudientes/pqr/${idPqr}/historial`;

      const res = await axios.get(url, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Extraer historial
      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data?.data) {
        data = res.data.data;
      } else if (res.data?.historial) {
        data = res.data.historial;
      }

      // Ordenar por fecha
      data.sort((a, b) => {
        const fa = new Date(a.fecha || a.createdAt || 0).getTime();
        const fb = new Date(b.fecha || b.createdAt || 0).getTime();
        return fa - fb;
      });

      setHistorial(data);

    } catch (err) {
      console.error("Error cargando historial:", err);
      setHistorial([]);
    }
  };

  // Cargar al inicio
  useEffect(() => {
    cargarPqrs();
  }, []);

  // Filtrar PQRS
  const filteredPqrs = misPqrs.filter(p => {
    if (!search) return true;
    
    const searchText = `${p.asunto} ${p.tipo} ${p.estado} ${p.descripcion}`.toLowerCase();
    return searchText.includes(search.toLowerCase());
  });

  // Estilos inline para simplificar
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    mainCard: {
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1.5rem 2rem',
      borderBottom: 'none'
    },
    pqrCard: {
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '1rem',
      marginBottom: '1rem',
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    pqrCardHover: {
      borderColor: '#667eea',
      boxShadow: '0 5px 15px rgba(102, 126, 234, 0.2)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        {/* Header */}
        <div style={styles.header}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white'
              }}>
                <i className="bi bi-journal-text"></i>
              </div>
              <div>
                <h4 className="mb-1 fw-bold text-white">Mis Solicitudes PQR</h4>
                <p className="mb-0 text-white text-opacity-90">
                  Consulta el estado y el historial de tus solicitudes
                </p>
              </div>
            </div>
            <button 
              className="btn btn-sm btn-outline-light"
              onClick={cargarPqrs}
              disabled={loading}
            >
              <i className={`bi ${loading ? 'bi-arrow-clockwise' : 'bi-arrow-clockwise'}`}></i>
            </button>
          </div>
        </div>

        {/* Filtro de búsqueda */}
        <div className="p-3">
          <div className="input-group">
            <span className="input-group-text bg-transparent">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar PQRs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setSearch("")}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted">Cargando tus solicitudes...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                <div>
                  <p className="mb-0">{error}</p>
                  <button 
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={cargarPqrs}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          ) : filteredPqrs.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox-fill display-1 text-muted opacity-50 mb-3"></i>
              <h5 className="text-muted mb-3">No tienes solicitudes registradas</h5>
              <p className="text-muted">Cuando crees una PQR, aparecerá aquí</p>
            </div>
          ) : (
            <div className="row">
              {filteredPqrs.map((item) => (
                <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id_pqr}>
                  <div 
                    className="card h-100"
                    style={{
                      border: selectedPqr === item.id_pqr ? '2px solid #28a745' : '1px solid #ddd',
                      cursor: 'pointer'
                    }}
                    onClick={() => verHistorial(item.id_pqr)}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <i className={`bi ${getTipoIcon(item.tipo)} fs-3 text-primary`}></i>
                        </div>
                        <span className={getBadgeClass(item.estado)}>
                          {item.estado}
                        </span>
                      </div>
                      
                      <h6 className="fw-bold mb-2">{item.asunto}</h6>
                      
                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">
                          <i className="bi bi-tag me-1"></i>
                          {item.tipo}
                        </small>
                        <small className="text-muted d-block">
                          <i className="bi bi-calendar3 me-1"></i>
                          {formatDate(item.fecha)}
                        </small>
                      </div>

                      {item.descripcion && (
                        <p className="text-muted small" style={{
                          height: '40px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.descripcion.substring(0, 80)}...
                        </p>
                      )}

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">ID: {item.id_pqr}</small>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            verHistorial(item.id_pqr);
                          }}
                        >
                          <i className="bi bi-clock-history me-1"></i>
                          Historial
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Panel de historial */}
          {selectedPqr && (
            <div className="mt-5">
              <div className="card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-clock-history me-2"></i>
                    Historial PQR #{selectedPqr}
                  </h5>
                  <button 
                    className="btn btn-sm btn-outline-light"
                    onClick={() => setSelectedPqr(null)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="card-body">
                  {historial.length === 0 ? (
                    <p className="text-muted text-center py-3">No hay historial disponible</p>
                  ) : (
                    <div className="list-group">
                      {historial.map((item, index) => (
                        <div className="list-group-item" key={index}>
                          <div className="d-flex justify-content-between mb-2">
                            <strong>
                              {item.usuario?.username || item.usuario?.nombre || "Sistema"}
                            </strong>
                            <small className="text-muted">
                              {formatDate(item.fecha)}
                            </small>
                          </div>
                          <p className="mb-0">{item.respuesta || item.mensaje || "Sin detalles"}</p>
                          {item.estado && (
                            <div className="mt-2">
                              <span className={getBadgeClass(item.estado)}>
                                {item.estado}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Mostrando {filteredPqrs.length} de {misPqrs.length} solicitudes
            </small>
            <small className="text-muted">
              <i className="bi bi-arrow-clockwise me-1"></i>
              {new Date().toLocaleTimeString()}
            </small>
          </div>
        </div>
      </div>

      {/* Estilos inline adicionales */}
      <style>{`
        .card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .list-group-item {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default HistorialPQR;