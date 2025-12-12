import React, { useState, useEffect } from "react";
import ListaEstudiantes from "./ListaEstudiantes";
import HistorialAsistenciasProfesor from "./HistorialAsistencia.jsx";
import RegistrarAsistenciaMasiva from "./RegistrarAsistenciaMasiva";
import AgendarCitaAcu from "../Profesor/Agendar_cita_con_acudiente/Agendar_cita_con_acudiente.jsx";
import ObservacionPage from "./ObservacionPage";
import ConfiguracionUsuario from "./ConfiguracionUsuario";
import ModalMensaje from "../ui/ModalMensaje.jsx";
import NotificacionesPorGrado from "./NotificacionesPorGrado"
import Justificaciones from "./justificaciones/Justificaciones.jsx"; 
import "./PanelProfesor.css";


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
          `${process.env.REACT_APP_API_URL}/api/profesor/${usuarioLocal.id_funcionario}/datos`
        );
        if (!res.ok) throw new Error("Error al cargar datos del profesor");

        const data = await res.json();
        const fotoUrl = data.persona?.foto
          ? `${process.env.REACT_APP_API_URL}/${data.persona.foto}`
          : getDefaultAvatar();

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

  const getDefaultAvatar = () => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profesor.nombre + " " + profesor.apellido
    )}&background=00bfff&color=fff&size=120`;
  };

  const handleImageError = (e) => {
    console.log("Error cargando imagen, usando avatar por defecto");
    e.target.src = getDefaultAvatar();
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
    { id: "estudiantes", nombre: "👨‍🎓 Mis Estudiantes", descripcion: "Gestiona la lista de estudiantes asignados" },
    { id: "asistencias", nombre: "📊 Historial Asistencias", descripcion: "Consulta y edita el historial de asistencias" },
    { id: "masiva", nombre: "📋 Asistencia Masiva", descripcion: "Registra asistencia para todo un grado" },
    { id: "Justificaciones", nombre:"📝 Todas Justificaciones", descripcion:" Vista para ver todas las justificaciones de tus estudiantes"},
    { id: "observaciones", nombre: "📝 Observaciones", descripcion: "Registra observaciones de conducta" },
    { id: "citas", nombre: "📅 Agendar Citas", descripcion: "Agenda citas con los acudientes de tus estudiantes" },
    { id: "configuracion", nombre: "⚙️ Configuración", descripcion: "Configura tu cuenta y preferencias" },
    { id: "notificaciones", nombre: "📢 Notificaciones por Grado", descripcion: "Envía mensajes a los acudientes de un grado" },

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
      <div className="sidebar p-4">
        <div className="perfil-header">
          <div className="foto-container">
            <img
              src={profesor.foto_url}
              alt="Foto del profesor"
              className="foto-profesor"
              onError={handleImageError}
            />
            <button className="btn-recargar" onClick={handleRecargarDatos} title="Actualizar datos">
              🔄
            </button>
          </div>

          <div className="perfil-info">
            <h3 className="nombre-profesor">
              {profesor.nombre} {profesor.apellido}
            </h3>
            <p className="email-profesor">{profesor.email}</p>
            <p className="id-profesor">ID: {profesor.id_funcionario}</p>
            {profesor.telefono && <p className="telefono-profesor">📞 {profesor.telefono}</p>}
            {profesor.ciudad && <p className="ciudad-profesor">🏙️ {profesor.ciudad}</p>}
          </div>
        </div>

        <hr className="divider" />

        <nav className="navegacion">
          <h4 className="nav-titulo">Navegación</h4>
          <ul className="nav-lista">
            {funciones.map((funcion) => (
              <li key={funcion.id} className="nav-item">
                <button
                  className={`btn btn-light ${
                    funcionSeleccionada === funcion.id ? "active" : ""
                  }`}
                  onClick={() => handleFuncionChange(funcion.id)}
                  title={funcion.descripcion}
                >
                  <span className="nav-icono">{funcion.nombre.split(" ")[0]}</span>
                  <span className="nav-texto">{funcion.nombre.split(" ").slice(1).join(" ")}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-cerrar-sesion" onClick={handleCerrarSesion}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="contenido-principal">
        <header className="content-header">
          <h1 className="content-titulo">
            {funciones.find((f) => f.id === funcionSeleccionada)?.nombre || "Panel del Profesor"}
          </h1>
          <p className="content-descripcion">
            {funciones.find((f) => f.id === funcionSeleccionada)?.descripcion ||
              "Sistema de gestión académica"}
          </p>
        </header>

        <main className="content-main">
          {profesor.id_funcionario && funcionSeleccionada === "estudiantes" && (
            <ListaEstudiantes idProfesor={profesor.id_funcionario} />
          )}
          {profesor.id_funcionario && funcionSeleccionada === "Justificaciones" && (
            <Justificaciones idProfesor={profesor.id_funcionario} />
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
          <p>&copy; 2025 Sistema Académico. Bienvenido/a, {profesor.nombre}.</p>
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
