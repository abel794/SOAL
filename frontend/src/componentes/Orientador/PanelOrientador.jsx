import React, { useState, useEffect } from "react";
import ListaEstudiantes from "./ListaEstudiantes.jsx";
import HistorialAsistenciasProfesor from "./HistorialAsistencia.jsx";
import RegistrarAsistenciaMasiva from "./RegistrarAsistenciaMasiva.jsx";
import AgendarCitaAcu from "../Profesor/Agendar_cita_con_acudiente/Agendar_cita_con_acudiente.jsx";
import ObservacionPage from "./ObservacionPage.jsx";
import ConfiguracionUsuario from "./ConfiguracionUsuario.jsx";
import ModalMensaje from "../ui/ModalMensaje.jsx";
import NotificacionesPorGrado from "./NotificacionesPorGrado.jsx";
import BuscarEstudiante from "../Orientador/BuscarEstudiante/BuscarEstudiante.jsx";
import "./PanelProfesor.css";
import BuscarEstudiantes from "../Secretaria/Estudiantes/BuscarEstudiantes.jsx";
import HistorialObservaciones from './historialObservaciones/historialObservaciones.jsx';
import RegistrarObservacion from "../Orientador/registrarObservacion/registrarObservacion.jsx";
import {
  FaUserGraduate,
  FaClipboardList,
  FaHistory,
  FaSearch,
  FaClipboardCheck,
  FaUsers,
  FaStickyNote,
  FaCalendarAlt,
  FaCog,
  FaBell,
  FaSignOutAlt,
  FaSync,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaIdCard
} from "react-icons/fa";

const PanelProfesor = () => {
  const [profesor, setProfesor] = useState({});
  const [usuario, setUsuario] = useState(null);
  const [funcionSeleccionada, setFuncionSeleccionada] = useState("estudiantes");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    visible: false,
    tipo: "info",
    titulo: "",
    mensaje: "",
    onConfirm: null,
  });

  // Mostrar modal
  const mostrarModal = (tipo, titulo, mensaje, onConfirm = null) => {
    setModal({
      visible: true,
      tipo,
      titulo,
      mensaje,
      onConfirm,
    });
  };

  const cerrarModal = () => {
    setModal({ ...modal, visible: false });
  };

  // Cargar datos del profesor
  const fetchProfesor = async () => {
    setLoading(true);
    try {
      const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
      setUsuario(usuarioLocal);

      if (usuarioLocal?.id_funcionario) {
        const res = await fetch(
          `http://localhost:3000/api/profesor/${usuarioLocal.id_funcionario}/datos`
        );
        if (!res.ok) throw new Error("Error al cargar datos del profesor");

        const data = await res.json();
        const fotoUrl = data.persona?.foto
          ? `http://localhost:3000/${data.persona.foto}`
          : getDefaultAvatar(data.persona);

        setProfesor({
          nombre: data.persona?.nombre || "",
          apellido: data.persona?.apellido || "",
          email: data.persona?.correo || "",
          id_funcionario: data.id_funcionario,
          foto_url: fotoUrl,
          telefono: data.persona?.telefono || "",
          ciudad: data.persona?.ciudad_residencia || "",
        });
      } else {
        throw new Error("No se encontró información del usuario");
      }
    } catch (error) {
      console.error("Error cargando datos del profesor:", error);
      mostrarModal("error", "Error", "No se pudieron cargar los datos del perfil");
    } finally {
      setLoading(false);
    }
  };

  const getDefaultAvatar = (persona) => {
    const nombre = persona?.nombre || "Profesor";
    const apellido = persona?.apellido || "";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nombre + " " + apellido
    )}&background=3498db&color=fff&size=150&bold=true`;
  };

  const handleImageError = (e) => {
    console.log("Error cargando imagen, usando avatar por defecto");
    e.target.src = getDefaultAvatar(profesor);
    e.target.onerror = null;
  };

  useEffect(() => {
    fetchProfesor();
  }, []);

  const handleFuncionChange = (funcion) => {
    setFuncionSeleccionada(funcion);
  };

  const handleCerrarSesion = () => {
    mostrarModal(
      "confirmacion",
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      confirmarCerrarSesion
    );
  };

  const confirmarCerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleRecargarDatos = () => {
    mostrarModal(
      "confirmacion",
      "Actualizar Datos",
      "¿Estás seguro de que quieres recargar los datos del perfil?",
      fetchProfesor
    );
  };

  const funciones = [
    { 
      id: "estudiantes", 
      nombre: "Mis Estudiantes", 
      descripcion: "Gestiona la lista de estudiantes asignados",
      icono: <FaUserGraduate />,
      color: "#3498db"
    },
    { 
      id: "RegistrarObservacion", 
      nombre: "Registrar Observación", 
      descripcion: "Registrar nueva observación de conducta",
      icono: <FaStickyNote />,
      color: "#e74c3c"
    },
    { 
      id: "HistorialObservaciones", 
      nombre: "Historial Observaciones", 
      descripcion: "Historial de observaciones de conducta",
      icono: <FaHistory />,
      color: "#9b59b6"
    },
    { 
      id: "BuscarEstudiantes", 
      nombre: "Buscar Estudiantes", 
      descripcion: "Buscar estudiantes mediante nombre o número de documento",
      icono: <FaSearch />,
      color: "#2ecc71"
    },
    { 
      id: "asistencias", 
      nombre: "Historial Asistencias", 
      descripcion: "Consulta y edita el historial de asistencias",
      icono: <FaClipboardCheck />,
      color: "#f39c12"
    },
    { 
      id: "masiva", 
      nombre: "Asistencia Masiva", 
      descripcion: "Registra asistencia para todo un grado",
      icono: <FaUsers />,
      color: "#1abc9c"
    },
    { 
      id: "observaciones", 
      nombre: "Observaciones", 
      descripcion: "Registra observaciones de conducta",
      icono: <FaClipboardList />,
      color: "#d35400"
    },
    { 
      id: "citas", 
      nombre: "Agendar Citas", 
      descripcion: "Agenda citas con los acudientes de tus estudiantes",
      icono: <FaCalendarAlt />,
      color: "#8e44ad"
    },
    { 
      id: "configuracion", 
      nombre: "Configuración", 
      descripcion: "Configura tu cuenta y preferencias",
      icono: <FaCog />,
      color: "#7f8c8d"
    },
    { 
      id: "notificaciones", 
      nombre: "Notificaciones", 
      descripcion: "Envía mensajes a los acudientes de un grado",
      icono: <FaBell />,
      color: "#e67e22"
    },
  ];

  if (loading) {
    return (
      <div className="panel-loading">
        <div className="loading-spinner"></div>
        <p>Cargando panel del profesor...</p>
      </div>
    );
  }

  return (
    <div className="d-flex panel-profesor">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          {/* Header del perfil */}
          <div className="perfil-header">
            <div className="foto-container">
              <img
                src={profesor.foto_url}
                alt="Foto del profesor"
                className="foto-profesor"
                onError={handleImageError}
              />
              <button 
                className="btn-recargar" 
                onClick={handleRecargarDatos} 
                title="Actualizar datos"
              >
                <FaSync />
              </button>
            </div>

            <div className="perfil-info">
              <h3 className="nombre-profesor">
                {profesor.nombre} {profesor.apellido}
              </h3>
              <p className="email-profesor">
                <FaEnvelope className="me-2" />
                {profesor.email}
              </p>
              <p className="id-profesor">
                <FaIdCard className="me-2" />
                ID: {profesor.id_funcionario}
              </p>
              {profesor.telefono && (
                <p className="telefono-profesor">
                  <FaPhone className="me-2" />
                  {profesor.telefono}
                </p>
              )}
              {profesor.ciudad && (
                <p className="ciudad-profesor">
                  <FaMapMarkerAlt className="me-2" />
                  {profesor.ciudad}
                </p>
              )}
            </div>
          </div>

          <hr className="divider" />

          {/* Navegación */}
          <nav className="navegacion">
            <h4 className="nav-titulo">Navegación</h4>
            <ul className="nav-lista">
              {funciones.map((funcion) => (
                <li key={funcion.id} className="nav-item">
                  <button
                    className={`nav-btn ${funcionSeleccionada === funcion.id ? "active" : ""}`}
                    onClick={() => handleFuncionChange(funcion.id)}
                    title={funcion.descripcion}
                    style={{ 
                      '--color-activo': funcion.color,
                      borderLeftColor: funcionSeleccionada === funcion.id ? funcion.color : 'transparent'
                    }}
                  >
                    <span className="nav-icono" style={{ color: funcion.color }}>
                      {funcion.icono}
                    </span>
                    <span className="nav-texto">
                      <div className="nav-nombre">{funcion.nombre}</div>
                      <div className="nav-descripcion">{funcion.descripcion}</div>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer del sidebar */}
          <div className="sidebar-footer">
            <button className="btn-cerrar-sesion" onClick={handleCerrarSesion}>
              <FaSignOutAlt className="me-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="contenido-principal">
        <header className="content-header">
          <div className="header-content">
            <div className="header-titulo">
              <span className="header-icono" style={{ 
                color: funciones.find(f => f.id === funcionSeleccionada)?.color 
              }}>
                {funciones.find(f => f.id === funcionSeleccionada)?.icono}
              </span>
              <div>
                <h1 className="content-titulo">
                  {funciones.find((f) => f.id === funcionSeleccionada)?.nombre || "Panel del Profesor"}
                </h1>
                <p className="content-descripcion">
                  {funciones.find((f) => f.id === funcionSeleccionada)?.descripcion ||
                    "Sistema de gestión académica"}
                </p>
              </div>
            </div>
            <div className="header-info">
              <span className="bienvenido-texto">
                Bienvenido/a, <strong>{profesor.nombre}</strong>
              </span>
            </div>
          </div>
        </header>

        <main className="content-main">
          {/* Renderizado condicional de componentes */}
          {profesor.id_funcionario && funcionSeleccionada === "RegistrarObservacion" && (
            <RegistrarObservacion idProfesor={profesor.id_funcionario} />
          )}

          {profesor.id_funcionario && funcionSeleccionada === "HistorialObservaciones" && (
            <HistorialObservaciones idProfesor={profesor.id_funcionario} />
          )}

          {profesor.id_funcionario && funcionSeleccionada === "BuscarEstudiantes" && (
            <BuscarEstudiantes idProfesor={profesor.id_funcionario} />
          )}

          {profesor.id_funcionario && funcionSeleccionada === "estudiantes" && (
            <ListaEstudiantes idProfesor={profesor.id_funcionario} />
          )}

          {profesor.id_funcionario && funcionSeleccionada === "asistencias" && (
            <HistorialAsistenciasProfesor idProfesor={profesor.id_funcionario} />
          )}

          {profesor.id_funcionario && funcionSeleccionada === "masiva" && (
            <RegistrarAsistenciaMasiva idProfesor={profesor.id_funcionario} />
          )}

          {profesor.id_funcionario && funcionSeleccionada === "observaciones" && (
            <ObservacionPage idProfesor={profesor.id_funcionario} />
          )}

          {profesor.id_funcionario && funcionSeleccionada === "citas" && (
            <AgendarCitaAcu idProfesor={profesor.id_funcionario} />
          )}

          {usuario && funcionSeleccionada === "configuracion" && (
            <ConfiguracionUsuario id_usuario={usuario.id_usuario} />
          )}

          {profesor.id_funcionario && funcionSeleccionada === "notificaciones" && (
            <NotificacionesPorGrado idProfesor={profesor.id_funcionario} />
          )}
        </main>

        <footer className="content-footer">
          <p>
            &copy; 2025 Sistema Académico. 
            <span className="usuario-activo"> Usuario: {profesor.nombre} {profesor.apellido}</span>
          </p>
        </footer>
      </div>

      <ModalMensaje
        visible={modal.visible}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensaje={modal.mensaje}
        onClose={cerrarModal}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default PanelProfesor;