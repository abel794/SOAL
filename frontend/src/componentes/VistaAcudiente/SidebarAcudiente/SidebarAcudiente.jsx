import React from "react";
import "./AcudienteSidebar.css";

/**
 * SidebarAcudiente - Componente de navegación responsive
 */
const SidebarAcudiente = ({ open, setOpen, cambiarSeccion, seccionActiva, onCerrarSesion }) => {
  const menuItems = [
    { 
      nombre: "Dashboard", 
      icono: "bi bi-house-door",
      seccion: "Dashboard"
    },
    { 
      nombre: "Notificaciones", 
      icono: "bi bi-bell",
      seccion: "Notificaciones"
    },
    { 
      nombre: "Enviar PQR", 
      icono: "bi bi-chat-dots",
      seccion: "Enviar PQR"
    },
    { 
      nombre: "Enviar Justificacion", 
      icono: "bi bi-file-earmark-medical",
      seccion: "Enviar Justificacion"
    },
    { 
      nombre: "Historial de PQR", 
      icono: "bi bi-clock-history",
      seccion: "Historial de PQR"
    },
    { 
      nombre: "Configuracion de Cuenta", 
      icono: "bi bi-gear",
      seccion: "Configuracion de Cuenta"
    },
    { 
      nombre: "Cerrar Sesion", 
      icono: "bi bi-box-arrow-right",
      seccion: "Cerrar Sesion",
      esLogout: true
    },
  ];

  const handleClick = (e, item, isMobile = false) => {
    e.preventDefault();

    if (item.esLogout) {
      if (typeof onCerrarSesion === "function") {
        onCerrarSesion();
      } else {
        console.warn("onCerrarSesion no está definido en SidebarAcudiente");
      }
      if (isMobile) setOpen(false);
      return;
    }

    cambiarSeccion(item.seccion);
    if (isMobile) setOpen(false);
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
              className={`nav-item ${seccionActiva === item.seccion ? 'nav-item-active' : ''} ${
                item.esLogout ? 'nav-item-logout' : ''
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
        </div>
      </div>

      {/* Sidebar Mobile */}
      <div className={`sidebar-mobile ${open ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-mobile-header">
          <div className="sidebar-logo">
            <i className="bi bi-mortarboard-fill"></i>
            <span className="sidebar-title">Panel Acudiente</span>
          </div>
          <button 
            className="sidebar-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.nombre}
              className={`nav-item ${seccionActiva === item.seccion ? 'nav-item-active' : ''} ${
                item.esLogout ? 'nav-item-logout' : ''
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
      </div>

      {/* Overlay Mobile */}
      {open && (
        <div 
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarAcudiente;