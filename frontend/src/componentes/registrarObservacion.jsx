import React, { useState, useEffect } from 'react';
import '../App.css';

function RegistrarObservacion() {
  const [nombreBuscado, setNombreBuscado] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [observacion, setObservacion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [idCategoria, setIdCategoria] = useState('');
  const [gravedad, setGravedad] = useState('Leve');

  // 🔄 Cargar categorías desde la base de datos
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/categorias');
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  // 🔍 Buscar estudiante por nombre
  const manejarBusqueda = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/estudiantes/buscar?termino=${nombreBuscado}`);
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

  // 📝 Enviar observación al backend
  const manejarRegistro = async (e) => {
    e.preventDefault();

    if (!estudiante || !idCategoria || observacion.trim() === '') {
      alert('⚠️ Completa todos los campos antes de enviar.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/observacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: 19, // 🔁 Simulado, debes tomarlo de sesión
          id_estudiante: estudiante.id_estudiante,
          id_categoria: idCategoria,
          descripcion: observacion,
          gravedad: gravedad,
          fecha: new Date().toISOString().slice(0, 10),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Observación registrada para ${estudiante.nombre}`);
        setObservacion('');
        setIdCategoria('');
        setGravedad('Leve');
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      alert('❌ Error de conexión al servidor.');
    }
  };

  return (
    <div className="p-3">
      <h1>Registrar Observación</h1>
      <h3>Instituto Renato Descartes</h3>
      <div className="linea mb-3"></div>

      <div>
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
      </div>

      {mensaje && <p className="mt-3 fw-bold">{mensaje}</p>}

      {estudiante && (
        <form onSubmit={manejarRegistro} className="mt-4">
          <p><strong>Estudiante:</strong> {estudiante.nombre}</p>

          {/* 🔽 Categoría */}
          <div className="mb-3">
            <label><strong>Categoría:</strong></label>
            <select
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre_categoria}
                </option>
              ))}
            </select>
          </div>

          {/* 🔽 Gravedad */}
          <div className="mb-3">
            <label><strong>Gravedad:</strong></label>
            <select
              value={gravedad}
              onChange={(e) => setGravedad(e.target.value)}
              className="form-select"
            >
              <option value="Leve">Leve</option>
              <option value="Moderado">Moderado</option>
              <option value="Grave">Grave</option>
            </select>
          </div>

          {/* 📝 Observación */}
          <textarea
            placeholder="Escribe la observación..."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            className="form-control"
            style={{ minHeight: '100px' }}
            required
          />

          <button type="submit" className="btn btn-primary mt-3">
            Registrar observación
          </button>
        </form>
      )}
    </div>
  );
}

export default RegistrarObservacion;


