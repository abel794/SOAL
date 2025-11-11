import React, { useState } from "react";
import GradosSelector from "./GradosSelector";
import EstudiantesGrado from "./EstudiantesGrado";
import ObservacionForm from "./ObservacionForm";
import "./Observaciones.css";
import "./ObservacionPage.css"

const ObservacionesPage = ({ idProfesor }) => {
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [grados] = useState([
    { id_grado: 1, nombre: "Grado 10A" },
    { id_grado: 2, nombre: "Grado 10B" },
  ]);

  return (
    <>
      {!gradoSeleccionado ? (
        <GradosSelector
          grados={grados}
          gradoSeleccionado={gradoSeleccionado}
          setGradoSeleccionado={setGradoSeleccionado}
        />
      ) : !estudianteSeleccionado ? (
        <EstudiantesGrado
          grado={gradoSeleccionado}
          setEstudianteSeleccionado={setEstudianteSeleccionado}
        />
      ) : (
        <ObservacionForm estudiante={estudianteSeleccionado} idProfesor={idProfesor} />
      )}
    </>
  );
};

export default ObservacionesPage;
