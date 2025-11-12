// src/componentes/Secretaria/BarraLateralSecretaria.jsx
import React, { useState, useEffect } from "react";
import './style/BarraLateralSecretaria.css';
import {
  FaHome,
  FaUserGraduate,
  FaClipboardList,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaBars,
  FaTimes,
  FaChartBar,
  FaComments,
  FaUserCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ModalMensaje from "../../ui/ModalMensaje"; // ✅ se importa tu componente

const BarraLateralSecretaria = ({ setVista }) => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [activeItem, setActiveItem] = useState("inicio");
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { id: "inicio", icon: FaHome, label: "Inicio", vista: "inicio" },
    { id: "dashboard", icon: FaChartBar, label: "Dashboard", vista: "Dashboard" },
    { id: "matriculas", icon: FaClipboardList, label: "Matrículas", vista: "matriculas" },
    { id: "estudiantes", icon: FaUserGraduate, label: "Buscar Estudiantes", vista: "estudiantes" },
    { id: "pqr", icon: FaComments, label: "Gestión PQR", vista: "ResponderPQR" },
    { id: "notificaciones", icon: FaBell, label: "Notificaciones", vista: "notificaciones" },
    { id: "configuracion", icon: FaCog, label: "Configuración", vista: "configuracion" },
  ];

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleMenuClick = (vista, id) => {
    setVista(vista);
    setActiveItem(id);
    if (isMobile) setMenuAbierto(false);
  };

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setMenuAbierto(!mobile);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <>
      {isMobile && (
        <div className="mobile-header">
          <div className="hamburguesa" onClick={toggleMenu}>
            {menuAbierto ? <FaTimes /> : <FaBars />}
          </div>
          <div className="mobile-title">
            <span>Secretaría</span>
          </div>
          <div className="user-avatar-mobile">
            <FaUserCircle />
          </div>
        </div>
      )}

      {isMobile && menuAbierto && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <div className={`barra-lateral ${menuAbierto ? "abierto" : "cerrado"}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo">
              <div className="logo-icon">🎓</div>
            </div>
            <div className="logo-text">
              <h3>Sistema Escolar</h3>
              <span>Panel Secretaría</span>
            </div>
          </div>
          {isMobile && (
            <button className="close-menu" onClick={toggleMenu}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <FaUserCircle />
          </div>
          <div className="user-details">
            <h1>Secretaria</h1>
          </div>
        </div>

        <nav className="menu-navegacion">
          <div className="menu-section">
            <span className="section-label">Navegación Principal</span>
            <div className="menu-items">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`menu-item ${activeItem === item.id ? "active" : ""}`}
                    onClick={() => handleMenuClick(item.vista, item.id)}
                  >
                    <div className="menu-item-content">
                      <div className="icon-wrapper">
                        <IconComponent className="menu-icon" />
                      </div>
                      <span className="menu-label">{item.label}</span>
                    </div>
                    <div className="active-indicator"></div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="logout-section">
          <button 
            className="logout-btn"
            onClick={() => setMostrarModal(true)}
          >
            <div className="logout-icon">
              <FaSignOutAlt />
            </div>
            <span className="logout-text">Cerrar Sesión</span>
          </button>
        </div>

        <div className="version-info">
          <span>v2.1.0</span>
        </div>
      </div>

      {/* ✅ ModalMensaje integrado */}
      <ModalMensaje
        visible={mostrarModal}
        tipo="confirmacion"
        titulo="Cerrar Sesión"
        mensaje="¿Estás seguro de que deseas cerrar la sesión? Tendrás que iniciar sesión nuevamente para acceder al sistema."
        onClose={() => setMostrarModal(false)}
        onConfirm={cerrarSesion}
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
      />
    </>
  );
};

export default BarraLateralSecretaria;
