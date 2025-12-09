// src/componentes/PanelEstudiante/PanelEstudiante.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Sidebar from "../Sidebar/Sidebar";
import HeaderEstudiante from "../Header/Header";
import ObservacionCard from "../ObservacionCard/ObservacionCard";
import NotificacionesEstudiante from "../notificacionesEstudiante/notificacionesEstudiante";
import ConfiguracionCuenta from "../configuracionEstudiante/ConfiguracionEstudiante";
import DashboardEstudiante from "../dashboardEstudiante/DashboardEstudiante";
import "./style/PanelEstudiante.css";
import { cerrarSesion } from "../../../utils/auth";
import useAutoLogout from "../../Login/useAutoLogout";

export default function PanelEstudiante() {
  const [vistaActiva, setVistaActiva] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ⏱ Auto logout tras 10 min de inactividad
  useAutoLogout(() => cerrarSesion(navigate), 10 * 60 * 1000);

  // 🔄 Cargar datos del usuario al iniciar
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const documento = localStorage.getItem("documento");

        if (!token || !documento) {
          throw new Error("No hay token o documento en localStorage");
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Hacer las peticiones para obtener datos del usuario
        const [usuarioRes, personaRes] = await Promise.all([
          // API para datos básicos del usuario
          axios.get("http://localhost:3000/api/usuarios/me", { headers }).catch(() => null),
          // API para datos completos de la persona (la misma que usa ConfiguracionCuenta)
          axios.get(`http://localhost:3000/api/coordinador/persona/${documento}`, { headers }).catch(() => null)
        ]);

        let datosUsuario = {};

        // Procesar datos de la API de persona (prioridad)
        if (personaRes?.data) {
          const data = personaRes.data;
          datosUsuario = {
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            email: data.correo || "",
            documento: documento,
            telefono: data.telefono || "",
            direccion: data.direccion || "",
            ciudad_residencia: data.ciudad_residencia || "",
            ocupacion: data.ocupacion || "",
            foto: data.foto || null
          };
        }

        // Complementar con datos de la API de usuarios/me si es necesario
        if (usuarioRes?.data && !datosUsuario.nombre) {
          const data = usuarioRes.data;
          datosUsuario = {
            ...datosUsuario,
            nombre: data.nombre || data.persona?.nombre || "",
            apellido: data.apellido || data.persona?.apellido || "",
            email: data.email || datosUsuario.email || ""
          };
        }

        // Si no se obtuvieron datos, usar valores por defecto
        if (!datosUsuario.nombre) {
          datosUsuario = {
            nombre: "Estudiante",
            apellido: "",
            email: "estudiante@universidad.edu",
            documento: documento,
            telefono: "",
            direccion: "",
            ciudad_residencia: "",
            ocupacion: "Estudiante",
            foto: null
          };
        }

        setUserData(datosUsuario);
        setLoading(false);

      } catch (error) {
        console.error("Error cargando datos del usuario:", error);
        
        // Datos por defecto en caso de error
        const datosPorDefecto = {
          nombre: "Estudiante",
          apellido: "",
          email: "estudiante@universidad.edu",
          documento: localStorage.getItem("documento") || "",
          telefono: "",
          direccion: "",
          ciudad_residencia: "",
          ocupacion: "Estudiante",
          foto: null
        };
        
        setUserData(datosPorDefecto);
        setLoading(false);
      }
    };

    cargarDatosUsuario();
  }, []);

  // 🖥 Manejar responsive y cerrar sidebar en pantallas grandes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🚪 Manejar cierre de sesión
  const handleCerrarSesion = () => {
    cerrarSesion(navigate);
  };

  // 🔄 Cambiar vista
  const handleCambiarVista = (vista) => {
    setVistaActiva(vista);
    // Cerrar sidebar en móvil al cambiar de vista
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // 🔄 Actualizar datos del usuario (para cuando se modifiquen en ConfiguracionCuenta)
  const handleActualizarUserData = (nuevosDatos) => {
    setUserData(prev => ({ ...prev, ...nuevosDatos }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <span className="ms-2">Cargando panel del estudiante...</span>
      </div>
    );
  }

  return (
    <div className={`panel-estudiante ${sidebarOpen ? "con-sidebar" : "sin-sidebar"}`}>
      <Sidebar
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
        setVista={handleCambiarVista}
        vistaActiva={vistaActiva}
        onCerrarSesion={handleCerrarSesion}
        userData={userData}
      />

      <div className="panel-contenido">
        <HeaderEstudiante 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userData={userData}
          vistaActiva={vistaActiva}
        />

        <main className="panel-main">
          <div className="contenido">
            {vistaActiva === "dashboard" && <DashboardEstudiante userData={userData} />}
            {vistaActiva === "observaciones" && <ObservacionCard userData={userData} />}
            {vistaActiva === "notificaciones" && <NotificacionesEstudiante userData={userData} />}
            {vistaActiva === "configuracion" && (
              <ConfiguracionCuenta 
                userData={userData} 
                onActualizarUserData={handleActualizarUserData}
              />
            )}
            
            {/* Vista por defecto si no coincide ninguna */}
            {!["dashboard", "observaciones", "notificaciones", "configuracion"].includes(vistaActiva) && (
              <div className="vista-no-encontrada">
                <div className="alert alert-warning">
                  <h4>Vista no encontrada</h4>
                  <p>La vista "{vistaActiva}" no está disponible.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleCambiarVista("dashboard")}
                  >
                    Volver al Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}