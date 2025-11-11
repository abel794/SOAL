// 📂 HeaderAcudiente.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import './AcudienteHeader.css'

/* ----------------- helpers ----------------- */
const normalizeStored = (v) => {
  if (v === null || v === undefined) return null;
  if (typeof v !== "string") return v;
  const trimmed = v.trim();
  if (
    trimmed === "" ||
    trimmed.toLowerCase() === "undefined" ||
    trimmed.toLowerCase() === "null"
  )
    return null;
  return trimmed;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "¡Buenos días";
  if (hour >= 12 && hour < 18) return "¡Buenas tardes";
  return "¡Buenas noches";
};

const makeInitials = (nombre = "", apellido = "") => {
  const n = (nombre || "").trim();
  const a = (apellido || "").trim();
  const ni = n ? n[0] : "";
  const ai = a ? a[0] : "";
  return (ni + ai).toUpperCase() || "U";
};

const getFotoSrc = (foto) => {
  if (!foto || typeof foto !== "string") return null;
  const raw = foto.trim();
  const cleaned = raw.replace(/\s+/g, "");
  if (/^data:/i.test(cleaned)) return cleaned;
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  const isBase64 = /^[A-Za-z0-9+/=]+$/.test(cleaned) && cleaned.length > 40;
  if (isBase64) {
    try {
      const decoded = atob(cleaned);
      if (/^data:/i.test(decoded.trim())) return decoded.trim();
    } catch {}
    return `data:image/jpeg;base64,${cleaned}`;
  }
  return `http://localhost:3000/uploads/${encodeURIComponent(cleaned)}`;
};

/* ----------------- componente ----------------- */
export default function HeaderAcudiente({ setSeccionActiva }) {
  const [nombreColegio, setNombreColegio] = useState("");
  const [usuario, setUsuario] = useState({ nombre: "", apellido: "", foto: "" });
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [fotoError, setFotoError] = useState(false);

  const [notificaciones, setNotificaciones] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotificaciones, setShowNotificaciones] = useState(false);

  const mountedRef = useRef(true);
  const notifRef = useRef(null);

  // Cerrar notificaciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotificaciones(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔔 Obtener notificaciones y contador de no leídas
  const fetchNotificaciones = async (soloContador = false) => {
    try {
      const token = normalizeStored(localStorage.getItem("token"));
      if (!token) return;

      // 🔹 Total de no leídas
      const resCount = await axios.get(
        "http://localhost:3000/api/notificaciones/contador",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (mountedRef.current) setNotifCount(resCount.data.totalNoLeidas || 0);

      // 🔹 Lista completa (solo si se necesita)
      if (!soloContador) {
        const resList = await axios.get(
          "http://localhost:3000/api/notificaciones",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (mountedRef.current) setNotificaciones(resList.data || []);
      }
    } catch (err) {
      console.error("❌ Error al obtener notificaciones:", err?.message ?? err);
    }
  };

  // 🔁 Actualizar cada 10 segundos sin abrir el panel
  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(() => fetchNotificaciones(true), 10000);
    return () => clearInterval(interval);
  }, []);

  // 🧭 Mostrar / ocultar panel de notificaciones
  const handleClickNotificaciones = async () => {
    const newState = !showNotificaciones;
    setShowNotificaciones(newState);
    if (newState) await fetchNotificaciones(); // cargar solo al abrir
  };

  // ✏️ Marcar una notificación como leída
  const marcarLeida = async (id) => {
    try {
      const token = normalizeStored(localStorage.getItem("token"));
      await axios.put(
        `http://localhost:3000/api/notificaciones/${id}/leida`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotificaciones();
    } catch (err) {
      console.error("❌ Error al marcar como leída:", err?.message ?? err);
    }
  };

  // ✏️ Marcar todas como leídas
  const marcarTodasLeidas = async () => {
    try {
      const token = normalizeStored(localStorage.getItem("token"));
      const ids = notificaciones
        .filter((n) => n.id_estado_notificacion === 1)
        .map((n) => n.id_notificacion);

      if (ids.length === 0) return;

      await axios.put(
        "http://localhost:3000/api/notificaciones/marcar-varias",
        { ids },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchNotificaciones();
    } catch (err) {
      console.error("❌ Error al marcar todas:", err?.message ?? err);
    }
  };

  // --- Cargar usuario y configuración ---
  useEffect(() => {
    mountedRef.current = true;
    const token = normalizeStored(localStorage.getItem("token"));
    if (!token) return;

    const fetchConfig = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/coordinador/configuracionSistema",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (mountedRef.current)
          setNombreColegio(res.data?.nombre_colegio || "");
      } catch (err) {
        console.error("Error obtener configuración:", err?.message ?? err);
      }
    };

    const fetchUsuario = async () => {
      try {
        setLoadingUsuario(true);
        setFotoError(false);
        const res = await axios.get("http://localhost:3000/api/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || {};
        const nom = data.nombre ?? data.persona?.nombre ?? "";
        const ape = data.apellido ?? data.persona?.apellido ?? "";
        const fot = data.foto ?? "";
        if (mountedRef.current)
          setUsuario({ nombre: nom, apellido: ape, foto: fot });
      } catch (err) {
        console.error("Error obtener usuario:", err?.message ?? err);
      } finally {
        if (mountedRef.current) setLoadingUsuario(false);
      }
    };

    fetchConfig();
    fetchUsuario();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => setFotoError(false), [usuario.foto]);

  const displayName =
    usuario.nombre && usuario.apellido
      ? `${usuario.nombre} ${usuario.apellido}`
      : loadingUsuario
      ? "Cargando..."
      : "Acudiente";

  const initials = makeInitials(usuario.nombre, usuario.apellido);
  const greeting = getGreeting();
  const fotoSrc = !fotoError ? getFotoSrc(usuario.foto) : null;

  return (
    <>

      <header className="header-acudiente">
        {/* 🏫 Logo y nombre del colegio */}
        <div className="header-colegio">
          <div className="icono-colegio" aria-hidden="true">
            📚
          </div>
          <div>
            <div className="ha-school">
              {nombreColegio || "Colegio Renato Descartes"}
            </div>
            <div className="ha-sub">
              Observador Estudiantil • {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* 👤 Información del usuario y controles */}
        <div className="header-usuario">
          {/* 🔔 Notificaciones */}
          <div className="notificaciones-container" ref={notifRef}>
            <button
              className="btn-notif"
              onClick={handleClickNotificaciones}
              aria-label={`Notificaciones. Tienes ${notifCount} no leídas`}
            >
              <lord-icon
                src="https://cdn.lordicon.com/msetysan.json"
                trigger="hover"
                colors="primary:#121331,secondary:#121331"
                style={{ width: "28px", height: "28px" }}
              ></lord-icon>

              {notifCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger notif-badge"
                  style={{ fontSize: "0.65rem", padding: "0.3em 0.5em" }}
                >
                  {notifCount}
                </span>
              )}
            </button>

            {/* 📩 Panel de notificaciones */}
            {showNotificaciones && (
              <div className="notificaciones-panel">
                <div className="notificaciones-header">
                  <strong>Notificaciones</strong>
                  {notifCount > 0 && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={marcarTodasLeidas}
                    >
                      Marcar todas
                    </button>
                  )}
                </div>

                <div className="notificaciones-list">
                  {notificaciones.length === 0 ? (
                    <div className="text-center text-muted py-3">
                      <small>No tienes notificaciones.</small>
                    </div>
                  ) : (
                    notificaciones.map((n) => (
                      <div
                        key={n.id_notificacion}
                        className={`notificacion-item ${
                          n.id_estado_notificacion === 1 ? "no-leida" : ""
                        }`}
                        onClick={() => marcarLeida(n.id_notificacion)}
                      >
                        <div className="notificacion-fecha">
                          {new Date(n.fecha_envio).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="notificacion-mensaje">
                          {n.mensaje}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 📝 Información del usuario */}
          <div className="usuario-info">
            <div className="ha-greeting">
              {greeting} <span style={{ color: "#0d6efd" }}>
                {usuario.nombre || "!"}
              </span> 👋
            </div>
            <div className="usuario-bienvenida">
              {usuario.nombre || usuario.apellido
                ? `Bienvenido, ${displayName.split(" ")[0]}`
                : "Inicia sesión para ver tu perfil"}
            </div>
          </div>

          {/* 🎭 Avatar del usuario */}
          <div 
            className="ha-avatar" 
            title={displayName} 
            aria-label={`Avatar de ${displayName}`}
          >
            {fotoSrc ? (
              <img
                src={fotoSrc}
                alt={`Foto de ${displayName}`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                  setFotoError(true);
                }}
              />
            ) : (
              <div className="ha-initials" aria-hidden="true">
                {initials}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}