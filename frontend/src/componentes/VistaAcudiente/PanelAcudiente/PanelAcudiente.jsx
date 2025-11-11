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

import { useNavigate } from "react-router-dom";  // para redirigir
import { cerrarSesion } from "../../../utils/auth"; // función de logout (limpia token + redirige)
import useAutoLogout from "../../Login/useAutoLogout"; // hook de auto logout
import HamburgerBtn from "../SidebarAcudiente/HamburgerBtn"; // Importamos el botón de hamburguesa

const PanelAcudiente = () => {
  const [mensaje, setMensaje] = useState("");
  const [open, setOpen] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("Dashboard");

  // Estado para manejar la visibilidad del modal de logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  // ⏱ Auto logout por inactividad (10 minutos)
  useAutoLogout(() => cerrarSesion(navigate), 10 * 60 * 1000);

  // ESTA función se pasa al Sidebar: cuando el Sidebar dice "quiere cerrar sesión"
  // abrimos el modal aquí, el usuario confirma desde el modal.
  const handleRequestLogout = () => {
    setShowLogoutModal(true);
  };

  // Si confirma en el modal, ejecutar cierre de sesión real
  const ejecutarCerrarSesion = () => {
    setShowLogoutModal(false);
    cerrarSesion(navigate);
  };

  // Si cancela, cerramos el modal y no hacemos nada
  const cancelarCerrarSesion = () => {
    setShowLogoutModal(false);
  };

  const cambiarSeccion = (nombreSeccion) => {
    setSeccionActiva(nombreSeccion);
    setOpen(false); // cerrar menú móvil si está abierto
  };

  // Manejo del menú responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock data (igual que tenías)
  const observaciones = [
    { id: 1, nombre: "David Martinez", grado: "4A", fecha: "24 abr. 2024, 10:30", titulo: "Observación importante", descripcion: "..." },
    { id: 2, nombre: "María Pérez", grado: "5B", fecha: "20 may. 2024, 09:10", titulo: "Retraso reiterado", descripcion: "..." },
    { id: 3, nombre: "Juan Gomez", grado: "3C", fecha: "10 jun. 2024, 14:00", titulo: "Excelente participación", descripcion: "..." },
  ];

  // Mock data estudiantes
  const estudiantesMock = [
    { id_estudiante: 1, nombre: "David", apellido: "Martinez", documento: "123456", edad: 10, grado: "4A", observaciones: 2 },
    { id_estudiante: 2, nombre: "María", apellido: "Pérez", documento: "789012", edad: 11, grado: "5B", observaciones: 5 },
    { id_estudiante: 3, nombre: "Juan", apellido: "Gomez", documento: "345678", edad: 9, grado: "3C", observaciones: 1 },
  ];

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Botón hamburguesa (solo móvil) */}
      <HamburgerBtn onClick={() => setOpen(!open)} />

      {/* PASAMOS la función que abre el modal al Sidebar */}
      <SidebarAcudiente
        open={open}
        setOpen={setOpen}
        cambiarSeccion={cambiarSeccion}
        seccionActiva={seccionActiva}
        onCerrarSesion={handleRequestLogout} // ahora el Sidebar solo solicita el logout
      />

      {/* Overlay en móvil */}
      {open && (
        <div
          className="mobile-overlay d-md-none"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4 bg-white panel-contenido">
        <HeaderAcudiente setSeccionActiva={setSeccionActiva} />

        {seccionActiva === "Dashboard" && (
          <EstudiantesCards estudiantes={estudiantesMock} />
        )}

        {seccionActiva === "Configuracion de Cuenta" && <ConfiguracionCuenta />}
        {seccionActiva === "Enviar PQR" && <EnviarPQR />}
        {seccionActiva === "Enviar Justificacion" && <EnviarJustificacion setSeccionActiva={setSeccionActiva} />}
        {seccionActiva === "Notificaciones" && <Notificaciones />}
        {seccionActiva === "Historial de PQR" && <HistorialPQR />}
        {seccionActiva === "Ver Justificaciones" && <VerJustificaciones />}
      </div>

      {/* -------------------- Modal centrado (sin dependencias) -------------------- */}
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
              Si cierras sesión deberás iniciar sesión nuevamente para acceder.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary" onClick={cancelarCerrarSesion}>No, quedar</button>
              <button className="btn btn-danger" onClick={ejecutarCerrarSesion}>Sí, cerrar sesión</button>
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------------------ */}
    </div>
  );
};

export default PanelAcudiente;