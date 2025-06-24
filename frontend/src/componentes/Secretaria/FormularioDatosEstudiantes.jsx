import React from "react";
import "./FormularioDatosEstudiantes.css";

const FormularioDatosEstudiantes = ({ datosEstudiante, setDatosEstudiante }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosEstudiante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="campos-formulario">
      <input
        type="text"
        placeholder="Nombre completo del estudiante"
        name="nombre"
        value={datosEstudiante.nombre}
        onChange={handleChange}
      />

      <input type="date" name="fechaNacimiento" onChange={handleChange} />

      <select name="genero" onChange={handleChange}>
        <option>Masculino</option>
        <option>Femenino</option>
      </select>

      <input
        type="text"
        placeholder="Número de documento"
        name="documento"
        value={datosEstudiante.documento}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="Teléfono"
        name="telefono"
        onChange={handleChange}
      />

      <input
        type="email"
        placeholder="Email"
        name="email"
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="Dirección"
        name="direccion"
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="Localidad"
        name="localidad"
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="Barrio"
        name="barrio"
        onChange={handleChange}
      />

      <select name="grado" onChange={handleChange}>
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

      <input
        type="text"
        placeholder="Nombre completo del acudiente"
        name="acudiente"
        onChange={handleChange}
      />

      <div className="subida-foto">
        <span>Foto del estudiante</span>
        <input type="file" name="foto" onChange={handleChange} />
      </div>
    </div>
  );
};

export default FormularioDatosEstudiantes;
