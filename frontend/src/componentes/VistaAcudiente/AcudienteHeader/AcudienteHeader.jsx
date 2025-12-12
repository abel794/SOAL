// 📂 HeaderAcudiente.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../AcudienteHeader/AcudienteHeader.css";

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
  return `${process.env.REACT_APP_API_URL}/uploads/${encodeURIComponent(cleaned)}`;
};

/* ----------------- componente ----------------- */
export default function HeaderAcudiente({ setSeccionActiva, openSidebar, setOpenSidebar }) {
  const [configuracion, setConfiguracion] = useState({
    nombre_colegio: "",
    logo: null
  });
  const [usuario, setUsuario] = useState({ nombre: "", apellido: "", foto: "" });
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [fotoError, setFotoError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const [notificaciones, setNotificaciones] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mountedRef = useRef(true);
  const notifRef = useRef(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        `${process.env.REACT_APP_API_URL}/api/notificaciones/contador`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (mountedRef.current) setNotifCount(resCount.data.totalNoLeidas || 0);

      // 🔹 Lista completa (solo si se necesita)
      if (!soloContador) {
        const resList = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/notificaciones`,
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
    if (newState) await fetchNotificaciones();
  };

  // ✏️ Marcar una notificación como leída
  const marcarLeida = async (id) => {
    try {
      const token = normalizeStored(localStorage.getItem("token"));
      await axios.put(
       `${process.env.REACT_APP_API_URL}/api/notificaciones/${id}/leida`,
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
        `${process.env.REACT_APP_API_URL}/api/notificaciones/marcar-varias`,
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
          `${process.env.REACT_APP_API_URL}/api/coordinador/configuracionSistema`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (mountedRef.current && res.data) {
          setConfiguracion({
            nombre_colegio: res.data.nombre_colegio || "Colegio El Porvenir",
            logo: res.data.logo || null
          });
        }
      } catch (err) {
        console.error("Error obtener configuración:", err?.message ?? err);
        if (mountedRef.current) {
          setConfiguracion({
            nombre_colegio: "Colegio El Porvenir",
            logo: null
          });
        }
      }
    };

    const fetchUsuario = async () => {
      try {
        setLoadingUsuario(true);
        setFotoError(false);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/usuarios/me`, {
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

  // 🔄 Función para alternar el sidebar
  const toggleSidebar = () => {
    if (setOpenSidebar) setOpenSidebar(!openSidebar);
  };

  const displayName =
    usuario.nombre && usuario.apellido
      ? `${usuario.nombre} ${usuario.apellido}`
      : loadingUsuario
      ? "Cargando..."
      : "Acudiente";

  const initials = makeInitials(usuario.nombre, usuario.apellido);
  const greeting = getGreeting();
  const fotoSrc = !fotoError ? getFotoSrc(usuario.foto) : null;
  const logoSrc = configuracion.logo ? getFotoSrc(configuracion.logo) : null;

  // Estilos responsivos
  const headerStyles = {
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backdropFilter: 'blur(10px)',
      padding: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 1050,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      minHeight: '80px'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexShrink: 0
    },
    logo: {
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      objectFit: 'cover',
      border: '3px solid rgba(255,255,255,0.2)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
      padding: '0 1rem',
      textAlign: 'center'
    },
    userContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexShrink: 0
    },
    notificationBadge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(255,65,108,0.4)'
    },
    avatar: {
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid rgba(255,255,255,0.3)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    sidebarToggle: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '10px',
      width: '45px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    notificationButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '10px',
      width: '45px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      backdropFilter: 'blur(10px)'
    },
    notificationPanel: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      width: isMobile ? '300px' : '350px',
      maxWidth: '90vw',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.2)',
      overflow: 'hidden',
      zIndex: 1000,
      maxHeight: '400px',
      overflowY: 'auto'
    }
  };

  return (
    <>
      {/* Estilos responsivos inline */}
      <style>{`
        
      `}</style>

      <header 
        className="header-acudiente" 
        style={headerStyles.header}
      >
        <div className="header-container d-flex justify-content-between align-items-center w-100">
          
          {/* Sección Logo y Colegio - Izquierda */}
          <div className="logo-section d-flex align-items-center gap-3">
            <button 
              className="sidebar-toggle-btn smooth-transition hover-glow d-flex align-items-center justify-content-center"
              style={headerStyles.sidebarToggle}
              onClick={toggleSidebar}
              title={openSidebar ? "Cerrar menú" : "Abrir menú"}
            >
              <i className={`bi ${openSidebar ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>

            <div className="logo-colegio d-flex align-items-center gap-3">
              {logoSrc && !logoError ? (
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="rounded smooth-transition hover-scale"
                  style={headerStyles.logo}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div
                  className="bg-white bg-opacity-20 text-white rounded d-flex justify-content-center align-items-center smooth-transition hover-scale"
                  style={{ width: '60px', height: '60px', borderRadius: '12px' }}
                >
                  <i className="bi bi-building fs-4"></i>
                </div>
              )}

              <div className="d-none d-md-block">
                <h5 className="mb-0 fw-bold text-white logo-text" style={{ fontSize: '1.1rem' }}>
                  {configuracion.nombre_colegio}
                </h5>
              </div>
            </div>
          </div>

          {/* Sección Información - Centro */}
          <div className="info-section d-none d-md-flex flex-column align-items-center justify-content-center">
            <small className="text-white text-opacity-90 fw-medium header-info-text" style={{ fontSize: '0.9rem' }}>
              <i className="bi bi-clipboard-data me-1"></i>
              Observador Estudiantil •{" "}
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </small>
            <div className="mt-1">
              <small className="text-white text-opacity-75" style={{ fontSize: '0.8rem' }}>
                <i className="bi bi-clock me-1"></i>
                {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </small>
            </div>
          </div>

          {/* Sección Usuario - Derecha */}
          <div className="user-section d-flex align-items-center gap-3">
            
            {/* Solo mostrar saludo en desktop */}
            <div className="d-none d-lg-block text-end">
              <div className="fw-bold text-white user-greeting" style={{ fontSize: '0.95rem' }}>
                {greeting}, {usuario.nombre} 👋
              </div>
              <small className="text-white text-opacity-75 user-name" style={{ fontSize: '0.85rem' }}>
                Bienvenido al portal
              </small>
            </div>

            {/* Notificaciones */}
            <div className="position-relative smooth-transition" ref={notifRef}>
              <button
                className="notification-btn smooth-transition hover-glow d-flex align-items-center justify-content-center"
                style={headerStyles.notificationButton}
                onClick={handleClickNotificaciones}
                title="Notificaciones"
              >
                <i className="bi bi-bell"></i>
                {notifCount > 0 && (
                  <span 
                    className="notification-badge notification-badge-pulse d-flex align-items-center justify-content-center"
                    style={headerStyles.notificationBadge}
                  >
                    {notifCount}
                  </span>
                )}
              </button>

              {showNotificaciones && (
                <div 
                  className="notification-panel custom-scrollbar"
                  style={headerStyles.notificationPanel}
                >
                  {/* Header del panel de notificaciones */}
                  <div className="notification-header p-3 border-bottom bg-white bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold text-dark">
                        <i className="bi bi-bell me-2"></i>
                        Notificaciones
                      </h6>
                      {notifCount > 0 && (
                        <button
                          className="btn btn-sm btn-primary-gradient"
                          onClick={marcarTodasLeidas}
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem'
                          }}
                        >
                          <i className="bi bi-check-all me-1"></i>
                          Marcar todas
                        </button>
                      )}
                    </div>
                    {notifCount > 0 && (
                      <small className="text-muted mt-1 d-block">
                        Tienes {notifCount} notificación{notifCount !== 1 ? 'es' : ''} sin leer
                      </small>
                    )}
                  </div>

                  {/* Cuerpo del panel de notificaciones */}
                  <div className="notification-body">
                    {notificaciones.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <i className="bi bi-bell-slash display-6 text-muted opacity-50 mb-3"></i>
                        <p className="mb-0">No tienes notificaciones</p>
                        <small className="text-muted">¡Todo está al día!</small>
                      </div>
                    ) : (
                      <div className="notification-list">
                        {notificaciones.map((n) => (
                          <div
                            key={n.id_notificacion}
                            className={`notification-item p-3 border-bottom smooth-transition ${
                              n.id_estado_notificacion === 1 
                                ? 'bg-light bg-opacity-50 unread-notification' 
                                : ''
                            }`}
                            onClick={() => marcarLeida(n.id_notificacion)}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div className="d-flex align-items-start">
                              <div className="notification-icon me-3">
                                <div 
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: '35px',
                                    height: '35px',
                                    background: n.id_estado_notificacion === 1 
                                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                      : 'var(--bs-gray-200)',
                                    color: n.id_estado_notificacion === 1 ? 'white' : 'var(--bs-gray-600)'
                                  }}
                                >
                                  <i className={`bi ${
                                    n.tipo_notificacion?.includes('asistencia') ? 'bi-calendar-check' :
                                    n.tipo_notificacion?.includes('observacion') ? 'bi-exclamation-triangle' :
                                    n.tipo_notificacion?.includes('nota') ? 'bi-journal-text' : 'bi-bell'
                                  }`}></i>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                  <small className="text-muted">
                                    <i className="bi bi-clock me-1"></i>
                                    {new Date(n.fecha_envio).toLocaleString("es-ES", {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      day: '2-digit',
                                      month: 'short'
                                    })}
                                  </small>
                                  {n.id_estado_notificacion === 1 && (
                                    <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: '0.65rem' }}>
                                      Nuevo
                                    </span>
                                  )}
                                </div>
                                <p className="mb-0 text-dark" style={{ fontSize: '0.9rem' }}>
                                  {n.mensaje}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer del panel de notificaciones */}
                  <div className="notification-footer p-3 border-top bg-white bg-opacity-50">
                    <a 
                      href="#" 
                      className="text-decoration-none text-primary d-flex align-items-center justify-content-center"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <i className="bi bi-arrow-right-circle me-2"></i>
                      Ver todas las notificaciones
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar del usuario */}
            <div className="dropdown">
              <div 
                className="avatar-container smooth-transition hover-glow"
                style={{ cursor: 'pointer' }}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {fotoSrc ? (
                  <img
                    src={fotoSrc}
                    alt="Perfil"
                    className="rounded-circle"
                    style={headerStyles.avatar}
                    onError={() => setFotoError(true)}
                  />
                ) : (
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      ...headerStyles.avatar,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  >
                    {initials}
                  </div>
                )}
              </div>
              
              {/* Dropdown menu */}
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2" 
                  style={{
                    minWidth: '200px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                <li className="dropdown-header">
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-small">
                      {fotoSrc ? (
                        <img
                          src={fotoSrc}
                          alt="Perfil"
                          className="rounded-circle"
                          style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                          onError={() => setFotoError(true)}
                        />
                      ) : (
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: '35px',
                            height: '35px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}
                        >
                          {initials}
                        </div>
                      )}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{usuario.nombre} {usuario.apellido}</h6>
                      <small className="text-muted">Acudiente</small>
                    </div>
                  </div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-person me-2"></i>
                    Mi Perfil
                  </a>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-gear me-2"></i>
                    Configuración
                  </a>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-question-circle me-2"></i>
                    Ayuda
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item d-flex align-items-center text-danger" href="#">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra de fecha para móviles */}
        <div className="d-md-none mt-2 text-center">
          <small className="text-white text-opacity-90 d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-calendar-event"></i>
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <span className="ms-2">
              <i className="bi bi-clock"></i>
              {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </small>
        </div>
      </header>
    </>
  );
}