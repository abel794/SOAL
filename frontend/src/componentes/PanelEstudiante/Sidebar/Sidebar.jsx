import React, { useState } from "react";
import './style/Sidebar.css';
import {
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaBars,
} from "react-icons/fa";
import { HiDocumentSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setVista }) => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [mostrarCard, setMostrarCard] = useState(false);
  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <>
        <div className="encabezado">
          <div className="hamburguesa" onClick={toggleMenu}>
            <FaBars />
          </div>
          <h2 className="texto1">Estudiante</h2>
        </div>

      <div className={`barra-lateral ${menuAbierto ? "abierto" : "cerrado"}`}>
        <nav className="menu">
          <button onClick={() => setVista("Observacion")}>
            <HiDocumentSearch className="icono" />
            <span>Observacion</span>
          </button>
          <button onClick={() => setVista("notificaciones")}>
            <FaBell className="icono" />
            <span>Notificaciones</span>
          </button>
          <button onClick={() => setVista("configuracion")}>
            <FaCog className="icono" />
            <span>Configuración</span>
          </button>
          <button onClick={() => setMostrarCard(true)}>
                      <FaSignOutAlt className="icono" />
                      <span>Cerrar sesión</span>
                    </button>
                  </nav>
                </div>
          
                {/* Card de confirmación */}
                {mostrarCard && (
                  <div className="overlay">
                    <div className="card-confirmacion">
                      <h3>¿Seguro que deseas cerrar sesión?</h3>
                      <div className="acciones">
                        <button className="btn-cancelar" onClick={() => setMostrarCard(false)}>
                          Cancelar
                        </button>
                        <button className="btn-confirmar" onClick={cerrarSesion}>
                          Sí, cerrar
                        </button>
                      </div>
                    </div>
                  </div>)}
    </>
  );
};

export default Sidebar;
