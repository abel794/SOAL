import React, { useState, useEffect } from "react";
import ListaEstudiantes from "./ListaEstudiantes";
import HistorialAsistencias from "./HistorialAsistencia";
import RegistrarAsistenciaMasiva from "./RegistrarAsistenciaMasiva";
import ObservacionPage from "./ObservacionPage";
import "./PanelProfesor.css";

const PanelProfesor = () => {
  const [profesor, setProfesor] = useState({});
  const [funcionSeleccionada, setFuncionSeleccionada] = useState("estudiantes");

  useEffect(() => {
    const fetchProfesor = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario?.id_funcionario) {
          const res = await fetch(
            `http://localhost:5000/api/profesor/${usuario.id_funcionario}/datos`
          );
          const data = await res.json();

          setProfesor({
            nombre: data.persona?.nombre || "",
            apellido: data.persona?.apellido || "",
            email: data.persona?.correo || "",
            id_funcionario: data.id_funcionario,
          });
        }
      } catch (error) {
        console.error("Error cargando datos del profesor:", error);
      }
    };
    fetchProfesor();
  }, []);

  return (
    <div className="d-flex panel-profesor">
      {/* Sidebar */}
      <div className="sidebar p-3">
        <h3 className="text-center">👨‍🏫 Profesor</h3>
        <div className="profesor-info mb-3">
          <p><strong>Nombre:</strong> {profesor.nombre} {profesor.apellido}</p>
          <p><strong>Correo:</strong> {profesor.email}</p>
          <p><strong>ID:</strong> {profesor.id_funcionario}</p>
        </div>

        <hr />
        <div className="d-grid gap-2">
          <button
            className={`btn btn-outline-primary ${funcionSeleccionada === "estudiantes" ? "active" : ""}`}
            onClick={() => setFuncionSeleccionada("estudiantes")}
          >
            👨‍🎓 Mis Estudiantes
          </button>
          <button
            className={`btn btn-outline-primary ${funcionSeleccionada === "asistencias" ? "active" : ""}`}
            onClick={() => setFuncionSeleccionada("asistencias")}
          >
            📊 Mis Asistencias
          </button>
          <button
            className={`btn btn-outline-primary ${funcionSeleccionada === "masiva" ? "active" : ""}`}
            onClick={() => setFuncionSeleccionada("masiva")}
          >
            📋 Asistencia Masiva
          </button>
          <button
            className={`btn btn-outline-primary ${funcionSeleccionada === "observaciones" ? "active" : ""}`}
            onClick={() => setFuncionSeleccionada("observaciones")}
          >
            📝 Observaciones
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-grow-1 p-4 contenido">
        {profesor.id_funcionario && funcionSeleccionada === "estudiantes" && (
          <ListaEstudiantes idProfesor={profesor.id_funcionario} />
        )}
        {profesor.id_funcionario && funcionSeleccionada === "asistencias" && (
          <HistorialAsistencias idProfesor={profesor.id_funcionario} />
        )}
        {profesor.id_funcionario && funcionSeleccionada === "masiva" && (
          <RegistrarAsistenciaMasiva idProfesor={profesor.id_funcionario} />
        )}
        {profesor.id_funcionario && funcionSeleccionada === "observaciones" && (
          <ObservacionPage idProfesor={profesor.id_funcionario} />
        )}
      </div>
    </div>
  );
};

export default PanelProfesor;
