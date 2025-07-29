// Instrucciones de configuración:
// 1. Añade el script de Lordicon en public/index.html:
//    <script src="https://cdn.lordicon.com/lusqsztk.js"></script>
// 2. En src/index.js, importa React y ReactDOM:
//    import React from 'react';
//    import ReactDOM from 'react-dom';
//    import App from './App';
//    ReactDOM.render(<App />, document.getElementById('root'));

// Componente AsignarGradoProfesor.jsx
import React, { useEffect, useState } from 'react';
import './AsignarGrado.css';

export default function AsignarGradoProfesor() {
  const [term, setTerm] = useState('');
  const [profesor, setProfesor] = useState(null);
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/grados')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => setGrados(data))
      .catch(() => setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los grados.' }));
  }, []);

  useEffect(() => {
    if (!mensaje) return;
    const timeout = setTimeout(() => setMensaje(null), 3000);
    const handleClick = () => setMensaje(null);
    document.addEventListener('click', handleClick);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', handleClick);
    };
  }, [mensaje]);

  const buscarProfesor = async () => {
    const q = term.trim();
    if (!q) return setMensaje({ tipo: 'error', texto: 'Ingresa algo para buscar.' });
    setMensaje(null);
    let res = await fetch(`http://localhost:3000/api/funcionarios/cedula/${q}`);
    if (res.ok) return setProfesor(await res.json());
    res = await fetch(`http://localhost:3000/api/funcionarios/buscar?nombre=${encodeURIComponent(q)}`);
    if (res.ok) {
      const { data } = await res.json();
      const prof = data.find(f => f.cargo.toLowerCase().includes('profesor'));
      if (prof) return setProfesor(prof);
    }
    setProfesor(null);
    setMensaje({ tipo: 'error', texto: 'No se encontró ningún profesor.' });
  };

  const asignarGrado = () => {
    if (!profesor || !gradoSeleccionado)
      return setMensaje({ tipo: 'error', texto: 'Selecciona un profesor y un grado.' });
    fetch('http://localhost:3000/api/funcionarios/asignar-grado', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_funcionario: profesor.id_funcionario, id_grado: gradoSeleccionado })
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(() => setMensaje({ tipo: 'exito', texto: 'Grado asignado correctamente.' }))
      .catch(() => setMensaje({ tipo: 'error', texto: 'No se pudo asignar el grado.' }));
  };

  return (
    <div className="asignar-grado-main">
      <div className="card form-card">
        <h3 className="title">Asignar Grado a Profesor</h3>
        <div className="form-row">
          <input
            className="input-field"
            placeholder="Documento o nombre"
            value={term}
            onChange={e => setTerm(e.target.value)}
          />
          <button className="btn-primary" onClick={buscarProfesor}>Buscar</button>
        </div>
        {profesor && (
          <div className="card profesor-card">
            <p className="profesor-info">
              <div className="profesor-info">
              <p>👤 <strong>Nombre:</strong> {profesor.persona?.nombre}</p>
              <p>👤 <strong>Apellido:</strong> {profesor.persona?.apellido}</p>
              <p>🆔 <strong>Numero de Cédula:</strong> {profesor.numero_documento}</p>
            </div>
            </p>
            <div className="form-row">
              <select className="select-field" value={gradoSeleccionado} onChange={e => setGradoSeleccionado(e.target.value)}>
                <option value="">-- Selecciona un grado --</option>
                {grados.map(g => (
                  <option key={g.id_grado} value={g.id_grado}>{g.nombre_grado || g.nombre}</option>
                ))}
              </select>
              <button className="btn-secondary" onClick={asignarGrado}>Asignar</button>
            </div>
          </div>
        )}
      </div>
      {mensaje && (
        <div className={`mensaje-card mensaje-${mensaje.tipo}`}>            
          {mensaje.tipo === 'exito' ? (
            <lord-icon src="/icons/checkmark.json" trigger="loop" delay="500" style={{ width: '90px', height: '90px' }} />
          ) : (
            // Mostrar un ícono de error
            <lord-icon src="/icons/error.json" trigger="loop" delay="500" style={{ width: '90px', height: '90px' }} />
          )}
          <p className="mensaje-texto">{mensaje.texto}</p>
        </div>
      )}
    </div>
  );
}