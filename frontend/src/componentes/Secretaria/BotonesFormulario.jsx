import React from "react";
import "./BotonesFormulario.css";

const BotonesFormulario = ({ pasoActual, avanzarPaso, retrocederPaso }) => {
  return (
    <div className="botones-formulario">
      {pasoActual > 1 && (
        <button className="btn-cancelar" onClick={retrocederPaso}>
          Atrás
        </button>
      )}
      <button className="btn-continuar" onClick={avanzarPaso}>
        Continuar →
      </button>
    </div>
  );
};

export default BotonesFormulario;
