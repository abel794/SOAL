import React, { useState, useEffect } from "react";
import "./style/NotificacionesSecretaria.css";
import ModalMensaje from "../../ui/ModalMensaje";

const NotificacionesSecretaria = () => {
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [grados, setGrados] = useState([]);
  const [caracteresRestantes, setCaracteresRestantes] = useState(500);

  // Estados para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState("info");
  const [modalTitulo, setModalTitulo] = useState("");
  const [modalMensaje, setModalMensaje] = useState("");

  const id_acudiente = 1;
  const id_canal = 1;
  const id_estado_notificacion = 1;

  const extractArray = (payload, possibleKeys = []) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    for (const k of possibleKeys) {
      if (Array.isArray(payload[k])) return payload[k];
    }
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  };

  // Contador de caracteres
  useEffect(() => {
    setCaracteresRestantes(500 - mensaje.length);
  }, [mensaje]);

  useEffect(() => {
    const cargarHistorial = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/notificaciones-secretaria?limit=10&offset=${page * 10}`
        );
        if (!res.ok) throw new Error("Error al cargar el historial");
        const data = await res.json();

        const notifs = extractArray(data, ["notificaciones", "rows", "notificaciones_secretaria"]);
        setHistorial(notifs);

        if (typeof data.totalPages === "number") setTotalPages(data.totalPages);
        else if (typeof data.total === "number") setTotalPages(Math.ceil(data.total / 10));
        else setTotalPages(Math.max(1, Math.ceil((notifs.length || 0) / 10)));
      } catch (error) {
        console.error(error.message);
        mostrarModal("error", "Error", "❌ No se pudo cargar el historial de notificaciones.");
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [page]);

  const mostrarModal = (tipo, titulo, mensaje) => {
    setModalTipo(tipo);
    setModalTitulo(titulo);
    setModalMensaje(mensaje);
    setModalVisible(true);
  };

  const enviarNotificacion = async () => {
    if (mensaje.trim() === "") {
      mostrarModal("advertencia", "Campo vacío", "Escribe un mensaje antes de enviarlo.");
      return;
    }
    if (!gradoSeleccionado) {
      mostrarModal("advertencia", "Sin grado seleccionado", "Selecciona un grado antes de enviar.");
      return;
    }

    try {
      const payload = {
        grado: gradoSeleccionado,
        mensaje,
        id_acudiente,
        id_canal,
        id_estado_notificacion,
      };

      const res = await fetch("http://localhost:3000/api/notificaciones-secretaria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al enviar la notificación");

      const nuevaNotificacion = await res.json();
      setHistorial((prev) => [nuevaNotificacion, ...prev]);
      setMensaje("");
      setGradoSeleccionado("");

      mostrarModal("exito", "Notificación enviada", `Notificación enviada con éxito al grado seleccionado.`);
    } catch (error) {
      mostrarModal("error", "Error", "Ocurrió un error al enviar la notificación.");
    }
  };

  useEffect(() => {
    const obtenerGrados = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/coordinador/grado");
        if (!res.ok) throw new Error("Error al obtener los grados");
        const data = await res.json();

        const gradosArray = extractArray(data, ["grados", "data", "rows"]);
        setGrados(gradosArray);
      } catch (error) {
        console.error("Error al obtener grados:", error.message);
        setGrados([]);
        mostrarModal("error", "Error", "No se pudieron cargar los grados.");
      } finally {
        setLoading(false);
      }
    };

    obtenerGrados();
  }, []);

  return (
    <div className="notificaciones-modernas">
      {/* Header */}
      <div className="notificaciones-header">
        <div className="header-content">
          <div className="header-icon">📢</div>
          <div className="header-text">
            <h1>Notificaciones de Secretaría</h1>
            <p>Envía y gestiona notificaciones para estudiantes, acudientes o docentes</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="section-card">
          <div className="card-header">
            <h2>Nueva Notificación</h2>
            <div className="header-decoration"></div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Selecciona un grado</label>
              <div className="select-wrapper">
                <select
                  className="modern-select"
                  value={gradoSeleccionado}
                  onChange={(e) => setGradoSeleccionado(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Selecciona un grado</option>
                  {grados.map((grado, index) => {
                    const key = grado.id ?? grado.id_grado ?? `${grado.nombre ?? "grado"}-${index}`;
                    const value = grado.id ?? grado.nombre ?? grado.nombre_grado ?? index;
                    const label = grado.nombre_grado ?? grado.nombre ?? `Grado ${value}`;
                    return (
                      <option key={key} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </select>
                <div className="select-arrow">▼</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mensaje</label>
              <div className="textarea-wrapper">
                <textarea
                  className="modern-textarea"
                  placeholder="Escribe el mensaje de la notificación..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  maxLength={500}
                  rows={4}
                />
                <div className={`char-counter ${caracteresRestantes < 50 ? 'warning' : ''}`}>
                  {caracteresRestantes} caracteres restantes
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="send-button"
                onClick={enviarNotificacion}
                disabled={loading}
              >
                <span className="button-icon">✈️</span>
                Enviar Notificación
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Historial Section */}
      <div className="historial-section">
        <div className="section-card">
          <div className="card-header">
            <h2>Historial de Notificaciones</h2>
            <div className="header-decoration"></div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando notificaciones...</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Acudiente</th>
                      <th>Mensaje</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((n, i) => (
                      <tr key={n.id_notificacion ?? n.id ?? i} className="table-row">
                        <td className="cell-id">{n.id_notificacion ?? n.id ?? i}</td>
                        <td className="cell-acudiente">{n.id_acudiente ?? n.acudiente ?? "-"}</td>
                        <td className="cell-mensaje">{n.mensaje}</td>
                        <td className="cell-fecha">
                          {n.fecha_envio ? new Date(n.fecha_envio).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {historial.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No hay notificaciones</h3>
                  <p>Las notificaciones que envíes aparecerán aquí</p>
                </div>
              )}
            </>
          )}

          {/* Paginación */}
          {historial.length > 0 && (
            <div className="pagination">
              <button
                className="pagination-btn prev"
                onClick={() => setPage(Math.max(page - 1, 0))}
                disabled={page === 0}
              >
                ← Anterior
              </button>
              
              <span className="page-info">
                Página <strong>{page + 1}</strong> de <strong>{totalPages}</strong>
              </span>
              
              <button
                className="pagination-btn next"
                onClick={() => setPage(page + 1)}
                disabled={page + 1 >= totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de mensajes */}
      <ModalMensaje
        visible={modalVisible}
        tipo={modalTipo}
        titulo={modalTitulo}
        mensaje={modalMensaje}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default NotificacionesSecretaria;