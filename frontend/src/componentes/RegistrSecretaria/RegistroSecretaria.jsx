import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RegistroSecretaria.css';

export default function RegistroSecretariaMultistep() {
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [sexos, setSexos] = useState([]);

  const [persona, setPersona] = useState({
    numero_documento: '', nombre: '', apellido: '', correo: '', telefono: '',
    direccion: '', ciudad_residencia: '', tipo_sangre: '', discapacidad: 'No',
    id_sexo: '', id_tipo_documento: '', fecha_nacimiento: ''
  });

  const [archivos, setArchivos] = useState({
    eps: null, arl: null, hoja_vida: null, acta_grado: null, rut: null
  });

  const avanzar = () => step < 3 && setStep(step + 1);
  const retroceder = () => step > 1 && setStep(step - 1);

  const handlePersona = (e) => {
    const { name, value } = e.target;
    setPersona(prev => ({
      ...prev,
      [name]: ['id_sexo', 'id_tipo_documento'].includes(name) ? Number(value) : value
    }));
  };

  const handleArchivos = (e) => {
    setArchivos(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  useEffect(() => {
    // Cargar tipos de documento
    fetch('http://localhost:3000/api/tipo-documento')
      .then(res => res.json())
      .then(data => setTiposDocumento(data))
      .catch(err => console.error('Error al cargar tipos de documento:', err));

    // Cargar sexos
    fetch('http://localhost:3000/api/sexos')
      .then(res => res.json())
      .then(data => setSexos(data))
      .catch(err => console.error('Error al cargar sexos:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuario = {
      username: persona.correo,
      contrasena: persona.numero_documento,
      id_tipo_usuario: 5 // Secretaria
    };

    const funcionario = {
      cargo: 'Secretaria',
      arl: 'No aplica'
    };

    const formData = new FormData();
    formData.append('persona', JSON.stringify(persona));
    formData.append('usuario', JSON.stringify(usuario));
    formData.append('funcionario', JSON.stringify(funcionario));

    for (const [campo, file] of Object.entries(archivos)) {
      if (file) formData.append(`archivo_${campo}`, file);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/registro-funcionario', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      console.log('🔁 Respuesta servidor:', data);

      if (res.ok) {
        setUsuarioGenerado({ ...data.usuario, contrasena: usuario.contrasena });
        setMensaje(data.mensaje || '✅ Secretaria registrada con éxito');
        setStep(3); // ✅ CORREGIDO (antes estaba en 4)
      } else {
        setMensaje(data.mensaje || '❌ Error al registrar');
        setStep(3); // también mostrar mensaje de error
      }
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al conectar con el servidor');
      setStep(3); // mostrar mensaje de error
    }
  };

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
            <motion.div key="paso1" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Datos Personales</h3>
              {[['numero_documento', 'Documento'], ['nombre', 'Nombre'], ['apellido', 'Apellido'],
                ['correo', 'Correo'], ['telefono', 'Teléfono'], ['direccion', 'Dirección'],
                ['ciudad_residencia', 'Ciudad'], ['tipo_sangre', 'Tipo Sangre'],
                ['discapacidad', 'Discapacidad'], ['fecha_nacimiento', 'Fecha Nacimiento']].map(([name, label]) => (
                <input key={name} name={name} placeholder={label} type={name === 'fecha_nacimiento' ? 'date' : 'text'} value={persona[name]} onChange={handlePersona} required />
              ))}

              <select name="id_sexo" value={persona.id_sexo} onChange={handlePersona} required>
                <option value="">Seleccione sexo</option>
                {sexos.map(s => (
                  <option key={s.id_sexo} value={s.id_sexo}>{s.nombre}</option>
                ))}
              </select>

              <select name="id_tipo_documento" value={persona.id_tipo_documento} onChange={handlePersona} required>
                <option value="">Tipo de Documento</option>
                {tiposDocumento.map(td => (
                  <option key={td.id_tipo_documento} value={td.id_tipo_documento}>{td.nombre}</option>
                ))}
              </select>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="paso2" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Documentos (PDF o PNG)</h3>
              {['eps', 'arl', 'hoja_vida', 'acta_grado', 'rut'].map(name => (
                <div key={name}>
                  <label>{name.replace('_', ' ').toUpperCase()}:</label>
                  <input type="file" name={name} accept=".pdf,.png,.jpg,.jpeg" onChange={handleArchivos} required />
                </div>
              ))}
              <button type="submit">Registrar Secretaria</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="paso3" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h4>Resultado</h4>
              {mensaje && <p className="mensaje-final">{mensaje}</p>}
              {usuarioGenerado && (
                <div>
                  <p><strong>Usuario:</strong> {usuarioGenerado.username}</p>
                  <p><strong>Contraseña:</strong> {usuarioGenerado.contrasena}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="botones-profesor">
        {step > 1 && step < 3 && <button type="button" onClick={retroceder}>Anterior</button>}
        {step < 2 && <button type="button" onClick={avanzar}>Siguiente</button>}
      </div>
    </div>
  );
}
