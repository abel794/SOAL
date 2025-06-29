// src/componentes/FormularioPermisos.jsx
import React from "react";
import RolPermisoFila from "./RolPermisoFila";

const roles = [
  { nombre: "Estudiante" },
  { nombre: "Docente" },
  { nombre: "Acudiente" },
  { nombre: "Administrador" },
];

const FormularioPermisos = () => {
  return (
    <div className="formulario-permisos">
      <h3 className="titulo-permisos">Permisos <span className="text-sm text-gray-500">Seleccione los permisos:</span></h3>
      
      <div className="grid grid-cols-4 font-semibold bg-gray-100 p-2 rounded mb-2">
        <span>ROL</span>
        <span>ACCESOS</span>
        <span>Laptop</span>
        <span>Mobile</span>
      </div>

      {roles.map((rol, i) => (
        <RolPermisoFila key={i} rol={rol.nombre} />
      ))}
    </div>
  );
};

export default FormularioPermisos;
