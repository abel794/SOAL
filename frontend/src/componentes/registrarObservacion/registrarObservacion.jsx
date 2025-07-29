import React, { useState, useEffect } from 'react';
import './RegistrarObservacion.css'; // ✅ Estilos separados

function RegistrarObservacion() {
  const [nombreBuscado, setNombreBuscado] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [observacion, setObservacion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [idCategoria, setIdCategoria] = useState('');
  const [gravedad, setGravedad] = useState('Leve');

  // ✅ Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/categorias');
        const data = await res.json();
        setCategorias(data.categorias);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setMensaje({ tipo: 'error', texto: '⚠️ No se pudieron cargar las categorías.' });
      }
    };
    fetchCategorias();
  }, []);

  // ✅ Buscar estudiante
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
        setMensaje({ tipo: 'exito', texto: `✅ Estudiante encontrado: ${data[0].persona?.nombre || data[0].nombre}` });
      } else {
        setEstudiante(null);
        setMensaje({ tipo: 'error', texto: ' Estudiante no encontrado.' });
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setMensaje({ tipo: 'error', texto: '⚠️ Error de conexión con el servidor.' });
    }
  };

  // ✅ Ocultar mensaje automáticamente
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

  // ✅ Registrar observación
  const manejarRegistro = async (e) => {
    e.preventDefault();

    if (!estudiante || !idCategoria || observacion.trim() === '') {
      setMensaje({ tipo: 'error', texto: '⚠️ Completa todos los campos antes de enviar.' });
      return;
    }

    const gravedadMap = { 'Leve': 1, 'Moderado': 2, 'Grave': 3 };
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
        setMensaje({ tipo: 'exito', texto: `✅ Observación registrada para ${estudiante.persona?.nombre || estudiante.nombre}` });
        setObservacion('');
        setIdCategoria('');
        setGravedad('Leve');
      } else {
        setMensaje({ tipo: 'error', texto: `❌ Error: ${data.error}` });
      }
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      setMensaje({ tipo: 'error', texto: '❌ Error de conexión al servidor.' });
    }
  };

  return (
    <div className="registro-observacion-container">
      <h1>Registrar Observación</h1>
      <h3>Instituto Renato Descartes</h3>
      <div className="linea"></div>

      <div className="busqueda-estudiante">
        <input
          type="text"
          placeholder="Buscar estudiante por nombre o documento"
          value={nombreBuscado}
          onChange={(e) => setNombreBuscado(e.target.value)}
        />
        <button onClick={manejarBusqueda}>Buscar estudiante</button>
      </div>

      {/* ✅ Mensaje */}
      {mensaje && (
        <div className={`mensaje-card mensaje-${mensaje.tipo}`}>
          {mensaje.tipo === 'exito' ? (
            <lord-icon src="/icons/checkmark.json" trigger="loop" delay="500" style={{ width: '90px', height: '90px' }} />
          ) : (
            <lord-icon src="/icons/error.json" trigger="loop" delay="500" style={{ width: '90px', height: '90px' }} />
          )}
          <p className="mensaje-texto">{mensaje.texto}</p>
        </div>
      )}

      {estudiante && (
        <form onSubmit={manejarRegistro} className="formulario-observacion">
          <p><strong>Estudiante:</strong> {estudiante.persona?.nombre ?? estudiante.nombre ?? 'Sin nombre'}</p>

          <label><strong>Categoría:</strong></label>
          <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} required>
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
            ))}
          </select>

          <label><strong>Gravedad:</strong></label>
          <select value={gravedad} onChange={(e) => setGravedad(e.target.value)}>
            <option value="Leve">Leve</option>
            <option value="Moderado">Moderado</option>
            <option value="Grave">Grave</option>
          </select>

          <label><strong>Observación:</strong></label>
          <textarea
            placeholder="Escribe la observación..."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            required
          ></textarea>

          <button type="submit" className="btn btn-primary mt-3">Registrar observación</button>
        </form>
      )}
    </div>
  );
}

export default RegistrarObservacion;
