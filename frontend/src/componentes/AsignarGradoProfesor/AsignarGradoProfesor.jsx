import React, { useState } from 'react';
import './AsignarGrado.css';

const profesoresMock = [
  { id: 1, nombre: 'Carlos Gómez', documento: '12345', especialidad: 'Matemáticas', foto: 'https://i.pravatar.cc/50?img=1' },
  { id: 2, nombre: 'Sofía Torres', documento: '54321', especialidad: 'Ciencias Naturales', foto: 'https://i.pravatar.cc/50?img=2' },
  { id: 3, nombre: 'Pedro Suárez', documento: '98765', especialidad: 'Educación Física', foto: 'https://i.pravatar.cc/50?img=3' }
];



const gradosMock = ['1A', '2B', '3C', '4D'];

export default function AsignarGrado() {
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [mensaje, setMensaje] = useState('');

  const asignarGrado = (profesor) => {
    if (!gradoSeleccionado) {
      setMensaje('⚠️ Selecciona un grado antes de asignar');
      return;
    }
    setMensaje(`✅ Grado ${gradoSeleccionado} asignado a ${profesor.nombre}`);
  };

  return (
    <div className="asignar-grado-container">
      <h2>📘 Asignación de grados a profesores</h2>

      <div className="filtros">
        <input type="text" placeholder="Buscar Número Documento Docente" />
        <select value={gradoSeleccionado} onChange={(e) => setGradoSeleccionado(e.target.value)}>
          <option value="">Selecciona un grado</option>
          {gradosMock.map((grado, i) => (
            <option key={i} value={grado}>{grado}</option>
          ))}
        </select>
      </div>

      <div className="profesores-lista">
        {profesoresMock.map((p) => (
          <div key={p.id} className="profesor-card">
            <img src={p.foto} alt="foto" />
            <div className="info">
              <p className="nombre">{p.nombre}</p>
              <p className="doc">Documento: {p.documento}</p>
              <p className='especialidad'>Especialidad: {p.especialidad} </p>
            </div>
            <button onClick={() => asignarGrado(p)}>Asignar</button>
          </div>
        ))}
      </div>

      {mensaje && <div className="mensaje">{mensaje}</div>}
    </div>
  );
}
