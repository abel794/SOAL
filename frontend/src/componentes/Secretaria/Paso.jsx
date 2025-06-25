import React from "react";
import "./Paso.css";

const Paso = ({ pasoActual }) => {
  const pasos = [
    { numero: 1, texto: "Crear Usuario" },
    { numero: 2, texto: "Cuenta" },
    { numero: 3, texto: "Permisos" }
  ];

  return (
    <div className="contenedor-pasos">
      {pasos.map((paso, index) => (
        <div
          key={index}
          className={`paso ${pasoActual === paso.numero ? "activo" : ""}`}
        >
          <div className="numero">{paso.numero}</div>
          <div className="texto">{paso.texto}</div>
        </div>
      ))}
    </div>
  );
};

export default Paso;
