import React, { useState } from 'react';

const FormularioRegistro = ({ tipoUsuario, actualizarDatos }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    correo: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    tipo: tipoUsuario,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    actualizarDatos({ ...formData, [e.target.name]: e.target.value }); // Enviar datos al componente externo
  };

  return (
    <div className="contenedor-formulario">
      <h3>Registro de {tipoUsuario}</h3>
      <form className="formulario">
        <label>Nombre Completo:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

        <label>Documento:</label>
        <input type="text" name="documento" value={formData.documento} onChange={handleChange} required />

        <label>Correo Electrónico:</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />

        <label>Teléfono:</label>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />

        <label>Dirección:</label>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />

        <label>Fecha de Nacimiento:</label>
        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
      </form>
    </div>
  );
};

export default FormularioRegistro;