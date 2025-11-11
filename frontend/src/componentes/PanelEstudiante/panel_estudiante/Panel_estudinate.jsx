// src/componentes/PanelEstudiante/PanelEstudiante.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Sidebar from "../Sidebar/Sidebar";
import HeaderEstudiante from "../Header/Header"; // 👈 Cambiado el nombre para claridad
import ObservacionCard from "../ObservacionCard/ObservacionCard";
import NotificacionesEstudiante from "../notificacionesEstudiante/notificacionesEstudiante";
import ConfiguracionCuenta from "../configuracionEstudiante/ConfiguracionEstudiante";
import "./style/PanelEstudiante.css";
import { cerrarSesion } from "../../../utils/auth";
import useAutoLogout from "../../Login/useAutoLogout";

export default function PanelEstudiante() {
  const [vistaActiva, setVistaActiva] = useState("observaciones"); // ✅ Valor corregido
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ⏱ Auto logout tras 10 min de inactividad
  useAutoLogout(() => cerrarSesion(navigate), 10 * 60 * 1000);

  // 🖥 Escucha el resize (opcional)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // En caso de querer sincronizar el sidebar
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`panel-estudiante ${sidebarOpen ? "con-sidebar" : "sin-sidebar"}`}>
      <Sidebar
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
        setVista={setVistaActiva}
      />

      <div className="panel-contenido">
        <HeaderEstudiante onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="panel-main">
          <div className="contenido">
            {vistaActiva === "observaciones" && <ObservacionCard />}
            {vistaActiva === "notificaciones" && <NotificacionesEstudiante />}
            {vistaActiva === "configuracion" && <ConfiguracionCuenta />}
          </div>
        </main>
      </div>
    </div>
  );
}
