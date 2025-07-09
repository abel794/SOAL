import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RegistroProfesor.css';

export default function RegistroProfesorMultistep() {
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  const [persona, setPersona] = useState({
    numero_documento: '', nombre: '', apellido: '', correo: '', telefono: '',
    direccion: '', ciudad_residencia: '', tipo_sangre: '', discapacidad: 'No',
    id_sexo: '', id_tipo_documento: '', fecha_nacimiento: ''
  });

  const [usuario, setUsuario] = useState({
    username: '', contrasena: '', id_tipo_usuario: 3 // Profesor
  });

  const [funcionario, setFuncionario] = useState({
    cargo: '', arl: ''
  });

  const [archivos, setArchivos] = useState({
    eps: null,
    arl: null,
    hoja_vida: null,
    acta_grado: null,
    rut: null
  });

  const handlePersona = (e) => {
    const { name, value } = e.target;
    setPersona(prev => ({
      ...prev,
      [name]: ['id_sexo', 'id_tipo_documento'].includes(name) ? Number(value) : value
    }));
  };

  const handleUsuario = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleFuncionario = (e) => {
    const { name, value } = e.target;
    setFuncionario(prev => ({ ...prev, [name]: value }));
  };

  const handleArchivos = (e) => {
    setArchivos(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const avanzar = () => step < 3 && setStep(step + 1);
  const retroceder = () => step > 1 && setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('persona', JSON.stringify(persona));
    formData.append('usuario', JSON.stringify(usuario));
    formData.append('funcionario', JSON.stringify(funcionario));

    for (const [campo, file] of Object.entries(archivos)) {
      if (file) {
        formData.append(`archivo_${campo}`, file);
      }
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/registro-funcionario', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setUsuarioGenerado(data.usuario);
        setMensaje(data.mensaje || '✅ Profesor registrado con éxito');
        setStep(4);
      } else {
        setMensaje(data.mensaje || '❌ Error al registrar');
      }
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al conectar con el servidor');
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
            <motion.div key="paso1" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Datos Personales</h3>
              {[['numero_documento', 'Documento'], ['nombre', 'Nombre'], ['apellido', 'Apellido'],
                ['correo', 'Correo'], ['telefono', 'Teléfono'], ['direccion', 'Dirección'],
                ['ciudad_residencia', 'Ciudad'], ['tipo_sangre', 'Tipo Sangre'],
                ['discapacidad', 'Discapacidad'], ['fecha_nacimiento', 'Fecha Nacimiento']].map(([name, label]) => (
                <input key={name} name={name} placeholder={label} type={name === 'fecha_nacimiento' ? 'date' : 'text'} value={persona[name]} onChange={handlePersona} required />
              ))}
              <select name="id_sexo" value={persona.id_sexo} onChange={handlePersona} required>
                <option value="">Sexo</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
              </select>
              <select name="id_tipo_documento" value={persona.id_tipo_documento} onChange={handlePersona} required>
                <option value="">Tipo Documento</option>
                <option value="1">CC</option>
                <option value="2">TI</option>
              </select>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="paso2" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Datos Académicos</h3>
              <input name="username" placeholder="Usuario" value={usuario.username} onChange={handleUsuario} required />
              <input name="contrasena" type="password" placeholder="Contraseña" value={usuario.contrasena} onChange={handleUsuario} required />
              <input name="cargo" placeholder="Cargo (Ej: Profesor de Ciencias)" value={funcionario.cargo} onChange={handleFuncionario} required />
              <input name="arl" placeholder="ARL" value={funcionario.arl} onChange={handleFuncionario} required />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="paso3" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Documentos (PDF o PNG)</h3>
              {['eps', 'arl', 'hoja_vida', 'acta_grado', 'rut'].map(name => (
                <div key={name}>
                  <label>{name.replace('_', ' ').toUpperCase()}:</label>
                  <input type="file" name={name} accept=".pdf,.png,.jpg,.jpeg" onChange={handleArchivos} required />
                </div>
              ))}
              <button type="submit">Registrar Profesor</button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="botones">
        {step > 1 && step < 4 && <button type="button" onClick={retroceder}>Anterior</button>}
        {step < 3 && <button type="button" onClick={avanzar}>Siguiente</button>}
      </div>

      {mensaje && (
        <div className="mensaje">
          <p>{mensaje}</p>
          {usuarioGenerado && (
            <div>
              <h4>🧑‍🏫 Usuario Registrado:</h4>
              <p><strong>Usuario:</strong> {usuarioGenerado.username}</p>
              <p><strong>Contraseña:</strong> {usuario.contrasena}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
