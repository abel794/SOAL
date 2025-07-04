// src/componentes/ConfiguracionSistema.jsx
import React, { useState } from 'react';
import './ConfiguracionSistema.css';

export default function ConfiguracionSistema() {
  const [formulario, setFormulario] = useState({
    nombreColegio: '',
    direccion: '',
    telefono: '',
    correo: '',
    logo: null,
    anioEscolar: new Date().getFullYear(),
    horaCierre: '17:00',
    activarAnio: false,
    notificacion: 'Correo',
    horarioEnvio: 'mañana',
    notificarAcudiente: true,
    maxEstudiantesPorCurso: 30,
    mensajeInstitucional: ''
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setFormulario({ ...formulario, logo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje('✅ Cambios guardados con éxito');
    // Aquí podrías hacer un fetch al backend para guardar los datos
  };

  return (
    <div className="config-container">
      <h2>Configuración del sistema</h2>
      <form onSubmit={handleSubmit} className="config-form">
        <label>Nombre del colegio
          <input name="nombreColegio" value={formulario.nombreColegio} onChange={handleChange} required />
        </label>

        <label>Dirección
          <input name="direccion" value={formulario.direccion} onChange={handleChange} required />
        </label>

        <label>Teléfono
          <input name="telefono" value={formulario.telefono} onChange={handleChange} required />
        </label>

        <label>Correo electrónico
          <input type="email" name="correo" value={formulario.correo} onChange={handleChange} required />
        </label>

        <label>Subir logo
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <label>Año escolar actual
          <input name="anioEscolar" type="number" min="2020" value={formulario.anioEscolar} onChange={handleChange} required />
        </label>

        <label>Hora de cierre del sistema
          <input name="horaCierre" type="time" value={formulario.horaCierre} onChange={handleChange} required />
        </label>

        <label>
          <input type="checkbox" name="activarAnio" checked={formulario.activarAnio} onChange={handleChange} />
          Activar año escolar actual
        </label>

        <label>Medio de notificación
          <select name="notificacion" value={formulario.notificacion} onChange={handleChange}>
            <option>Correo</option>
            <option>WhatsApp</option>
            <option>Ambos</option>
          </select>
        </label>

        <label>Horario de envío de notificaciones
          <select name="horarioEnvio" value={formulario.horarioEnvio} onChange={handleChange}>
            <option>mañana</option>
            <option>tarde</option>
            <option>noche</option>
          </select>
        </label>

        <label>
          <input type="checkbox" name="notificarAcudiente" checked={formulario.notificarAcudiente} onChange={handleChange} />
          Notificar al acudiente cuando haya una observación
        </label>

        <label>Estudiantes máximo por curso
          <input type="number" name="maxEstudiantesPorCurso" value={formulario.maxEstudiantesPorCurso} onChange={handleChange} required min="5" max="50" />
        </label>

        <label>Mensaje institucional (se mostrará en el dashboard)
          <textarea name="mensajeInstitucional" rows="3" value={formulario.mensajeInstitucional} onChange={handleChange} />
        </label>

        <div className="botones">
          <button type="submit">Guardar cambios</button>
          <button type="reset">Cancelar</button>
        </div>

        {mensaje && <p className="mensaje-ok">{mensaje}</p>}
      </form>
    </div>
  );
}
