import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RegistroMultistep.css';

export default function RegistroMultistep() {
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  const [formData, setFormData] = useState({
    estudiante: {
      nombre: '', apellido: '', numero_documento: '', correo: '', telefono: '', direccion: '', ciudad: '', tipo_sangre: '', discapacidad: '', ocupacion: '', fecha_nacimiento: '', sexo: '', tipo_documento: '', eps: '', estado_academico: ''
    },
    acudiente: {
      nombre: '', apellido: '', numero_documento: '', correo: '', telefono: '', direccion: '', ciudad: '', tipo_sangre: '', discapacidad: '', ocupacion: '', fecha_nacimiento: '', sexo: '', tipo_documento: ''
    },
    archivos: {
      fotoEstudiante: null,
      documentoEstudiante: null
    }
  });

  const handleChange = (e, tipo, campo) => {
    setFormData({
      ...formData,
      [tipo]: {
        ...formData[tipo],
        [campo]: e.target.value
      }
    });
  };

  const handleFileChange = (e, tipo, campo) => {
    setFormData({
      ...formData,
      [tipo]: {
        ...formData[tipo],
        [campo]: e.target.files[0]
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('foto', formData.archivos.fotoEstudiante);
    data.append('documento', formData.archivos.documentoEstudiante);
    data.append('formulario', JSON.stringify({
      estudiante: formData.estudiante,
      acudiente: formData.acudiente
    }));

    try {
      const res = await fetch('/api/registro/estudiante-acudiente', {
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

  const camposPersona = [
    { nombre: 'nombre', label: 'Nombre' },
    { nombre: 'apellido', label: 'Apellido' },
    { nombre: 'numero_documento', label: 'Documento' },
    { nombre: 'correo', label: 'Correo' },
    { nombre: 'telefono', label: 'Teléfono' },
    { nombre: 'direccion', label: 'Dirección' },
    { nombre: 'ciudad', label: 'Ciudad' },
    { nombre: 'tipo_sangre', label: 'Sangre' },
    { nombre: 'discapacidad', label: 'Discapacidad' },
    { nombre: 'ocupacion', label: 'Ocupación' },
    { nombre: 'fecha_nacimiento', label: 'Nacimiento', tipo: 'date' },
    { nombre: 'sexo', label: 'Sexo' },
    { nombre: 'tipo_documento', label: 'Tipo Doc' }
  ];

  const avanzar = () => step < 3 && setStep(step + 1);
  const retroceder = () => step > 1 && setStep(step - 1);

  return (
    <div className="contenedor-formulario">
      <h2>Registro Multistep</h2>
      <div className="pasos">
        {[1, 2, 3].map(n => (
          <div key={n} className={`paso ${step === n ? 'activo' : ''}`}>{n}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="estudiante" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Estudiante</h3>
              {camposPersona.map(campo => (
                <input key={campo.nombre} type={campo.tipo || 'text'} placeholder={campo.label} required value={formData.estudiante[campo.nombre]} onChange={e => handleChange(e, 'estudiante', campo.nombre)} />
              ))}
              <input type="text" placeholder="EPS" required value={formData.estudiante.eps} onChange={e => handleChange(e, 'estudiante', 'eps')} />
              <input type="text" placeholder="Estado Académico" required value={formData.estudiante.estado_academico} onChange={e => handleChange(e, 'estudiante', 'estado_academico')} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="acudiente" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Acudiente</h3>
              {camposPersona.map(campo => (
                <input key={campo.nombre} type={campo.tipo || 'text'} placeholder={campo.label} required value={formData.acudiente[campo.nombre]} onChange={e => handleChange(e, 'acudiente', campo.nombre)} />
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="archivos" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Subir Archivos</h3>
              <label>Foto Estudiante:</label>
              <input type="file" required onChange={(e) => handleFileChange(e, 'archivos', 'fotoEstudiante')} />
              <label>Documento Estudiante:</label>
              <input type="file" required onChange={(e) => handleFileChange(e, 'archivos', 'documentoEstudiante')} />
              <button type="submit">Finalizar Registro</button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="botones">
        {step > 1 && <button onClick={retroceder}>Anterior</button>}
        {step < 3 && <button onClick={avanzar}>Siguiente</button>}
      </div>

      {mensaje && (
        <div className="mensaje">
          <p>{mensaje}</p>
          {usuarioGenerado && (
            <div>
              <p><strong>Usuario Estudiante:</strong> {usuarioGenerado.usuario_estudiante}</p>
              <p><strong>Usuario Acudiente:</strong> {usuarioGenerado.usuario_acudiente}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}