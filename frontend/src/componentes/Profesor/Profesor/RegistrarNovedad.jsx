import React, { useState } from 'react';

function RegistrarNovedad() {
  const estudiantes = [
    { id: 1, nombre: 'Juan Pérez', documento: '1001234567' },
    { id: 2, nombre: 'María López', documento: '1002345678' },
    { id: 3, nombre: 'Carlos Ramírez', documento: '1003456789' },
  ];

  const categorias = [
    { id: 1, nombre: 'Disciplina' },
    { id: 2, nombre: 'Rendimiento académico' },
    { id: 3, nombre: 'Comportamiento' },
  ];

  const [idEstudiante, setIdEstudiante] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [gravedad, setGravedad] = useState('Leve');
  const [descripcion, setDescripcion] = useState('');

  const manejarRegistro = (e) => {
    e.preventDefault();

    if (!idEstudiante || !idCategoria || !descripcion.trim()) {
      alert('⚠️ Completa todos los campos');
      return;
    }

    const estudiante = estudiantes.find((e) => e.id === parseInt(idEstudiante));
    const categoria = categorias.find((c) => c.id === parseInt(idCategoria));

    console.log('📋 Novedad registrada:', {
      estudiante: estudiante.nombre,
      categoria: categoria.nombre,
      gravedad,
      descripcion,
    });

    alert(`✅ Novedad registrada para ${estudiante.nombre}`);
    setIdEstudiante('');
    setIdCategoria('');
    setGravedad('Leve');
    setDescripcion('');
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Novedad</h2>
      <form onSubmit={manejarRegistro}>
        <div className="mb-3">
          <label className="form-label">Estudiante</label>
          <select className="form-select" value={idEstudiante} onChange={(e) => setIdEstudiante(e.target.value)}>
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map((est) => (
              <option key={est.id} value={est.id}>
                {est.nombre} - {est.documento}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select className="form-select" value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)}>
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Gravedad</label>
          <select className="form-select" value={gravedad} onChange={(e) => setGravedad(e.target.value)}>
            <option value="Leve">Leve</option>
            <option value="Moderado">Moderado</option>
            <option value="Grave">Grave</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            rows="4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
}

export default RegistrarNovedad;
