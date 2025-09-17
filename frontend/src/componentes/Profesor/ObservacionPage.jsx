import React, { useState, useEffect } from "react";
import GradosSelector from "./GradosSelector";
import EstudiantesGrado from "./EstudiantesGrado";
import ObservacionForm from "./ObservacionForm";
import "./ObservacionPage.css";

const ObservacionesPage = ({ idProfesor }) => {
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profesor/${idProfesor}/grados`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) setGrados(data.data);
      } catch (err) {
        console.error("Error al cargar grados:", err);
      }
    };

    if (idProfesor) fetchGrados();
  }, [idProfesor]);

  return (
    <div className="observaciones-page p-4">
      <h2 className="mb-4">📝 Registro de Observaciones</h2>

      <GradosSelector
        grados={grados}
        gradoSeleccionado={gradoSeleccionado}
        setGradoSeleccionado={setGradoSeleccionado}
      />

      {gradoSeleccionado && (
        <EstudiantesGrado
          idProfesor={idProfesor}
          grado={gradoSeleccionado}
          setEstudianteSeleccionado={setEstudianteSeleccionado}
        />
      )}

      {estudianteSeleccionado && (
        <ObservacionForm estudiante={estudianteSeleccionado} idProfesor={idProfesor} />
      )}
    </div>
  );
};

export default ObservacionesPage;
