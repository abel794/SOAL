// 📁 src/componentes/Profesor/RegistrarAsistencia/RegistrarAsistencia.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RegistrarAsistencia.css";
import ListarAsistencias from "./ListarAsistencias";
import ModalMensaje from "../../ui/ModalMensaje";

/* --- constantes --- */
const ESTADOS = {
  ASISTIO: 1,
  NO_ASISTIO: 2,
  JUSTIFICADO: 3,
  OTRO: 4,
};

const EMOJIS_ESTADOS = {
  [ESTADOS.ASISTIO]: "✅",
  [ESTADOS.NO_ASISTIO]: "❌",
  [ESTADOS.JUSTIFICADO]: "🕒",
  [ESTADOS.OTRO]: "📄",
};

const COLORES_ESTADOS = {
  [ESTADOS.ASISTIO]: "#28a745",
  [ESTADOS.NO_ASISTIO]: "#dc3545",
  [ESTADOS.JUSTIFICADO]: "#ffc107",
  [ESTADOS.OTRO]: "#0d6efd",
};

/* ---------------- ConfirmModal (portal) ---------------- */
function ConfirmModal({ open, onClose, onConfirm, title, children, confirming }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="ra-confirm-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="ra-confirm-card" onClick={(e) => e.stopPropagation()}>
        {title && <h5 className="mb-3">{title}</h5>}
        <div className="mb-3">{children}</div>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success" onClick={onConfirm} disabled={confirming}>
            {confirming ? "Guardando..." : "✅ Sí, guardar"}
          </button>
          <button className="btn btn-secondary" onClick={onClose} disabled={confirming}>
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ---------------- Componente principal ---------------- */
const RegistrarAsistencia = () => {
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [cargando, setCargando] = useState(false);
  const [vista, setVista] = useState("registrar");
  const [mensaje, setMensaje] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // 📦 Cargar grados
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/coordinador/grado")
      .then((res) => setGrados(res.data))
      .catch(() => setMensaje({ tipo: "error", texto: "No se pudieron cargar los grados." }));
  }, []);

  // 🎓 Cargar estudiantes por grado
  useEffect(() => {
    if (!gradoSeleccionado) {
      setEstudiantes([]);
      setAsistencias({});
      setObservaciones({});
      return;
    }

    setCargando(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/coordinador/estudiantegrado/grado/${gradoSeleccionado}`)
      .then((res) => {
        const inicialAsis = {};
        const inicialObs = {};
        res.data.forEach((e) => {
          inicialAsis[e.id_estudiante] = "";
          inicialObs[e.id_estudiante] = "";
        });
        setEstudiantes(res.data);
        setAsistencias(inicialAsis);
        setObservaciones(inicialObs);
      })
      .catch(() => setMensaje({ tipo: "error", texto: "No se pudieron cargar los estudiantes." }))
      .finally(() => setCargando(false));
  }, [gradoSeleccionado]);

  const handleObservacionChange = (idEstudiante, texto) => {
    setObservaciones((prev) => ({ ...prev, [idEstudiante]: texto }));
  };

  const handleEstadoClick = (idEstudiante, estadoId) => {
    setAsistencias((prev) => ({
      ...prev,
      [idEstudiante]: prev[idEstudiante] === estadoId ? "" : estadoId,
    }));
  };

  // 💾 Guardar asistencias
  const guardarAsistencias = async () => {
    setCargando(true);
    const fechaHoy = new Date().toISOString().split("T")[0];

    const payload = Object.entries(asistencias)
      .filter(([_, estadoId]) => estadoId)
      .map(([id_estudiante, id_estado_asistencia]) => ({
        id_estudiante: parseInt(id_estudiante, 10),
        id_funcionario: 1,
        id_grado_asistencia: parseInt(gradoSeleccionado, 10),
        id_estado_asistencia,
        observacion: observaciones[id_estudiante],
        fecha: fechaHoy,
      }));

    if (payload.length === 0) {
      setMensaje({ tipo: "advertencia", texto: "⚠️ Debes marcar al menos una asistencia." });
      setMostrarConfirmacion(false);
      setCargando(false);
      return;
    }

    

    // ✅ obtener token ANTES del try para que ESLint no reporte 'token is not defined'
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      setMensaje({ tipo: "error", texto: "🔒 No estás autenticado. Inicia sesión." });
      setMostrarConfirmacion(false);
      setCargando(false);
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/asistencias/masivo`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200 || res.status === 201) {
        setMensaje({ tipo: "exito", texto: "✅ Asistencias registradas correctamente." });
        // opcional: limpiar selección después de guardar
        setAsistencias({});
        setObservaciones({});
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }

      setMostrarConfirmacion(false);
    } catch (err) {
      console.error("Error al guardar asistencias:", err);
      // si axios devolvió response, podemos chequear status
      const status = err?.response?.status;
      if (status === 401) {
        setMensaje({
          tipo: "error",
          texto: "🔒 No autorizado. Token inválido o expirado. Inicia sesión de nuevo.",
        });
      } else if (status === 400) {
        setMensaje({ tipo: "error", texto: "Petición inválida. Revisa los datos enviados." });
      } else {
        setMensaje({ tipo: "error", texto: "Hubo un error al registrar las asistencias." });
      }
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = () => {
    const hayAsistencias = Object.values(asistencias).some((v) => v);
    if (!hayAsistencias) {
      setMensaje({ tipo: "advertencia", texto: "⚠️ Debes marcar al menos una asistencia." });
      return;
    }
    setMostrarConfirmacion(true);
  };

  // --- Vista de listado ---
  if (vista === "listar") {
    return (
      <div className="container-fluid px-2 px-md-5 mt-3">
        <button className="btn btn-outline-primary mb-3 w-100 w-md-auto" onClick={() => setVista("registrar")}>
          ⬅ Volver a Registrar Asistencia
        </button>
        <ListarAsistencias />
      </div>
    );
  }

  // --- Vista principal ---
  return (
    <div className="container-fluid px-2 px-md-5 mt-3">
      <h2 className="text-primary mb-4 text-center fw-bold">Registrar Asistencia por Grado</h2>

      {/* Selector de grado */}
      <div className="mb-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <label className="form-label">Selecciona un grado:</label>
        <select className="form-select" value={gradoSeleccionado} onChange={(e) => setGradoSeleccionado(e.target.value)}>
          <option value="">-- Elige un grado --</option>
          {grados.map((grado) => (
            <option key={grado.id_grado} value={grado.id_grado}>
              {grado.nombre_grado}
              {grado.descripcion ? ` — ${grado.descripcion}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de estudiantes */}
      {cargando ? (
        <p className="text-center text-muted">Cargando estudiantes...</p>
      ) : estudiantes.length > 0 ? (
        <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Estudiante</th>
                <th>Estado</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr key={est.id_estudiante}>
                  <td style={{ minWidth: "200px" }}>
                    {`${est.nombre || ""} ${est.apellido || ""} — ${est.numero_documento || ""}`}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      {Object.values(ESTADOS).map((estadoId) => {
                        const activo = asistencias[est.id_estudiante] === estadoId;
                        return (
                          <button
                            key={estadoId}
                            type="button"
                            className={`estado-btn ${activo ? "selected" : ""}`}
                            style={{
                              backgroundColor: COLORES_ESTADOS[estadoId],
                              opacity: activo ? 1 : 0.7,
                              border: activo ? "2px solid rgba(0,0,0,0.15)" : "none",
                              width: 40,
                              height: 40,
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 18,
                            }}
                            onClick={() => handleEstadoClick(est.id_estudiante, estadoId)}
                            disabled={cargando}
                            title={estadoId === ESTADOS.ASISTIO ? "Asistió" : estadoId === ESTADOS.NO_ASISTIO ? "No asistió" : estadoId === ESTADOS.JUSTIFICADO ? "Justificado" : "Otro"}
                          >
                            {EMOJIS_ESTADOS[estadoId]}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Observación..."
                      value={observaciones[est.id_estudiante] || ""}
                      onChange={(e) => handleObservacionChange(est.id_estudiante, e.target.value)}
                      disabled={cargando}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : gradoSeleccionado ? (
        <p className="text-center text-muted">No hay estudiantes en este grado.</p>
      ) : null}

      {/* Botones principales */}
      <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mt-4">
        {estudiantes.length > 0 && (
          <button className="btn btn-primary w-100 w-md-auto" onClick={handleSubmit} disabled={cargando}>
            {cargando ? "Procesando..." : "💾 Guardar Asistencia"}
          </button>
        )}
        <button className="btn btn-secondary w-100 w-md-auto" onClick={() => setVista("listar")} disabled={cargando}>
          📋 Listar Asistencias
        </button>
      </div>

      {/* 💬 Modal de mensaje general */}
      {mensaje && (
        <ModalMensaje visible tipo={mensaje.tipo} titulo="Notificación" mensaje={mensaje.texto} onClose={() => setMensaje(null)} />
      )}

      {/* Confirmación */}
      <ConfirmModal
        open={mostrarConfirmacion}
        onClose={() => setMostrarConfirmacion(false)}
        onConfirm={guardarAsistencias}
        title="¿Estás seguro de guardar estas asistencias?"
        confirming={cargando}
      >
        <p>Se guardarán las asistencias seleccionadas para el grado.</p>
      </ConfirmModal>
    </div>
  );
};

export default RegistrarAsistencia;
