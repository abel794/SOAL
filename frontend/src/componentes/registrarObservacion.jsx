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

  // 🔄 Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/categorias');
        const data = await res.json();
        setCategorias(data.categorias); // ← Usamos el array dentro de la respuesta
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  // 🔍 Buscar estudiante por nombre o documento
  const manejarBusqueda = async () => {
    try {
      let url = 'http://localhost:3000/api/estudiantes/buscar';
      if (nombreBuscado.trim() !== '') {
        url += `?filtro=${encodeURIComponent(nombreBuscado)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && Array.isArray(data) && data.length > 0) {
        setEstudiante(data[0]);
        setMensaje(`✅ Estudiante encontrado: ${data[0].persona?.nombre || data[0].nombre}`);
      } else {
        setEstudiante(null);
        setMensaje('❌ Estudiante no encontrado.');
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setMensaje('⚠️ Error de conexión con el servidor.');
    }
  };

  // 📝 Enviar observación
  const manejarRegistro = async (e) => {
    e.preventDefault();

    if (!estudiante || !idCategoria || observacion.trim() === '') {
      alert('⚠️ Completa todos los campos antes de enviar.');
      return;
    }

    // Convertir gravedad a ID numérico
    const gravedadMap = {
      'Leve': 1,
      'Moderado': 2,
      'Grave': 3
    };
    const idGravedad = gravedadMap[gravedad];

    try {
      const res = await fetch('http://localhost:3000/api/observacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_estudiante: estudiante.id_estudiante,
          id_categoria: idCategoria,
          descripcion: observacion,
          id_gravedad: idGravedad,
          fecha: new Date().toISOString().slice(0, 10)
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Observación registrada para ${estudiante.persona?.nombre || estudiante.nombre}`);
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
          placeholder="Buscar estudiante por nombre o documento"
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
          <p><strong>Estudiante:</strong> {estudiante.persona?.nombre ?? estudiante.nombre ?? 'Sin nombre'}</p>

          {/* Categoría */}
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
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Gravedad */}
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

          {/* Observación */}
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
