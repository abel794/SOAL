// src/componentes/Profesor/AsistenciaForm.jsx
import React, { useState } from "react";

const AsistenciaForm = ({ idProfesor, onNuevoRegistro }) => {
  const [idEstudiante, setIdEstudiante] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [observacion, setObservacion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/profesor/asistencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_estudiante: idEstudiante,
          id_funcionario: idProfesor,
          fecha: new Date().toISOString().split("T")[0], // hoy
          id_estado_asistencia: idEstado,
          observacion,
        }),
      });

      const data = await res.json();
      console.log(data);

      setIdEstudiante("");
      setIdEstado("");
      setObservacion("");

      if (onNuevoRegistro) onNuevoRegistro();
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="number"
        placeholder="ID Estudiante"
        value={idEstudiante}
        onChange={(e) => setIdEstudiante(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="ID Estado"
        value={idEstado}
        onChange={(e) => setIdEstado(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Observación"
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
      />
      <button type="submit">Registrar Asistencia</button>
    </form>
  );
};

export default AsistenciaForm;
