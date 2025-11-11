import React, { useState } from "react";
import './style/BarraLateralSecretaria.css';
import {
  FaHome,
  FaUserGraduate,
  FaClipboardList,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaBars,
} from "react-icons/fa";
import { HiChartBar, HiDocumentSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const BarraLateralSecretaria = ({ setVista }) => {
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
        <h2 className="textomenu">Secretaría</h2>
      </div>

      <div className={`barra-lateral ${menuAbierto ? "abierto" : "cerrado"}`}>
        <nav className="menu">
          <button onClick={() => setVista("inicio")}>
            <FaHome className="icono" />
            <span>Inicio</span>
          </button>
          <button onClick={() => setVista("Dashboard")}>
            <HiChartBar className="icono" />
            <span>Dashboard</span>
          </button>
          <button onClick={() => setVista("matriculas")}>
            <FaClipboardList className="icono" />
            <span>Matrículas</span>
          </button>
          <button onClick={() => setVista("estudiantes")}>
            <FaUserGraduate className="icono" />
            <span className="textoacu">Buscar Estudiantes/Acudiente</span>
          </button>
          <button onClick={() => setVista("ResponderPQR")}>
            <HiDocumentSearch className="icono" />
            <span>PQR</span>
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
        </div>
      )}
    </>
  );
};

export default BarraLateralSecretaria;
