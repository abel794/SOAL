// src/componentes/profesor/RegistroProfesorMultistep.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RegistroProfesor.css';

export default function RegistroProfesorMultistep() {
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  const [formData, setFormData] = useState({
    numero_documento: '', nombre: '', apellido: '', correo: '', telefono: '',
    direccion: '', ciudad_residencia: '', tipo_sangre: '', discapacidad: 'No',
    ocupacion: '', fecha_nacimiento: '', foto: null, id_sexo: '', id_tipo_documento: ''
  });

  const [archivos, setArchivos] = useState({});

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    setFormData(prev => ({ ...prev, foto: e.target.files[0] }));
  };

  const handleArchivos = (e) => {
    setArchivos(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const avanzar = () => step < 3 && setStep(step + 1);
  const retroceder = () => step > 1 && setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    Object.entries(archivos).forEach(([key, value]) => {
      data.append(`archivo_${key}`, value);
    });

    try {
      const res = await fetch('/api/profesor/registro', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (res.ok) {
        setUsuarioGenerado(json);
        setMensaje('Registro exitoso');
      } else {
        setMensaje(json.error || 'Error al registrar');
      }
    } catch (err) {
      setMensaje('Error de red');
    }
  };

  return (
    <div className="profesor-formulario">
      <h2>Registro de Profesor</h2>
      <div className="pasos">
        {[1, 2, 3].map(n => (
          <div key={n} className={`paso ${step === n ? 'activo' : ''}`}>{n}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="datos" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Datos Personales</h3>
              {[
                ['numero_documento', 'Nro Documento'],
                ['nombre', 'Nombre'],
                ['apellido', 'Apellido'],
                ['correo', 'Correo'],
                ['telefono', 'Teléfono'],
                ['direccion', 'Dirección'],
                ['ciudad_residencia', 'Ciudad'],
                ['tipo_sangre', 'Tipo Sangre'],
                ['discapacidad', 'Discapacidad'],
                ['ocupacion', 'Ocupación'],
                ['fecha_nacimiento', 'Nacimiento']
              ].map(([name, label]) => (
                <input key={name} name={name} placeholder={label} value={formData[name]} onChange={handleInput} type={name === 'fecha_nacimiento' ? 'date' : 'text'} required />
              ))}
              <select name="id_sexo" value={formData.id_sexo} onChange={handleInput} required>
                <option value="">Sexo</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
              </select>
              <select name="id_tipo_documento" value={formData.id_tipo_documento} onChange={handleInput} required>
                <option value="">Tipo Documento</option>
                <option value="1">CC</option>
                <option value="2">TI</option>
              </select>
              <label>Foto:</label>
              <input type="file" onChange={handleFile} required />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="archivos" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Documentos del Profesor (PDF)</h3>
              {['certificado_eps', 'certificado_arl', 'acta_grado', 'rut', 'hoja_vida'].map(name => (
                <div key={name}>
                  <label>{name.replaceAll('_', ' ').toUpperCase()}:</label>
                  <input type="file" name={name} onChange={handleArchivos} required />
                </div>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="confirmar" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Datos del Usuario Generado</h3>
              {usuarioGenerado ? (
                <>
                  <p><strong>Usuario:</strong> {usuarioGenerado.usuario}</p>
                  <p><strong>Contraseña:</strong> {usuarioGenerado.contrasena}</p>
                </>
              ) : (
                <button type="submit">Registrar Profesor</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="botones">
        {step > 1 && <button onClick={retroceder}>Anterior</button>}
        {step < 3 && <button onClick={avanzar}>Siguiente</button>}
      </div>

      {mensaje && <div className="mensaje"><p>{mensaje}</p></div>}
    </div>
  );
}