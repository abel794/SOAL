import React from "react";
import "./FormularioCuentaEstudiante.css";

const FormularioCuentaEstudiante = ({ datosEstudiante, setDatosEstudiante }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosEstudiante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="cuenta-formulario">
      <div className="lado-izquierdo">
        <div className="campo">
          <label>Nombre Completo Estudiante</label>
          <input type="text" value={datosEstudiante.nombre} disabled />
        </div>

        <div className="campo">
          <label>Número Documento</label>
          <input type="text" value={datosEstudiante.documento} disabled />
        </div>

        <div className="campo">
          <label>Contraseña</label>
          <div className="input-icono">
            <input
              type="password"
              name="contrasena"
              placeholder="********"
              value={datosEstudiante.contrasena || ""}
              onChange={handleChange}
            />
            <span className="icono">🔒</span>
          </div>
        </div>

        <div className="campo">
          <label>Grado</label>
          <select
            name="grado"
            value={datosEstudiante.grado || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione un grado</option>
            <option>1°</option>
            <option>2°</option>
            <option>3°</option>
            <option>4°</option>
            <option>5°</option>
            <option>6°</option>
            <option>7°</option>
            <option>8°</option>
            <option>9°</option>
            <option>10°</option>
            <option>11°</option>
          </select>
        </div>
      </div>

      <div className="lado-derecho">
        <label>Foto del estudiante</label>
        <label className="subida-foto">
          {datosEstudiante.foto ? (
            <img
              src={URL.createObjectURL(datosEstudiante.foto)}
              alt="Preview"
            />
          ) : (
            <span>+</span>
          )}
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={(e) =>
              setDatosEstudiante((prev) => ({
                ...prev,
                foto: e.target.files[0],
              }))
            }
          />
        </label>
      </div>
    </div>
  );
};

export default FormularioCuentaEstudiante;
