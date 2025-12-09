// src/componentes/dashboardEstudiante/DashboardEstudiante.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import './DashboardEstudiante.css';

const DashboardEstudiante = ({ userData }) => {
  const [estudiante, setEstudiante] = useState({ 
    nombre: "", 
    email: "", 
    carrera: "", 
    semestre: "", 
    promedio: "" 
  });
  const [cursos, setCursos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utilidad para normalizar el token
  const normalizeStored = (v) => {
    if (v === null || v === undefined) return null;
    if (typeof v !== "string") return v;
    const t = v.trim();
    if (t === "" || ["undefined", "null"].includes(t.toLowerCase())) return null;
    return t;
  };

  // Obtener datos del estudiante
  useEffect(() => {
    const fetchDatosEstudiante = async () => {
      try {
        setLoading(true);
        const token = normalizeStored(localStorage.getItem("token"));
        const documento = localStorage.getItem("documento");
        
        if (!token || !documento) {
          throw new Error("No hay token o documento de autenticación");
        }

        const headers = { Authorization: `Bearer ${token}` };

        // ✅ USAR LA MISMA API QUE CONFIGURACION: /api/coordinador/persona/{documento}
        const [personaRes, cursosRes, tareasRes] = await Promise.all([
          // API principal para datos de la persona (LA MISMA QUE CONFIGURACIÓN)
          axios.get(`http://localhost:3000/api/coordinador/persona/${documento}`, { headers }).catch(() => null),
          // API para cursos del estudiante
          axios.get("http://localhost:3000/api/estudiantes/cursos", { headers }).catch(() => null),
          // API para tareas del estudiante
          axios.get("http://localhost:3000/api/estudiantes/tareas", { headers }).catch(() => null)
        ]);

        // ✅ CORREGIDO: Usar los mismos datos que el componente de Configuración
        let datosEstudiante = {};

        // Prioridad 1: Datos de la API de persona (misma que configuración)
        if (personaRes?.data) {
          const data = personaRes.data;
          datosEstudiante = {
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            email: data.correo || "",
          };
        }

        setEstudiante(datosEstudiante);

        // Procesar cursos
        if (cursosRes?.data) {
          setCursos(Array.isArray(cursosRes.data) ? cursosRes.data : []);
        } else {
          // Datos de ejemplo si la API no responde
          setCursos([
            { id: 1, nombre: "No hizo la tarea", profesor: "Dr. Rodríguez", horario: "Lunes 8:00-10:00" },
            { id: 2, nombre: "llego tarde al salon de clases", profesor: "Dra. Martínez", horario: "Martes 10:00-12:00" },
            { id: 3, nombre: "peleo con un compañero dentro de la institucion ", profesor: "Dr. López", horario: "Miércoles 14:00-16:00" }
          ]);
        }

        // Procesar tareas
        if (tareasRes?.data) {
          setTareas(Array.isArray(tareasRes.data) ? tareasRes.data : []);
        } else {
          // Datos de ejemplo si la API no responde
          setTareas([
            { id: 1, curso: "Programación Avanzada", titulo: "Proyecto Final", fechaEntrega: "2024-12-15", estado: "Pendiente" },
            { id: 2, curso: "Bases de Datos", titulo: "Consulta SQL", fechaEntrega: "2024-12-10", estado: "Entregado" },
            { id: 3, curso: "Inteligencia Artificial", titulo: "Algoritmo KNN", fechaEntrega: "2024-12-12", estado: "En progreso" }
          ]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error cargando datos del estudiante:", err);
        setError("Error al cargar los datos del estudiante");
        setLoading(false);
        
        // Datos de ejemplo en caso de error
        setEstudiante({
          nombre: userData?.nombre || "Estudiante",
          // ✅ CORREO CORRECTO: usar userData.email
          email: userData?.email || "estudiante@universidad.edu",
          carrera: "Ingeniería de Sistemas",
          semestre: 5,
          promedio: 4.2
        });
        setCursos([
          { id: 1, nombre: "Programación Avanzada", profesor: "Dr. Rodríguez", horario: "Lunes 8:00-10:00" },
          { id: 2, nombre: "Bases de Datos", profesor: "Dra. Martínez", horario: "Martes 10:00-12:00" },
          { id: 3, nombre: "Inteligencia Artificial", profesor: "Dr. López", horario: "Miércoles 14:00-16:00" }
        ]);
        setTareas([
          { id: 1, curso: "Programación Avanzada", titulo: "Proyecto Final", fechaEntrega: "2024-12-15", estado: "Pendiente" },
          { id: 2, curso: "Bases de Datos", titulo: "Consulta SQL", fechaEntrega: "2024-12-10", estado: "Entregado" },
          { id: 3, curso: "Inteligencia Artificial", titulo: "Algoritmo KNN", fechaEntrega: "2024-12-12", estado: "En progreso" }
        ]);
      }
    };

    fetchDatosEstudiante();
  }, [userData]);

  if (loading) {
    return (
      <div className="dashboard-estudiante">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando información del estudiante...</p>
        </div>
      </div>
    );
  }

  if (error && !estudiante.nombre) {
    return (
      <div className="dashboard-estudiante">
        <div className="error-container">
          <div className="alert alert-danger">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-estudiante">
      {/* Header del Dashboard */}
      <header className="dashboard-header">
    <h1>Dashboard del Estudiante</h1>

        <div className="estudiante-info">
            <h2 className="texto-blanco">Bienvenido, {estudiante.nombre || "Estudiante"}</h2>
            <p><strong>Nombre:</strong> <span className="texto-blanco">{estudiante.nombre}</span></p>
            <p><strong>Apellido:</strong> <span className="texto-blanco">{estudiante.apellido}</span></p>
            <p><strong>Email institucional:</strong> <span className="texto-blanco">{estudiante.email}</span></p>
        </div>
    </header>


      {/* Resto del componente */}
      <div className="resumen-rapido">
        <div className="tarjeta-resumen">
          <h3>Observaciones</h3>
          <p className="numero">{cursos.length}</p>
        </div>
        <div className="tarjeta-resumen">
          <h3>Notificaciones</h3>
          <p className="numero">
            {tareas.filter(t => t.estado === "Pendiente").length}
          </p>
        </div>
      </div>

      {/* Sección de Cursos */}
      <section className="seccion-cursos">
        <h2>Mis Observaciones</h2>
        <div className="lista-cursos">
          {cursos.map(curso => (
            <div key={curso.id} className="tarjeta-curso">
              <h3>{curso.nombre}</h3>
              <p><strong>Profesor:</strong> {curso.profesor}</p>
              <p><strong>Dia:</strong> {curso.horario}</p>
              <button className="btn-ver-curso">Ver Observacion</button>
            </div>
          ))}
        </div>
      </section>


      
      {/** 
      {/* Sección de Tareas Pendientes 
      <section className="seccion-tareas">
        <h2>Tareas y Entregas</h2>
        <div className="lista-tareas">
          {tareas.map(tarea => (
            <div key={tarea.id} className={`tarjeta-tarea ${tarea.estado.toLowerCase().replace(' ', '-')}`}>
              <h3>{tarea.titulo}</h3>
              <p><strong>Curso:</strong> {tarea.curso}</p>
              <p><strong>Fecha de entrega:</strong> {tarea.fechaEntrega}</p>
              <span className={`estado ${tarea.estado.toLowerCase().replace(' ', '-')}`}>
                {tarea.estado}
              </span>
            </div>
          ))}
        </div>
      </section>
      */}
    </div>
  );
};

export default DashboardEstudiante;