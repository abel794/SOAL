import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PanelAcudiente.css";

import SidebarAcudiente from "../SidebarAcudiente/SidebarAcudiente";
import HeaderAcudiente from "../AcudienteHeader/AcudienteHeader";
import ConfiguracionCuenta from "../ConfiguracionCuenta/ConfiguracionCuenta";
import EnviarPQR from "../PQR/EnviarPQR";
import EnviarJustificacion from "../Justificaciones/justificaciones";
import Notificaciones from "../Notificaciones/Notificaciones";
import HistorialPQR from "../PQR/HistorialPQR";
import VerJustificaciones from "../Justificaciones/Ver_justificaciones";
import EstudiantesCards from "../EstudianteAcudiente/estudiante_acudiente";

import { useNavigate } from "react-router-dom";
import { cerrarSesion } from "../../../utils/auth";
import useAutoLogout from "../../Login/useAutoLogout";
import HamburgerBtn from "../SidebarAcudiente/HamburgerBtn";

const PanelAcudiente = () => {
  const [mensaje, setMensaje] = useState("");
  const [open, setOpen] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("Dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  /** Auto logout */
  useAutoLogout(() => cerrarSesion(navigate), 10 * 60 * 1000);

  /** Cuando el Sidebar pide logout → mostramos modal */
  const handleRequestLogout = () => {
    setShowLogoutModal(true);
  };

  const ejecutarCerrarSesion = () => {
    setShowLogoutModal(false);
    cerrarSesion(navigate);
  };

  const cancelarCerrarSesion = () => {
    setShowLogoutModal(false);
  };

  const cambiarSeccion = (nombreSeccion) => {
    setSeccionActiva(nombreSeccion);
    setOpen(false); // cerrar menú móvil
  };

  /** Si ensancha pantalla → cerramos menú móvil */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock data estudiantes
  const estudiantesMock = [
    { id_estudiante: 1, nombre: "David", apellido: "Martinez", documento: "123456", edad: 10, grado: "4A", observaciones: 2 },
    { id_estudiante: 2, nombre: "María", apellido: "Pérez", documento: "789012", edad: 11, grado: "5B", observaciones: 5 },
    { id_estudiante: 3, nombre: "Juan", apellido: "Gomez", documento: "345678", edad: 9, grado: "3C", observaciones: 1 },
  ];

  return (
    <div className={`panel-acudiente d-flex ${open ? "sidebar-open" : ""}`}>
      
      {/* Botón hamburguesa (solo móvil) */}
      <HamburgerBtn onClick={() => setOpen(!open)} />

      {/* Sidebar */}
      <SidebarAcudiente
        open={open}
        setOpen={setOpen}
        cambiarSeccion={cambiarSeccion}
        seccionActiva={seccionActiva}
        onCerrarSesion={handleRequestLogout}
      />

      {/* Overlay móvil */}
      {open && <div className="mobile-overlay d-md-none" onClick={() => setOpen(false)} />}

      {/* Contenido principal */}
      <div className="panel-contenido main-content">
        <div className="contenido-centrado">
          <div className="header-fijo">
            <HeaderAcudiente setSeccionActiva={setSeccionActiva} />
          </div>
          
          <div className="p-4">
            {seccionActiva === "Dashboard" && <EstudiantesCards estudiantes={estudiantesMock} />}
            {seccionActiva === "Configuracion de Cuenta" && <ConfiguracionCuenta />}
            {seccionActiva === "Enviar PQR" && <EnviarPQR />}
            {seccionActiva === "Enviar Justificacion" && <EnviarJustificacion setSeccionActiva={setSeccionActiva} />}
            {seccionActiva === "Notificaciones" && <Notificaciones />}
            {seccionActiva === "Historial de PQR" && <HistorialPQR />}
            {seccionActiva === "Ver Justificaciones" && <VerJustificaciones />}
          </div>
        </div>
      </div>

      {/* Modal Logout */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(200, 222, 222, 0.61)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div style={{ width: 360, maxWidth: "95%", background: "#fff", borderRadius: 8, padding: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}>
            <h5 className="mb-2">¿Estás seguro que deseas cerrar sesión?</h5>
            <p className="text-muted mb-3" style={{ fontSize: 14 }}>
              Si cierras sesión deberás iniciar sesión nuevamente.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary" onClick={cancelarCerrarSesion}>Cancelar</button>
              <button className="btn btn-danger" onClick={ejecutarCerrarSesion}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAcudiente;