import React, { useState, useEffect } from "react";
import EstudianteCard from "./EstudianteCard";
import "./Observaciones.css";
const EstudiantesGrado = ({ idProfesor, grado, setEstudianteSeleccionado }) => {
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/profesor/${idProfesor}/estudiantes/${grado}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const data = await res.json();
        if (data.success) setEstudiantes(data.data);
      } catch (err) {
        console.error("Error al cargar estudiantes:", err);
      }
    };

    if (grado) fetchEstudiantes();
  }, [idProfesor, grado]);

  return (
    <div>
      <h3>Estudiantes del grado</h3>
      {estudiantes.map((est) => (
        <EstudianteCard
          key={est.id_estudiante}
          estudiante={est}
          onSelect={() => setEstudianteSeleccionado(est)}
        />
      ))}
    </div>
  );
};

export default EstudiantesGrado;
