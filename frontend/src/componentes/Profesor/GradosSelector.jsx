import React from "react";

const GradosSelector = ({ grados, gradoSeleccionado, setGradoSeleccionado }) => {
  return (
    <div>
      <label>Selecciona un grado: </label>
      <select
        value={gradoSeleccionado || ""}
        onChange={(e) => setGradoSeleccionado(e.target.value)}
      >
        <option value="">-- Grados --</option>
        {grados.map((g) => (
          <option key={g.id_grado} value={g.id_grado}>
            {g.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GradosSelector;
