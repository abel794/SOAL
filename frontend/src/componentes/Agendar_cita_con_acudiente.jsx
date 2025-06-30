import React, { useState } from 'react';
import '../App.css';

function AgendarCitaAcu() {
  const [nombreBuscado, setNombreBuscado] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const manejarBusqueda = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/acudientes/buscar?nombre=${nombreBuscado}`);
      const data = await res.json();

      if (res.ok && data.length > 0) {
        setEstudiante(data[0]);
        setMensaje(`✅ Estudiante encontrado: ${data[0].nombre}`);
      } else {
        setEstudiante(null);
        setMensaje('❌ Estudiante no encontrado.');
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setMensaje('⚠️ Error de conexión con el servidor.');
    }
  };

  return (
    <div className="p-3">
      <h2>Agendar cita con acudiente</h2>
      <div className="linea mb-3"></div>

      <input
        type="text"
        placeholder="Buscar estudiante por nombre"
        value={nombreBuscado}
        onChange={(e) => setNombreBuscado(e.target.value)}
        style={{ padding: '8px', width: '60%', marginRight: '10px' }}
      />
      <button onClick={manejarBusqueda} style={{ padding: '8px 15px' }}>
        Buscar estudiante
      </button>

      {mensaje && <p className="mt-3 fw-bold">{mensaje}</p>}

      {estudiante && (
        <div className="mt-3">
          <p><strong>Nombre:</strong> {estudiante.nombre}</p>
          <p><strong>Teléfono:</strong> {estudiante.telefono}</p>
          {/* Aquí podrías agregar el formulario para agendar la cita */}
        </div>
      )}
    </div>
  );
}

export default AgendarCitaAcu;
