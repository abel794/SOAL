import React from "react";
import "./SelectorTipoUsuario.css";

const SelectorTipoUsuario = () => {
  return (
    <div className="tipo-usuario">
      <input type="radio" id="estudiante" name="tipo" defaultChecked />
      <label htmlFor="estudiante">Estudiante</label>

      <input type="radio" id="docente" name="tipo" />
      <label htmlFor="docente">Docente</label>

    </div>
  );
};

export default SelectorTipoUsuario;
