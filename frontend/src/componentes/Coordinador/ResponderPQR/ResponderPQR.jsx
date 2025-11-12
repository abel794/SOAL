// 📌 ResponderPqr.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./ResponderPQR.css";

// 🎯 Constantes y configuración
const ESTADOS_PQR = {
  PENDIENTE: "1",
  EN_PROCESO: "2", 
  RESUELTO: "3",
  RECHAZADO: "4"
};

const API_ENDPOINTS = {
  PQR: "http://localhost:3000/api/coordinador/pqr",
  HISTORIAL: (id) => `http://localhost:3000/api/coordinador/pqr/${id}/historial`,
  RESPONDER: (id) => `http://localhost:3000/api/coordinador/pqr/${id}/responder`
};

// 🎯 Custom Hook para gestión de PQRs
const usePqrManager = () => {
  const [pqrs, setPqrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const getHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const cargarPqrs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.PQR, getHeaders());
      setPqrs(res.data || []);
    } catch (err) {
      console.error("Error al cargar PQRs:", err);
      throw new Error("No se pudieron cargar las PQRs");
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  return { pqrs, loading, cargarPqrs, setPqrs };
};

// 🎯 Componente: Tarjeta de PQR Individual
const PqrCard = ({ pqr, isSelected, onSelect }) => {
  const getEstadoBadge = (estadoNombre) => {
    const estados = {
      "Resuelto": "badge-success",
      "Pendiente": "badge-warning",
      "Rechazado": "badge-danger",
      "default": "badge-primary"
    };
    return estados[estadoNombre] || estados.default;
  };

  return (
    <tr className={isSelected ? "table-active" : ""}>
      <td className="fw-semibold">#{pqr.id_pqr}</td>
      <td>
        <div className="user-info">
          <div className="user-name text-body-secondary">
            {pqr.acudiente?.persona?.nombre} {pqr.acudiente?.persona?.apellido}
          </div>
          <small className="text-muted">{pqr.acudiente?.persona?.correo}</small>
        </div>
      </td>
      <td>
        <div className="descripcion-truncada" title={pqr.descripcion}>
          {pqr.descripcion}
        </div>
      </td>
      <td>
        <span className={`badge ${getEstadoBadge(pqr.estado?.nombre)}`}>
          {pqr.estado?.nombre}
        </span>
      </td>
      <td>
        <div className="fecha-info">
          <div>{new Date(pqr.fecha).toLocaleDateString()}</div>
          <small className="text-muted">
            {new Date(pqr.fecha).toLocaleTimeString()}
          </small>
        </div>
      </td>
      <td>
        <button
          className={`btn btn-action ${isSelected ? "btn-primary" : "btn-outline"}`}
          onClick={() => onSelect(pqr.id_pqr)}
        >
          {isSelected ? "✓ Seleccionado" : "📩 Responder"}
        </button>
      </td>
    </tr>
  );
};

// 🎯 Componente: Lista de PQRs
const PqrList = ({ pqrs, loading, selectedPqr, onSelectPqr }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando PQRs...</p>
      </div>
    );
  }

  return (
    <div className="pqr-list-container">
      <div className="list-header">
        <h3>📋 Lista de Solicitudes</h3>
        <span className="badge bg-primary">{pqrs.length} PQRs</span>
      </div>
      
      <div className="table-container">
        <table className="pqr-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Acudiente</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pqrs.length > 0 ? (
              pqrs.map((pqr) => (
                <PqrCard
                  key={pqr.id_pqr}
                  pqr={pqr}
                  isSelected={selectedPqr === pqr.id_pqr}
                  onSelect={onSelectPqr}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  <div className="no-data-content">
                    <span className="no-data-icon">📭</span>
                    <p>No hay PQRs pendientes</p>
                    <small>Todas las solicitudes están gestionadas</small>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🎯 Componente: Item del Historial
const HistorialItem = ({ item }) => (
  <div className="historial-item">
    <div className="historial-header">
      <div className="user-info">
        <span className="user-avatar">
          {item.usuario_respuesta?.username?.charAt(0).toUpperCase() || "S"}
        </span>
        <div>
          <strong>{item.usuario_respuesta?.username || "Sistema"}</strong>
          <small>{new Date(item.fecha).toLocaleString()}</small>
        </div>
      </div>
      <span className={`estado-badge estado-${item.estado_historial?.nombre?.toLowerCase()}`}>
        {item.estado_historial?.nombre}
      </span>
    </div>
    <div className="historial-mensaje">
      {item.mensaje}
    </div>
  </div>
);

// 🎯 Componente: Panel de Historial
const HistorialPanel = ({ historial, selectedPqr }) => (
  <div className="historial-container">
    <div className="panel-header">
      <h3>🕒 Historial de PQR #{selectedPqr}</h3>
      <span className="badge bg-secondary">{historial.length} mensajes</span>
    </div>
    
    <div className="historial-list">
      {historial.length > 0 ? (
        historial.map((item) => (
          <HistorialItem key={item.id_historial_pqr} item={item} />
        ))
      ) : (
        <div className="empty-historial">
          <span className="empty-icon">💬</span>
          <p>No hay mensajes en el historial</p>
          <small>Sé el primero en responder esta PQR</small>
        </div>
      )}
    </div>
  </div>
);

// 🎯 Componente: Formulario de Respuesta
const RespuestaForm = ({ mensaje, estadoPqr, onSubmit, onMensajeChange, onEstadoChange }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="respuesta-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <label className="form-label">✏️ Tu Respuesta</label>
        <textarea
          className="form-textarea"
          value={mensaje}
          onChange={(e) => onMensajeChange(e.target.value)}
          placeholder="Escribe tu respuesta detallada aquí..."
          rows="4"
          required
        />
        <div className="char-count">
          {mensaje.length}/500 caracteres
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">🎯 Cambiar Estado</label>
        <select
          className="form-select"
          value={estadoPqr}
          onChange={(e) => onEstadoChange(e.target.value)}
          required
        >
          <option value="">-- Selecciona el nuevo estado --</option>
          <option value={ESTADOS_PQR.PENDIENTE}>⏳ Pendiente</option>
          <option value={ESTADOS_PQR.EN_PROCESO}>🔄 En proceso</option>
          <option value={ESTADOS_PQR.RESUELTO}>✅ Resuelto</option>
          <option value={ESTADOS_PQR.RECHAZADO}>❌ Rechazado</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={!mensaje.trim() || !estadoPqr}
      >
        🚀 Enviar Respuesta
      </button>
    </form>
  );
};

// 🎯 Componente Principal
const ResponderPqr = () => {
  const { pqrs, loading, cargarPqrs } = usePqrManager();
  const [selectedPqr, setSelectedPqr] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [estadoPqr, setEstadoPqr] = useState("");
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const token = localStorage.getItem("token");

  const getHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  // 🎯 Cargar historial de PQR
  const cargarHistorial = useCallback(async (idPqr) => {
    try {
      setLoadingHistorial(true);
      const res = await axios.get(API_ENDPOINTS.HISTORIAL(idPqr), getHeaders());
      setHistorial(res.data || []);
    } catch (err) {
      console.error("Error al cargar historial:", err);
      Swal.fire("Error", "No se pudo cargar el historial.", "error");
    } finally {
      setLoadingHistorial(false);
    }
  }, [getHeaders]);

  // 🎯 Manejar selección de PQR
  const manejarSeleccionPqr = useCallback(async (idPqr) => {
    setSelectedPqr(idPqr);
    setMensaje("");
    setEstadoPqr("");
    await cargarHistorial(idPqr);
  }, [cargarHistorial]);

  // 🎯 Validar y enviar respuesta
  const manejarEnvioRespuesta = useCallback(async () => {
    if (!mensaje.trim() || !estadoPqr) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debes escribir un mensaje y seleccionar un estado.",
      });
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Enviar respuesta?",
      text: "Esta acción no se puede deshacer.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#127c32",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.post(
        API_ENDPOINTS.RESPONDER(selectedPqr),
        { 
          mensaje: mensaje.trim(), 
          id_estado_pqr: estadoPqr 
        },
        getHeaders()
      );

      const esRechazado = estadoPqr === ESTADOS_PQR.RECHAZADO;
      await Swal.fire({
        icon: esRechazado ? "error" : "success",
        title: esRechazado 
          ? "❌ PQR rechazada correctamente" 
          : "✅ Respuesta enviada con éxito",
        timer: 2500,
        showConfirmButton: false,
      });

      // Reset y recarga
      setMensaje("");
      setEstadoPqr("");
      await cargarHistorial(selectedPqr);
      await cargarPqrs();
      
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
      Swal.fire("Error", "No se pudo enviar la respuesta.", "error");
    }
  }, [selectedPqr, mensaje, estadoPqr, getHeaders, cargarHistorial, cargarPqrs]);

  // 🎯 Efecto inicial
  useEffect(() => {
    cargarPqrs();
  }, [cargarPqrs]);

  return (
    <div className="responder-pqr-container">
      <header className="page-header">
        <div className="header-content">
          <h1 className="page-title">📬 Bandeja de PQR</h1>
          <p className="page-subtitle">
            Gestiona y responde las solicitudes de la comunidad educativa
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{pqrs.length}</span>
            <span className="stat-label">Total PQRs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {pqrs.filter(p => p.estado?.nombre === "Pendiente").length}
            </span>
            <span className="stat-label">Pendientes</span>
          </div>
        </div>
      </header>

      <div className="content-grid">
        {/* Panel izquierdo - Lista de PQRs */}
        <div className="left-panel">
          <PqrList
            pqrs={pqrs}
            loading={loading}
            selectedPqr={selectedPqr}
            onSelectPqr={manejarSeleccionPqr}
          />
        </div>

        {/* Panel derecho - Historial y Respuesta */}
        <div className="right-panel">
          {selectedPqr ? (
            <>
              <HistorialPanel 
                historial={historial} 
                selectedPqr={selectedPqr} 
              />
              
              <div className="respuesta-panel">
                <div className="panel-header">
                  <h3>📝 Responder PQR</h3>
                </div>
                <RespuestaForm
                  mensaje={mensaje}
                  estadoPqr={estadoPqr}
                  onSubmit={manejarEnvioRespuesta}
                  onMensajeChange={setMensaje}
                  onEstadoChange={setEstadoPqr}
                />
              </div>
            </>
          ) : (
            <div className="empty-selection">
              <div className="empty-content">
                <span className="empty-icon">👆</span>
                <h3>Selecciona una PQR</h3>
                <p>Elige una solicitud de la lista para ver el historial y responder</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponderPqr;