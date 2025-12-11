// SidebarAcudiente.jsx
import React, { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../SidebarAcudiente/AcudienteSidebar.css"; // Importar el CSS personalizado

const SidebarAcudiente = ({
  open,
  setOpen,
  cambiarSeccion,
  seccionActiva,
  onCerrarSesion,
  apiBase = "http://localhost:3000",
}) => {
  const menuItems = [
    { nombre: "Dashboard", icono: "bi-house-door", seccion: "Dashboard" },
    { nombre: "Notificaciones", icono: "bi-bell", seccion: "Notificaciones" },
    { nombre: "Enviar PQR", icono: "bi-chat-dots", seccion: "Enviar PQR" },
    { nombre: "Enviar Justificacion", icono: "bi-file-earmark-medical", seccion: "Enviar Justificacion" },
    { nombre: "Historial de PQR", icono: "bi-clock-history", seccion: "Historial de PQR" },
    { nombre: "Configuracion de Cuenta", icono: "bi-gear", seccion: "Configuracion de Cuenta" },
    { nombre: "Cerrar Sesion", icono: "bi-box-arrow-right", seccion: "Cerrar Sesion", esLogout: true },
  ];

  useEffect(() => {
    // Cerrar con Escape para accesibilidad
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const handleClick = (item, isMobile = false) => {
    if (item.esLogout) {
      if (onCerrarSesion) onCerrarSesion();
      if (isMobile) setOpen(false);
      return;
    }

    cambiarSeccion(item.seccion);
    if (isMobile) setOpen(false);
  };

  return (
    <>
      {/* === DESKTOP SIDEBAR === */}
      <div
        className={`sidebar-container d-none d-md-flex ${open ? "open" : ""}`}
        role="navigation"
        aria-label="Menú principal"
      >
        <div className="sidebar-header">
          <div className="sidebar-logo" aria-hidden="true">
            <i className="bi bi-mortarboard-fill" />
          </div>

          <div className="sidebar-title-wrap">
            <h5 className="sidebar-title">Panel Acudiente</h5>
            <div className="sidebar-subtitle">Sistema de Gestión</div>
          </div>

          <button
            className="sidebar-collapse-btn"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Colapsar menú" : "Abrir menú"}
            title={open ? "Colapsar menú" : "Abrir menú"}
          >
            <i className={`bi ${open ? "bi-chevron-left" : "bi-chevron-right"}`} />
          </button>
        </div>

        <div className="sidebar-menu" role="menu">
          {menuItems.map((item) => (
            <button
              key={item.nombre}
              role="menuitem"
              className={`menu-item ${seccionActiva === item.seccion ? "active" : ""}`}
              onClick={() => handleClick(item)}
              aria-current={seccionActiva === item.seccion ? "page" : undefined}
              title={item.nombre}
            >
              <div className="d-flex align-items-center">
                <i className={`bi ${item.icono} menu-icon`} aria-hidden="true" />
                <span className="menu-text">{item.nombre}</span>
              </div>

              {/* indicador sutil */}
              <i className="bi bi-chevron-right menu-arrow" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="sidebar-footer mt-auto">
          <div className="sidebar-user">
            <div className="user-avatar" aria-hidden="true">A</div>
            <div className="user-info">
              <div className="user-name">Acudiente</div>
              <div className="user-role">Usuario</div>
            </div>
          </div>

          <div className="sidebar-actions">
            <button
              className="btn btn-logout"
              onClick={() => handleClick({ esLogout: true })}
              title="Cerrar sesión"
            >
              <i className="bi bi-box-arrow-right" /> <span className="d-none d-lg-inline">Salir</span>
            </button>
          </div>
        </div>
      </div>

      {/* === MOBILE SIDEBAR (OFFCANVAS) === */}
      <div
        className={`offcanvas offcanvas-start sidebar-mobile ${open ? "show" : "hide"}`}
        style={{ visibility: open ? "visible" : "hidden" }}
        tabIndex="-1"
        id="sidebarMobile"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title d-flex align-items-center gap-2">
            <i className="bi bi-mortarboard-fill text-primary" />
            Panel Acudiente
          </h5>
          <button
            className="btn-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
            title="Cerrar"
          />
        </div>

        <div className="offcanvas-body p-0">
          <div className="sidebar-menu">
            {menuItems.map((item) => (
              <button
                key={item.nombre}
                className={`menu-item ${seccionActiva === item.seccion ? "active" : ""}`}
                onClick={() => handleClick(item, true)}
                title={item.nombre}
              >
                <div className="d-flex align-items-center">
                  <i className={`bi ${item.icono} menu-icon`} />
                  <span className="menu-text">{item.nombre}</span>
                </div>
                <i className="bi bi-chevron-right menu-arrow" />
              </button>
            ))}
          </div>

          <div className="mobile-footer p-3">
            <div className="mobile-user d-flex align-items-center gap-2">
              <div className="user-avatar-sm">A</div>
              
            </div>

            <div className="mt-3 d-flex gap-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  // ejemplo: acción rápida
                  setOpen(false);
                }}
              >
                Cerrar
              </button>
              <button
                className="btn btn-danger w-100"
                onClick={() => handleClick({ esLogout: true }, true)}
              >
                <i className="bi bi-box-arrow-right me-1" /> Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY MANUAL PARA OFFCANVAS */}
      {open && (
        <div
          className="sidebar-overlay position-fixed top-0 start-0 w-100 h-100 d-md-none"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default SidebarAcudiente;
