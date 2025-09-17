import React from "react";

const EstudianteCard = ({ estudiante, onSelect }) => {
  const { persona, grado } = estudiante;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "5px 0",
        cursor: "pointer",
      }}
      onClick={onSelect}
    >
      <h4>
        {persona.nombre} {persona.apellido}
      </h4>
      <p>Documento: {persona.numero_documento}</p>
      <p>Grado: {grado}</p>
    </div>
  );
};

export default EstudianteCard;
