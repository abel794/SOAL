// frontend/src/Profesor/PanelProfesor.jsx
import React, { useState, useEffect } from "react";
import ListaEstudiantes from "./ListaEstudiantes";
import AsistenciasPage from "./AsistenciasPage";

const PanelProfesor = () => {
  const [profesor, setProfesor] = useState({});
  const [funcionSeleccionada, setFuncionSeleccionada] = useState("estudiantes");

  useEffect(() => {
    const fetchProfesor = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario?.id_funcionario) {
          const res = await fetch(`http://localhost:5000/api/profesor/${usuario.id_funcionario}/datos`);
          const data = await res.json();

          setProfesor({
            nombre: data.persona?.nombre || '',
            apellido: data.persona?.apellido || '',
            email: data.persona?.correo || '',
            foto: data.persona?.foto || null,
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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", padding: "20px", backgroundColor: "#f0f0f0", textAlign: "center" }}>
        <h2>👨‍🏫 Profesor</h2>

        {profesor.foto ? (
          <img
            src={profesor.foto}
            alt="Foto del profesor"
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
          />
        ) : (
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#ccc',
            display: 'inline-block',
            marginBottom: '10px',
          }}>👤</div>
        )}

        <p><strong>Nombre:</strong> {profesor.nombre} {profesor.apellido}</p>
        <p><strong>Correo:</strong> {profesor.email}</p>
        <p><strong>ID:</strong> {profesor.id_funcionario}</p>

        <hr />
        <button
          onClick={() => setFuncionSeleccionada("estudiantes")}
          style={{ display: "block", margin: "10px auto", padding: "5px 10px" }}
        >
          Mis Estudiantes
        </button>

        <button
          onClick={() => setFuncionSeleccionada("asistencias")}
          style={{ display: "block", margin: "10px auto", padding: "5px 10px" }}
        >
          Mis Asistencias
        </button>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, padding: "20px" }}>
        {profesor.id_funcionario && funcionSeleccionada === "estudiantes" && (
          <ListaEstudiantes idProfesor={profesor.id_funcionario} />
        )}

        {profesor.id_funcionario && funcionSeleccionada === "asistencias" && (
          <AsistenciasPage idProfesor={profesor.id_funcionario} />
        )}
      </div>
    </div>
  );
};

export default PanelProfesor;
