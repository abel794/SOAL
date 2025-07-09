import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RegistroMultistep.css';

export default function RegistroMultistep() {
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  const [catalogos, setCatalogos] = useState({
    sexos: [],
    tiposDocumento: [],
    eps: [],
    estadosAcademicos: []
  });

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

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [sexos, tiposDocumento, eps, estados] = await Promise.all([
          fetch('http://localhost:3000/api/sexos').then(res => res.json()),
          fetch('http://localhost:3000/api/tipo-documento').then(res => res.json()),
          fetch('http://localhost:3000/api/eps').then(res => res.json()),
          fetch('http://localhost:3000/api/estadoAcademico').then(res => res.json())
        ]);
        setCatalogos({
          sexos,
          tiposDocumento,
          eps,
          estadosAcademicos: estados
        });
      } catch (err) {
        console.error('❌ Error al cargar catálogos:', err);
      }
    };
    fetchCatalogos();
  }, []);

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

    if (!formData.archivos.fotoEstudiante || !formData.archivos.documentoEstudiante) {
      setMensaje('❌ Debes subir ambos archivos (foto y documento)');
      return;
    }

    const data = new FormData();
    data.append('foto', formData.archivos.fotoEstudiante, 'foto.jpg');
    data.append('documento', formData.archivos.documentoEstudiante, 'documento.pdf');
    data.append('formulario', JSON.stringify({
      estudiante: formData.estudiante,
      acudiente: formData.acudiente
    }));

    try {
      const res = await fetch('http://localhost:3000/api/registro-estudiante', {
        method: 'POST',
        body: data
      });

      const json = await res.json();

      if (res.ok) {
        setUsuarioGenerado(json);
        setMensaje('✅ Registro exitoso');
        setStep(1);
        // Opcional: reset form
      } else {
        setMensaje(json.mensaje || '❌ Error al registrar');
      }
    } catch (err) {
      console.error('❌ Error de red:', err);
      setMensaje('❌ Error de red al enviar el formulario');
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
    { nombre: 'fecha_nacimiento', label: 'Nacimiento', tipo: 'date' }
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
              <select required value={formData.estudiante.sexo} onChange={e => handleChange(e, 'estudiante', 'sexo')}>
                <option value="">Seleccione sexo</option>
                {catalogos.sexos.map(op => (
                  <option key={op.id_sexo} value={op.id_sexo}>{op.nombre}</option>
                ))}
              </select>
              <select required value={formData.estudiante.tipo_documento} onChange={e => handleChange(e, 'estudiante', 'tipo_documento')}>
                <option value="">Seleccione tipo de documento</option>
                {catalogos.tiposDocumento.map(op => (
                  <option key={op.id_tipo_documento} value={op.id_tipo_documento}>{op.nombre}</option>
                ))}
              </select>
              <select required value={formData.estudiante.eps} onChange={e => handleChange(e, 'estudiante', 'eps')}>
                <option value="">Seleccione EPS</option>
                {catalogos.eps.map(op => (
                  <option key={op.id_eps} value={op.id_eps}>{op.nombre}</option>
                ))}
              </select>
              <select required value={formData.estudiante.estado_academico} onChange={e => handleChange(e, 'estudiante', 'estado_academico')}>
                <option value="">Seleccione estado académico</option>
                {catalogos.estadosAcademicos.map(op => (
                  <option key={op.id_estado_academico} value={op.id_estado_academico}>{op.nombre}</option>
                ))}
              </select>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="acudiente" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Acudiente</h3>
              {camposPersona.map(campo => (
                <input key={campo.nombre} type={campo.tipo || 'text'} placeholder={campo.label} required value={formData.acudiente[campo.nombre]} onChange={e => handleChange(e, 'acudiente', campo.nombre)} />
              ))}
              <select required value={formData.acudiente.sexo} onChange={e => handleChange(e, 'acudiente', 'sexo')}>
                <option value="">Seleccione sexo</option>
                {catalogos.sexos.map(op => (
                  <option key={op.id_sexo} value={op.id_sexo}>{op.nombre}</option>
                ))}
              </select>
              <select required value={formData.acudiente.tipo_documento} onChange={e => handleChange(e, 'acudiente', 'tipo_documento')}>
                <option value="">Seleccione tipo de documento</option>
                {catalogos.tiposDocumento.map(op => (
                  <option key={op.id_tipo_documento} value={op.id_tipo_documento}>{op.nombre}</option>
                ))}
              </select>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="archivos" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Subir Archivos</h3>
              <label>Foto Estudiante:</label>
              <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, 'archivos', 'fotoEstudiante')} />
              <label>Documento Estudiante:</label>
              <input type="file" accept=".pdf,image/*" required onChange={(e) => handleFileChange(e, 'archivos', 'documentoEstudiante')} />
              <button type="submit">Finalizar Registro</button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="botones">
        {step > 1 && <button type="button" onClick={retroceder}>Anterior</button>}
        {step < 3 && <button type="button" onClick={avanzar}>Siguiente</button>}
      </div>

      {mensaje && (
        <div className="alerta-overlay">
          <div className="alerta-mensaje">
            <p>{mensaje}</p>
            {usuarioGenerado && (
              <div>
                <h4>🎉 Registro exitoso</h4>
                <p><strong>🧑‍🎓 Usuario Estudiante:</strong> {usuarioGenerado.usuario_estudiante}</p>
                <p><strong>🔑 Contraseña Estudiante:</strong> {usuarioGenerado.contrasena_estudiante}</p>
                <hr />
                <p><strong>👨‍👩‍👧 Usuario Acudiente:</strong> {usuarioGenerado.usuario_acudiente}</p>
                <p><strong>🔑 Contraseña representante:</strong> {usuarioGenerado.contrasena_acudiente}</p>
              </div>
            )}
            <button onClick={() => setMensaje('')}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
