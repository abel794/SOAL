import React, { useState } from 'react';
import '../App.css';

function RegistrarObservacion() {
  const [nombreBuscado, setNombreBuscado] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [observacion, setObservacion] = useState('');

  // Buscar estudiante por nombre
  const manejarBusqueda = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/estudiante/nombre/${nombreBuscado}`);
      const data = await res.json();

      if (res.ok && data.length > 0) {
        setEstudiante(data[0]); // Tomamos el primer estudiante encontrado
        setMensaje(`✅ Estudiante encontrado: ${data[0].nombre_estudiante}`);
      } else {
        setEstudiante(null);
        setMensaje('❌ Estudiante no encontrado.');
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setMensaje('⚠️ Error de conexión con el servidor.');
    }
  };

  // Enviar la observación
  const manejarRegistro = async (e) => {
    e.preventDefault();

    if (!estudiante) {
      alert('⚠️ Debes buscar y seleccionar un estudiante primero.');
      return;
    }

    if (observacion.trim() === '') {
      alert('⚠️ Escribe una observación.');
      return;
    }

    // Aquí deberías enviar la observación a tu backend
    console.log(`Observación registrada para ${estudiante.nombre_estudiante}: ${observacion}`);

    // Reiniciar formulario
    setObservacion('');
    alert(`✅ Observación registrada para ${estudiante.nombre_estudiante}`);
  };

  return (
    <div className="p-3">
      <h1>Registrar Observación</h1>
      <h3>Instituto Renato Descartes</h3>
      <div className="linea mb-3"></div>

      {/* Barra de búsqueda */}
      <div>
        <input
          type="text"
          placeholder="Escribe el nombre del estudiante"
          value={nombreBuscado}
          onChange={(e) => setNombreBuscado(e.target.value)}
          style={{ padding: '8px', width: '60%', marginRight: '10px' }}
        />
        <button onClick={manejarBusqueda} style={{ padding: '8px 15px' }}>
          Buscar estudiante
        </button>
      </div>

      {/* Mensaje de estado */}
      {mensaje && <p className="mt-3 fw-bold">{mensaje}</p>}

      {/* Formulario de observación */}
      {estudiante && (
        <form onSubmit={manejarRegistro} style={{ marginTop: '25px' }}>
          <p><strong>Estudiante:</strong> {estudiante.nombre_estudiante}</p>
          <p><strong>Grado:</strong> {estudiante.nombre_grado}</p>

          <textarea
            placeholder="Escribe la observación..."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            style={{ width: '100%', padding: '10px', minHeight: '100px' }}
            required
          />

          <button type="submit" style={{ marginTop: '10px', padding: '8px 15px' }}>
            Registrar observación
          </button>
        </form>
      )}
    </div>
  );
}

export default RegistrarObservacion;

