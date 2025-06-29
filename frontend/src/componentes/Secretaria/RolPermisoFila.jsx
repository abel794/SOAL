// src/componentes/RolPermisoFila.jsx
import React from "react";

const RolPermisoFila = ({ rol }) => {
  return (
    <div className="grid grid-cols-4 items-center border-b py-2">
      <div className="text-gray-700">{rol}</div>
      <div>
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </div>
      <div>
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </div>
      <div>
        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
      </div>
    </div>
  );
};

export default RolPermisoFila;
