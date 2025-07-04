import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RegistroSecretaria.css'; // Usa el mismo estilo que el de estudiante/profesor

export default function RegistroSecretariaMultistep() {
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  const [formData, setFormData] = useState({
    secretaria: {
      numero_documento: '',
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      direccion: '',
      ciudad_residencia: '',
      tipo_sangre: '',
      discapacidad: '',
      ocupacion: '',
      fecha_nacimiento: '',
      id_sexo: '',
      id_tipo_documento: ''
    },
    archivos: {
      foto: null,
      documento: null,
      tituloBachiller: null,
      tituloUniversitario: null
    }
  });

  const handleChange = (e, campo) => {
    setFormData({
      ...formData,
      secretaria: {
        ...formData.secretaria,
        [campo]: e.target.value
      }
    });
  };

  const handleFileChange = (e, campo) => {
    setFormData({
      ...formData,
      archivos: {
        ...formData.archivos,
        [campo]: e.target.files[0]
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Archivos
    data.append('foto', formData.archivos.foto);
    data.append('documento', formData.archivos.documento);
    data.append('titulo_bachiller', formData.archivos.tituloBachiller);
    data.append('titulo_universitario', formData.archivos.tituloUniversitario);

    // Datos secretaria
    data.append('formulario', JSON.stringify({
      secretaria: formData.secretaria
    }));

    try {
      const res = await fetch('/api/registro/secretaria', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (res.ok) {
        setUsuarioGenerado(json);
        setMensaje('✅ Registro exitoso');
      } else {
        setMensaje(json.error || '❌ Error al registrar');
      }
    } catch (err) {
      setMensaje('❌ Error de red');
    }
  };

  const avanzar = () => step < 3 && setStep(step + 1);
  const retroceder = () => step > 1 && setStep(step - 1);

  const camposPersona = [
    { nombre: 'numero_documento', label: 'Nro Documento' },
    { nombre: 'nombre', label: 'Nombre' },
    { nombre: 'apellido', label: 'Apellido' },
    { nombre: 'correo', label: 'Correo' },
    { nombre: 'telefono', label: 'Teléfono' },
    { nombre: 'direccion', label: 'Dirección' },
    { nombre: 'ciudad_residencia', label: 'Ciudad' },
    { nombre: 'tipo_sangre', label: 'Tipo de Sangre' },
    { nombre: 'discapacidad', label: 'Discapacidad' },
    { nombre: 'ocupacion', label: 'Ocupación' },
    { nombre: 'fecha_nacimiento', label: 'Fecha Nacimiento', tipo: 'date' },
    { nombre: 'id_sexo', label: 'ID Sexo', tipo: 'number' },
    { nombre: 'id_tipo_documento', label: 'ID Tipo Documento', tipo: 'number' }
  ];

  return (
    <div className="profesor-formulario">
      <h2>Registro de Secretaria</h2>
      <div className="pasos-profesor">
        {[1, 2, 3].map(n => (
          <div key={n} className={`paso ${step === n ? 'activo' : ''}`}>{n}</div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="datos" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h4>Información Personal</h4>
              {camposPersona.map(campo => (
                <input
                  key={campo.nombre}
                  type={campo.tipo || 'text'}
                  placeholder={campo.label}
                  value={formData.secretaria[campo.nombre]}
                  onChange={(e) => handleChange(e, campo.nombre)}
                  required
                />
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="archivos" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h4>Subir Archivos</h4>
              <div className="archivos-grid">
                <div className="archivo-input">
                  <label>📸 Foto de perfil:</label>
                  <input type="file" required onChange={(e) => handleFileChange(e, 'foto')} />
                </div>
                <div className="archivo-input">
                  <label>🆔 Documento de identidad (PDF):</label>
                  <input type="file" required onChange={(e) => handleFileChange(e, 'documento')} />
                </div>
                <div className="archivo-input">
                  <label>🎓 Título de bachiller:</label>
                  <input type="file" required onChange={(e) => handleFileChange(e, 'tituloBachiller')} />
                </div>
                <div className="archivo-input">
                  <label>🎓 Título universitario o técnico:</label>
                  <input type="file" required onChange={(e) => handleFileChange(e, 'tituloUniversitario')} />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="final" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h4>Resumen y Usuario Generado</h4>
              {mensaje && <div className="mensaje-final">{mensaje}</div>}
              {usuarioGenerado && (
                <div className="mensaje-final">
                  <p><strong>Usuario:</strong> {usuarioGenerado.usuario}</p>
                  <p><strong>Contraseña temporal:</strong> {usuarioGenerado.contrasena}</p>
                </div>
              )}
              <p>Verifique que toda la información esté correcta antes de finalizar.</p>
              <button type="submit">Finalizar Registro</button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="botones-profesor">
        {step > 1 && <button type="button" onClick={retroceder}>Anterior</button>}
        {step < 3 && <button type="button" onClick={avanzar}>Siguiente</button>}
      </div>
    </div>
  );
}
