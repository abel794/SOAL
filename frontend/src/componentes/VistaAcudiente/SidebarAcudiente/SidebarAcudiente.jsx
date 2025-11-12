import React, { useEffect, useState } from "react";
import "./AcudienteSidebar.css";

/**
 * SidebarAcudiente - Componente de navegación responsive
 */
const SidebarAcudiente = ({
  open,
  setOpen,
  cambiarSeccion,
  seccionActiva,
  onCerrarSesion,
  apiBase = "http://localhost:3000", // puedes sobrescribir si tu API está en otra base
}) => {
  const menuItems = [
    { nombre: "Dashboard", icono: "bi bi-house-door", seccion: "Dashboard" },
    { nombre: "Notificaciones", icono: "bi bi-bell", seccion: "Notificaciones" },
    { nombre: "Enviar PQR", icono: "bi bi-chat-dots", seccion: "Enviar PQR" },
    { nombre: "Enviar Justificacion", icono: "bi bi-file-earmark-medical", seccion: "Enviar Justificacion" },
    { nombre: "Historial de PQR", icono: "bi bi-clock-history", seccion: "Historial de PQR" },
    { nombre: "Configuracion de Cuenta", icono: "bi bi-gear", seccion: "Configuracion de Cuenta" },
    { nombre: "Cerrar Sesion", icono: "bi bi-box-arrow-right", seccion: "Cerrar Sesion", esLogout: true },
  ];

  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [errorConfig, setErrorConfig] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const obtenerConfiguracion = async () => {
      setLoadingConfig(true);
      setErrorConfig(null);
      try {
        // Si tu API requiere token, puedes agregarlo aquí:
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiBase}/api/coordinador/configuracionSistema`, {
          method: "GET",
          headers: token ? { "Authorization": `Bearer ${token}` } : undefined,
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setConfig(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error al obtener la configuración:", error);
          setErrorConfig("No se pudo cargar la configuración");
        }
      } finally {
        setLoadingConfig(false);
      }
    };

    obtenerConfiguracion();
    return () => controller.abort();
  }, [apiBase]);

  const handleClick = (e, item, isMobile = false) => {
    e.preventDefault();

    if (item.esLogout) {
      if (typeof onCerrarSesion === "function") onCerrarSesion();
      else console.warn("onCerrarSesion no está definido en SidebarAcudiente");
      if (isMobile) setOpen(false);
      return;
    }

    cambiarSeccion(item.seccion);
    if (isMobile) setOpen(false);
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return iso || "";
    }
  };

  const formatTime = (timeStr) => {
    // espera "HH:MM:SS" o "HH:MM"
    if (!timeStr) return "";
    return timeStr.slice(0,5);
  };

  const renderColegioInfo = () => {
    if (loadingConfig) return <p className="cargando-config">Cargando datos del colegio...</p>;
    if (errorConfig) return <p className="cargando-config error">{errorConfig}</p>;
    if (!config) return null;

    // Ajusta la ruta del logo según cómo sirvas los archivos (ej: /uploads/ o URL completa)
    const logoUrl = config.logo ? `${apiBase}/uploads/${config.logo}` : null;

    return (
      <div className="colegio-info">
        <hr />
        <div className="colegio-top">
          {logoUrl ? (
            <img className="colegio-logo" src={logoUrl} alt={`Logo ${config.nombre_colegio}`} />
          ) : (
            <i className="bi bi-building cole-icon-placeholder" />
          )}
          <div className="colegio-txt">
            <strong className="colegio-nombre">{config.nombre_colegio}</strong>
            <div className="colegio-meta">
              <span>{config.direccion}</span>
              <span>Tel: {config.telefono}</span>
            </div>
          </div>
        </div>

        <div className="colegio-datos">
          <p>Email: <a href={`mailto:${config.correo}`}>{config.correo}</a></p>
          <p>Año escolar: {config.anio_escolar}</p>
          <p>Hora cierre: {formatTime(config.hora_cierre)}</p>
          <p>Medio de notificación: {config.medio_notificacion}</p>
          <p>Horario envío: {config.horario_envio}</p>
          <p>Notificar acudiente: {config.notificar_acudiente ? "Sí" : "No"}</p>
          <p>Máx. estudiantes por curso: {config.max_estudiantes_curso}</p>
          {config.mensaje_institucional && <p className="msg-inst">{config.mensaje_institucional}</p>}
          {config.fecha_actualizacion && <p className="fecha-act">Actualizado: {formatDate(config.fecha_actualizacion)}</p>}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <div className="sidebar-desktop">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <i className="bi bi-mortarboard-fill"></i>
            <span className="sidebar-title">Panel Acudiente</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.nombre}
              className={`nav-item ${seccionActiva === item.seccion ? "nav-item-active" : ""} ${
                item.esLogout ? "nav-item-logout" : ""
              }`}
              onClick={(e) => handleClick(e, item, false)}
            >
              <div className="nav-item-content">
                <i className={item.icono}></i>
                <span className="nav-item-text">{item.nombre}</span>
              </div>
              <i className="bi bi-chevron-right nav-item-arrow" />
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="user-details">
              <span className="user-name">Acudiente</span>
              <span className="user-role">Usuario</span>
            </div>
          </div>

          {renderColegioInfo()}
        </div>
      </div>

      {/* Sidebar Mobile */}
      <div className={`sidebar-mobile ${open ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-mobile-header">
          <div className="sidebar-logo">
            <i className="bi bi-mortarboard-fill"></i>
            <span className="sidebar-title">Panel Acudiente</span>
          </div>
          <button className="sidebar-close-btn" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.nombre}
              className={`nav-item ${seccionActiva === item.seccion ? "nav-item-active" : ""} ${
                item.esLogout ? "nav-item-logout" : ""
              }`}
              onClick={(e) => handleClick(e, item, true)}
            >
              <div className="nav-item-content">
                <i className={item.icono}></i>
                <span className="nav-item-text">{item.nombre}</span>
              </div>
              <i className="bi bi-chevron-right nav-item-arrow" />
            </button>
          ))}
        </nav>

        {/* Footer móvil con misma info */}
        <div className="sidebar-mobile-footer">{renderColegioInfo()}</div>
      </div>

      {/* Overlay Mobile */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </>
  );
};

export default SidebarAcudiente;
