import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import './Header.css'

/* ---------------- utilidades ---------------- */
const normalizeStored = (v) => {
  if (v === null || v === undefined) return null;
  if (typeof v !== "string") return v;
  const t = v.trim();
  if (t === "" || ["undefined", "null"].includes(t.toLowerCase())) return null;
  return t;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "¡Buenos días";
  if (h >= 12 && h < 18) return "¡Buenas tardes";
  return "¡Buenas noches";
};

const initialsFrom = (n = "", a = "") => {
  const ni = (n || "").trim()[0] || "";
  const ai = (a || "").trim()[0] || "";
  return (ni + ai).toUpperCase() || "U";
};

/* ------------- componente ------------- */
export default function HeaderEstudianteFB() {
  const [nombreColegio, setNombreColegio] = useState("");
  const [usuario, setUsuario] = useState({ nombre: "", apellido: "" });
  const [notifCount, setNotifCount] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // local state para marcar visualmente como "seen" sin tocar la DB
  const [seenLocal, setSeenLocal] = useState(new Set());

  const token = normalizeStored(localStorage.getItem("token"));
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    // fetch config y usuario (si hay token)
    const fetchInit = async () => {
      if (!token) return;
      try {
        const [cfg, usr] = await Promise.all([
          axios.get("http://localhost:3000/api/coordinador/configuracionSistema", { headers }).catch(() => null),
          axios.get("http://localhost:3000/api/usuarios/me", { headers }).catch(() => null),
        ]);

        if (!mountedRef.current) return;
        setNombreColegio(cfg?.data?.nombre_colegio || "");
        const data = usr?.data || {};
        setUsuario({
          nombre: data.nombre ?? data.persona?.nombre ?? "",
          apellido: data.apellido ?? data.persona?.apellido ?? "",
        });
      } catch (err) {
        console.warn("init error", err);
      }
    };

    // fetch contador (fallback si la ruta devuelve array o count)
    const fetchCount = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:3000/api/notificaciones/estudiantes", { headers });
        if (!mountedRef.current) return;
        if (Array.isArray(res.data)) {
          const pend = res.data.filter(n => n.id_estado_notificacion === 1).length;
          setNotifCount(pend);
        } else if (res.data && typeof res.data === "object") {
          setNotifCount(typeof res.data.count === "number" ? res.data.count : (res.data.totalNoLeidas || 0));
        } else {
          setNotifCount(0);
        }
      } catch (err) {
        console.warn("count error", err?.message ?? err);
      }
    };

    fetchInit();
    fetchCount();

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // detectar clicks fuera y escape para cerrar
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // abrir/cerrar panel: cuando abrimos, traemos notificaciones y "marcamos" localmente
  const toggleNotifs = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    setError(null);

    if (!willOpen) return; // si cerramos no hacemos fetch

    if (!token) {
      setError("Inicia sesión para ver notificaciones");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/notificaciones/estudiantes", { headers });

      if (!mountedRef.current) return;

      // normalizar: si devuelven array o objeto con lista
      let lista = Array.isArray(res.data) ? res.data : res.data?.notificaciones ?? [];
      if (!Array.isArray(lista)) lista = [];

      // ordenar por fecha (desc) por si acaso
      lista.sort((a, b) => new Date(b.fecha_envio) - new Date(a.fecha_envio));

      setNotificaciones(lista);

      // marcar localmente como seen: agregamos todos los ids pendientes a seenLocal
      const pendientes = lista.filter(n => n.id_estado_notificacion === 1).map(n => n.id_notificacion);
      setSeenLocal(prev => {
        const s = new Set(prev);
        pendientes.forEach(id => s.add(id));
        return s;
      });

      // reducir contador local a cero (Facebook hace esto al abrir)
      setNotifCount(0);

      /* Si algún día decides permitir que el estudiante marque en la DB, descomenta:
      if (pendientes.length > 0) {
        await axios.put("/api/notificaciones/marcar-varias", { ids: pendientes }, { headers });
      }
      */
    } catch (err) {
      console.error("Error cargar notifs:", err);
      setError("No se pudieron cargar notificaciones");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const displayName = usuario.nombre || usuario.apellido ? `${usuario.nombre} ${usuario.apellido}` : "Estudiante";
  const initials = initialsFrom(usuario.nombre, usuario.apellido);
  const greeting = getGreeting();

  /* -------------- estilos mínimos (múevelos a CSS si quieres) -------------- */
  const styles = {
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fff", borderBottom: "1px solid #eee" },
    left: { display: "flex", gap: 12, alignItems: "center" },
    schoolIcon: { width: 44, height: 44, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0d6efd,#6610f2)", color: "#fff", fontSize: 20 },
    right: { display: "flex", alignItems: "center", gap: 12 },
    bellBtn: { position: "relative", background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8 },
    badge: { position: "absolute", top: -6, right: -6, minWidth: 20, height: 20, padding: "0 6px", borderRadius: 12, background: "#dc3545", color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.12)", transformOrigin: "center", animation: notifCount > 0 ? "pulse 1.2s infinite" : "none" },
    dropdown: { position: "absolute", right: 8, top: "calc(100% + 8px)", width: 360, maxHeight: 420, overflowY: "auto", background: "#fff", border: "1px solid #e6e6e6", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.12)", zIndex: 9999, padding: 8 },
    notifItem: (unread) => ({ padding: 10, borderBottom: "1px solid #f1f1f1", background: unread ? "#f8f9fa" : "transparent", borderRadius: 8, marginBottom: 6 }),
    avatar: { width: 44, height: 44, borderRadius: "50%", background: "#6f42c1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={styles.schoolIcon}>📚</div>
        <div>
          <div style={{ fontWeight: 700 }}>{nombreColegio || "Colegio"}</div>
          <div style={{ fontSize: 12, color: "#6c757d" }}>Observador Estudiantil • {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={{ textAlign: "right", marginRight: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{greeting} <span style={{ color: "#0d6efd" }}>{usuario.nombre || "!"}</span></div>
          <div style={{ fontSize: 12, color: "#6c757d" }}>{usuario.nombre ? `Bienvenido de nuevo, ${displayName.split(" ")[0]}` : "Inicia sesión para ver tu perfil"}</div>
        </div>

        <div style={{ position: "relative" }}>
          <button
            ref={buttonRef}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={toggleNotifs}
            style={styles.bellBtn}
            title="Notificaciones"
            className={`campana ${notifCount > 0 ? 'has-notif' : ''}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a7 7 0 0 0-7 7v5H4v2h16v-2h-1v-5a7 7 0 0 0-7-7zm0 18a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z"/>
            </svg>
            {notifCount > 0 && <span style={styles.badge}>{notifCount}</span>}
          </button>


          {open && (
            <div ref={dropdownRef} style={styles.dropdown} role="menu" aria-label="Notificaciones">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px" }}>
                <strong>Notificaciones</strong>
                <small style={{ color: "#6c757d" }}>{notificaciones.length} recientes</small>
              </div>

              {loading && <div style={{ padding: 12 }}>Cargando...</div>}
              {error && <div style={{ padding: 12, color: "crimson" }}>{error}</div>}

              {!loading && !error && (
                <>
                  {notificaciones.length === 0 && <div style={{ padding: 12, color: "#6c757d" }}>No hay nuevas notificaciones</div>}

                  {notificaciones.map((n) => {
                    const unread = n.id_estado_notificacion === 1 && !seenLocal.has(n.id_notificacion);
                    // consider it unread if id_estado_notificacion === 1 AND not in seenLocal set
                    const visuallyUnread = n.id_estado_notificacion === 1 && !seenLocal.has(n.id_notificacion) ? true : false;
                    // but since we add pending ids to seenLocal when opening, 'visuallyUnread' will be false after opening (FB behaviour shows them highlighted once)
                    return (
                      <div key={n.id_notificacion} style={styles.notifItem(visuallyUnread)}>
                        <div style={{ display: "flex", gap: 10 }}>
                          <div style={styles.avatar} aria-hidden>{/* iniciales */}🔔</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: 6 }}>{n.mensaje}</div>
                            <small style={{ color: "#6c757d" }}>{new Date(n.fecha_envio).toLocaleString()}</small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ marginLeft: 8 }}>
          <div title={displayName} style={{ ...styles.avatar }}>{initials}</div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </header>
  );
}
