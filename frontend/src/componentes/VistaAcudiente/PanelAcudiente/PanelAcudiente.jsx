import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import HeaderAcudiente from "../AcudienteHeader/AcudienteHeader";
import ConfiguracionCuenta from "../ConfiguracionCuenta/ConfiguracionCuenta";
import EnviarPQR from "../PQR/EnviarPQR";
import EnviarJustificacion from "../Justificaciones/justificaciones";
import Notificaciones from "../Notificaciones/Notificaciones";
import HistorialPQR from "../PQR/HistorialPQR";
import VerJustificaciones from "../Justificaciones/Ver_justificaciones";
import EstudiantesCards from "../EstudianteAcudiente/estudiante_acudiente";
import SidebarAcudiente from "../SidebarAcudiente/SidebarAcudiente";

import { useNavigate } from "react-router-dom";
import { cerrarSesion } from "../../../utils/auth";
import useAutoLogout from "../../Login/useAutoLogout";

const PanelAcudiente = () => {
  const [configColegio, setConfigColegio] = useState(null);

useEffect(() => {
  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/coordinador/configuracionSistema", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Error cargando configuración");
      const data = await res.json();
      setConfigColegio(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchConfig();
}, []);

  const [seccionActiva, setSeccionActiva] = useState("Dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [open, setOpen] = useState(false);


  const navigate = useNavigate();
  useAutoLogout(() => cerrarSesion(navigate), 10 * 60 * 1000);

  const handleRequestLogout = () => {
    setShowLogoutModal(true);
  };

  const ejecutarCerrarSesion = () => {
    setShowLogoutModal(false);
    cerrarSesion(navigate);
  };

  const cambiarSeccion = (name) => {
    setSeccionActiva(name);
  };

  return (
    <div className="w-100 position-relative">
      {/* Sidebar */}
    <SidebarAcudiente
      open={open}
      setOpen={setOpen}
      cambiarSeccion={cambiarSeccion}
      seccionActiva={seccionActiva}
      onCerrarSesion={ejecutarCerrarSesion}
    />
      {/* Header */}
      <div className="sticky-top bg-white border-bottom shadow-sm">
      <HeaderAcudiente 
        setSeccionActiva={setSeccionActiva} 
        openSidebar={open} 
        setOpenSidebar={setOpen} 
      />

      </div>

      {/* Contenido */}
      <div className="p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        {seccionActiva === "Dashboard" && <EstudiantesCards />}
        {seccionActiva === "Configuracion de Cuenta" && <ConfiguracionCuenta />}
        {seccionActiva === "Enviar PQR" && <EnviarPQR />}
        {seccionActiva === "Enviar Justificacion" && (
          <EnviarJustificacion setSeccionActiva={setSeccionActiva} />
        )}
        {seccionActiva === "Notificaciones" && <Notificaciones />}
        {seccionActiva === "Historial de PQR" && <HistorialPQR />}
        {seccionActiva === "Ver Justificaciones" && <VerJustificaciones />}
      </div>

      {/* Modal Logout */}
      {showLogoutModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.3)",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div className="bg-white rounded shadow p-4" style={{ width: 350, maxWidth: "95%" }}>
            <h5 className="mb-2">¿Estás seguro que deseas cerrar sesión?</h5>
            <p className="text-muted" style={{ fontSize: 14 }}>
              Si cierras sesión deberás iniciar sesión nuevamente.
            </p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={ejecutarCerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
        
      )}
      {/* Footer con información del colegio */}
{configColegio && (
  <footer className="mt-4 py-4 px-3 bg-white border-top shadow-sm">
    <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
      
      {/* Logo */}
      <div className="footer-logo d-flex align-items-center">
        {configColegio.logo ? (
          <img
            src={`http://localhost:3000/uploads/${configColegio.logo}`}
            alt="Logo Colegio"
            style={{ height: 60, objectFit: "contain", marginRight: 12 }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              borderRadius: 8,
              marginRight: 12,
            }}
          >
            🏫
          </div>
        )}
        <div className="footer-nombre">
          <strong>{configColegio.nombre_colegio}</strong>
          <div className="text-muted" style={{ fontSize: 14 }}>
            Año escolar: {configColegio.anio_escolar}
          </div>
        </div>
      </div>

      {/* Datos de contacto */}
      <div className="footer-contacto text-center text-md-start">
        {configColegio.direccion && <div>📍 {configColegio.direccion}</div>}
        {configColegio.telefono && <div>📞 {configColegio.telefono}</div>}
        {configColegio.correo && <div>✉️ {configColegio.correo}</div>}
        {configColegio.hora_cierre && <div>⏰ Hora de cierre: {configColegio.hora_cierre}</div>}
        {configColegio.medio_notificacion && <div>📢 Notificaciones por: {configColegio.medio_notificacion}</div>}
      </div>

      {/* Mensaje institucional */}
      {configColegio.mensaje_institucional && (
        <div className="footer-mensaje text-center text-md-end fst-italic text-secondary" style={{ maxWidth: 300 }}>
          "{configColegio.mensaje_institucional}"
        </div>
      )}
    </div>
  </footer>
)}


    </div>
  );
};

export default PanelAcudiente;
