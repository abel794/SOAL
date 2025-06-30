import React, { useState } from 'react';
import '../App.css';

function BuscarEstudiante() {
  const [nombre, setNombre] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const buscar = async () => {
    try {
      let url = 'http://localhost:3000/api/estudiantes/buscar';
      if (nombre.trim() !== '') {
        url += `?termino=${encodeURIComponent(nombre)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && Array.isArray(data) && data.length > 0) {
        setEstudiantes(data);
        setMensaje(`✅ ${data.length} estudiante(s) encontrado(s)`);
      } else {
        setEstudiantes([]);
        setMensaje('❌ No se encontraron estudiantes');
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      setMensaje('⚠️ Error al conectar con el servidor');
    }
  };

  return (
    <div className="p-3">
      <h1>Buscar Estudiante</h1>
      <h3>Instituto Renato Descartes</h3>
      <div className="linea mb-3"></div>

      <div>
        <input
          type="text"
          placeholder="Buscar por nombre o documento"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ padding: '8px', width: '60%', marginRight: '10px' }}
        />
        <button onClick={buscar} style={{ padding: '8px 15px' }}>
          Buscar
        </button>
      </div>

      {mensaje && <p className="mt-3 fw-bold">{mensaje}</p>}

      {estudiantes.length > 0 && (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Número de documento</th>
              {/* <th>Grado</th> <-- solo si tienes relación cargada con Grado */ }
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((est) => (
              <tr key={est.id_estudiante}>
                <td>{est.nombre}</td>
                <td>{est.numero_documento}</td>
                {/* <td>{est.Grado?.nombre_grado ?? 'No asignado'}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BuscarEstudiante;

