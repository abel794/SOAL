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

  const normalizeStored = (v) => {
    if (!v) return null;
    if (typeof v !== "string") return v;
    const t = v.trim();
    if (t === "" || ["undefined", "null"].includes(t.toLowerCase())) return null;
    return t;
  };

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

        const [personaRes, cursosRes, tareasRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/coordinador/persona/${documento}`, { headers }).catch(() => null),
          axios.get(`${process.env.REACT_APP_API_URL}/api/estudiantes/cursos`, { headers }).catch(() => null),
          axios.get(`${process.env.REACT_APP_API_URL}/api/estudiantes/tareas`, { headers }).catch(() => null)
        ]);

        let datosEstudiante = {};

        if (personaRes?.data) {
          const data = personaRes.data;
          datosEstudiante = {
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            email: data.correo || "",
          };
        }

        setEstudiante(datosEstudiante);

        if (cursosRes?.data) {
          setCursos(Array.isArray(cursosRes.data) ? cursosRes.data : []);
        } else {
          setCursos([
            { id: 1, nombre: "No hizo la tarea", profesor: "Dr. Rodríguez", horario: "Lunes 8:00-10:00" },
            { id: 2, nombre: "Llegó tarde al salón", profesor: "Dra. Martínez", horario: "Martes 10:00-12:00" },
            { id: 3, nombre: "Peleó con un compañero", profesor: "Dr. López", horario: "Miércoles 14:00-16:00" }
          ]);
        }

        if (tareasRes?.data) {
          setTareas(Array.isArray(tareasRes.data) ? tareasRes.data : []);
        } else {
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

        setEstudiante({
          nombre: userData?.nombre || "Estudiante",
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

  return (
    <div className="dashboard-estudiante">
      <header className="dashboard-header">
        <h1>Dashboard del Estudiante</h1>

        <div className="estudiante-info">
            <h2 className="texto-blanco">Bienvenido, {estudiante.nombre || "Estudiante"}</h2>
            <p><strong>Nombre:</strong> <span className="texto-blanco">{estudiante.nombre}</span></p>
            <p><strong>Apellido:</strong> <span className="texto-blanco">{estudiante.apellido}</span></p>
            <p><strong>Email institucional:</strong> <span className="texto-blanco">{estudiante.email}</span></p>
        </div>
      </header>

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

      <section className="seccion-cursos">
        <h2>Mis Observaciones</h2>
        <div className="lista-cursos">
          {cursos.map(curso => (
            <div key={curso.id} className="tarjeta-curso">
              <h3>{curso.nombre}</h3>
              <p><strong>Profesor:</strong> {curso.profesor}</p>
              <p><strong>Dia:</strong> {curso.horario}</p>
              <button className="btn-ver-curso">Ver Observación</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardEstudiante;
