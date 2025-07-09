import React, { useState } from 'react';
import './HistorialObservaciones.css'; // 🎨 Estilos separados

function HistorialObservaciones() {
  const [nombreBuscado, setNombreBuscado] = useState('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([]);

  const manejarBusqueda = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/historial/buscar?nombre=${nombreBuscado}`);
      const data = await res.json();

      if (res.ok && data.length > 0) {
        setHistorial(data);
        setNombre(nombreBuscado);
        setMensaje('');
      } else {
        setHistorial([]);
        setNombre(nombreBuscado);
        setMensaje('❌ No se encontró historial para este estudiante.');
      }
    } catch (error) {
      console.error('⚠️ Error en la búsqueda:', error);
      setMensaje('⚠️ Error al conectar con el servidor.');
    }
  };

  return (
    <div className="historial-container">
      {/* Buscar estudiante */}
      <div className="busqueda">
        <input
          type="text"
          placeholder="Buscar estudiante por nombre"
          value={nombreBuscado}
          onChange={(e) => setNombreBuscado(e.target.value)}
        />
        <button onClick={manejarBusqueda}>Buscar estudiante</button>
      </div>

      {/* Título y mensaje */}
      <h2 className="titulo">Historial de observaciones de {nombre}</h2>
      <div className="linea" />

      {mensaje && <p className="mensaje-error">{mensaje}</p>}

      {/* Tabla de historial */}
      {historial.length > 0 && (
        <div className="tabla-responsive">
          <table className="tabla-historial">
            <thead>
              <tr>
                <th>Fecha modificación</th>
                <th>Descripción modificación</th>
                <th>Observación original</th>
                <th>Gravedad</th>
                <th>Fecha observación</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item, i) => (
                <tr key={i}>
                  <td>{item.fecha_modificacion?.split('T')[0]}</td>
                  <td>{item.descripcion_modificacion}</td>
                  <td>{item.observacion?.descripcion ?? 'N/A'}</td>
                  <td>{item.observacion?.gravedad?.nombre ?? 'Sin gravedad'}</td>
                  <td>{item.observacion?.fecha ?? 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistorialObservaciones;
