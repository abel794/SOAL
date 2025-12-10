import React, { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaSignOutAlt,
  FaHome,
  FaSearch,
  FaRegStickyNote,
  FaClipboardList,
  FaCalendarAlt,
  FaGraduationCap,
  FaBell,
  FaCog,
  FaChalkboardTeacher,
  FaUserTie,
  FaToggleOn,
  FaChalkboard,
  FaUserCheck,
  FaReply,
  FaFolder,
  FaLevelUpAlt,
  FaHistory,
  FaExclamationTriangle,
  FaChartBar,
  FaListOl,
  FaCalendarPlus,
  FaCalendarCheck,
  FaUsers,
  FaUserPlus,
  FaUserCog,
  FaEnvelopeOpenText,
  FaFileAlt

} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar({
  abierto = true,
  toggleMenu = () => {},
  setVista = () => {},
  onCerrarSesion = () => {},
  vistaActual = "Dashboard"
}) {
  const [esMovil, setEsMovil] = useState(() =>
    window.matchMedia ? window.matchMedia("(max-width: 767px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setEsMovil(e.matches);
    
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
    } else {
      mq.addListener(handler);
    }
    
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, []);

  const toggleRef = useRef(null);
  
  useEffect(() => {
    if (!abierto && toggleRef.current) {
      toggleRef.current.focus?.();
    }
  }, [abierto]);

  // Opciones organizadas por categorías
  const opciones = [
    // Dashboard y búsqueda
    { label: "Dashboard", icon: <FaHome />, categoria: "principal" },
    { label: "Buscar estudiante", icon: <FaSearch />, categoria: "principal" },
    
    // Gestión académica
    { label: "Matricular estudiante", icon: <FaGraduationCap />, categoria: "academica" },
    { label: "Grados y estudiantes", icon: <FaChalkboard />, categoria: "academica" },
    { label: "Registrar asistencia", icon: <FaUserCheck />, categoria: "academica" },
    { label: "Promover Estudiantes", icon: <FaLevelUpAlt />, categoria: "academica" },

    
    // Observaciones
    { label: "Registrar observación", icon: <FaRegStickyNote />, categoria: "observaciones" },
    { label: "Historial de Observaciones", icon: <FaHistory />, categoria: "observaciones" },
    { label: "Casos críticos", icon: <FaExclamationTriangle />, categoria: "observaciones" },
    { label: "Grado Mas Observaciones", icon: <FaChartBar />, categoria: "observaciones" },
    { label: "Total Observaciones", icon: <FaListOl />, categoria: "observaciones" },
    
    // Citas y reuniones
    { label: "Agendar cita con acudiente", icon: <FaCalendarPlus />, categoria: "citas" },
    { label: "Ver citas", icon: <FaCalendarCheck />, categoria: "citas" },
    
    // Gestión de usuarios
    { label: "Profesores Activos", icon: <FaUsers />, categoria: "usuarios" },
    { label: "Registrar profesor", icon: <FaUserPlus />, categoria: "usuarios" },
    { label: "Registrar secretaria", icon: <FaUserTie />, categoria: "usuarios" },
    { label: "Asignar grado a profesor", icon: <FaChalkboard />, categoria: "usuarios" },
    { label: "Activar o desactivar usuario", icon: <FaUserCog />, categoria: "usuarios" },
    
    // Comunicación y soporte
    { label: "Responder PQR", icon: <FaEnvelopeOpenText />, categoria: "comunicacion" },
    
    // Sistema
    { label: "Notificaciones", icon: <FaBell />, categoria: "sistema" },
    { label: "Ver archivos", icon: <FaFileAlt />, categoria: "sistema" },
    { label: "Configuración", icon: <FaCog />, categoria: "sistema" }
  ];

  // Agrupar opciones por categoría
  const opcionesPorCategoria = opciones.reduce((acc, opcion) => {
    if (!acc[opcion.categoria]) {
      acc[opcion.categoria] = [];
    }
    acc[opcion.categoria].push(opcion);
    return acc;
  }, {});

  const handleSelect = (label) => {
    setVista(label);
    if (esMovil) {
      toggleMenu();
    }
  };

  const renderOpciones = () => {
    if (!abierto) {
      // Vista colapsada - solo íconos
      return (
        <ul className="sidebar-lista">
          {opciones.map((op) => {
            const active = vistaActual === op.label;
            return (
              <li key={op.label}>
                <button
                  type="button"
                  onClick={() => handleSelect(op.label)}
                  className={`sidebar-btn ${active ? "activo" : ""}`}
                  aria-current={active ? "page" : undefined}
                  title={op.label}
                >
                  <span className="sidebar-icono">{op.icon}</span>
                </button>
              </li>
            );
          })}
        </ul>
      );
    }

    // Vista expandida - con categorías
    return (
      <div className="sidebar-contenido-expandido">
        {Object.entries(opcionesPorCategoria).map(([categoria, opcionesCat]) => (
          <div key={categoria} className="sidebar-categoria">
            <div className="sidebar-categoria-titulo">
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </div>
            <ul className="sidebar-lista">
              {opcionesCat.map((op) => {
                const active = vistaActual === op.label;
                return (
                  <li key={op.label}>
                    <button
                      type="button"
                      onClick={() => handleSelect(op.label)}
                      className={`sidebar-btn ${active ? "activo" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="sidebar-icono">{op.icon}</span>
                      <span className="sidebar-texto">{op.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        ref={toggleRef}
        className={`sidebar-toggle ${abierto ? "abierto" : "cerrado"}`}
        onClick={toggleMenu}
        aria-expanded={abierto}
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
      >
        <FaBars />
      </button>

      {/* Sidebar - CLASES ACTUALIZADAS */}
      <div
        className={`sidebar-container ${abierto ? "abierto" : "cerrado"}`}
        aria-label="Barra lateral de navegación"
        role="navigation"
      >
        {/* Header */}
        <div className={`sidebar-header ${abierto ? "expandido" : "colapsado"}`}>
          {abierto ? (
            <div className="sidebar-header-contenido">
              <div className="sidebar-avatar">
                <FaChalkboardTeacher />
              </div>
              <div className="sidebar-info">
                <div className="sidebar-titulo">Coordinador</div>
                <div className="sidebar-subtitulo">Instituto Descartes</div>
              </div>
            </div>
          ) : (
            <div className="sidebar-avatar-mini">
              <FaChalkboardTeacher />
            </div>
          )}
        </div>

        {/* Opciones de navegación */}
        <div className="sidebar-opciones">
          {renderOpciones()}
        </div>

        {/* Footer - Cerrar sesión */}
        <div className="sidebar-footer">
          <button
            type="button"
            onClick={onCerrarSesion}
            className="sidebar-logout"
            title={abierto ? "" : "Cerrar sesión"}
          >
            <span className="sidebar-icono">
              <FaSignOutAlt />
            </span>
            {abierto && <span className="sidebar-texto">Cerrar sesión</span>}
          </button>
        </div>
      </div>

      {/* Overlay para móvil */}
      {esMovil && abierto && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}