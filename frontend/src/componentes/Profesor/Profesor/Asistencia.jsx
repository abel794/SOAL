import React, { useState } from 'react';

function Asistencia() {
  const estudiantes = [
    { id: 1, nombre: 'Juan Pérez', grado: '701', documento: '1001234567' },
    { id: 2, nombre: 'María López', grado: '701', documento: '1002345678' },
    { id: 3, nombre: 'Carlos Ramírez', grado: '701', documento: '1003456789' },
    { id: 4, nombre: 'Ana Torres', grado: '701', documento: '1004567890' },
    { id: 5, nombre: 'Luis Gómez', grado: '701', documento: '1005678901' },
    { id: 6, nombre: 'Camila Ruiz', grado: '701', documento: '1006789012' },
    { id: 7, nombre: 'Esteban Mejía', grado: '701', documento: '1007890123' },
    { id: 8, nombre: 'Daniela Ríos', grado: '701', documento: '1008901234' },
    { id: 9, nombre: 'Nicolás Herrera', grado: '701', documento: '1009012345' },
    { id: 10, nombre: 'Valentina Salazar', grado: '701', documento: '1010123456' },
  ];

  const [asistencias, setAsistencias] = useState({});
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().slice(0, 10); // formato: YYYY-MM-DD
  });

  const handleCheckbox = (id) => {
    setAsistencias((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const guardarAsistencias = () => {
    const resumen = estudiantes.map(est => ({
      nombre: est.nombre,
      documento: est.documento,
      presente: !!asistencias[est.id],
      fecha: fecha,
    }));

    console.log('📋 Asistencias registradas:', resumen);
    alert('✅ Asistencias registradas para ' + fecha + ' (ver consola)');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Registrar Asistencia</h2>

      {/* 📅 Selector de fecha */}
      <div className="mb-3">
        <label htmlFor="fecha" className="form-label fw-bold">Fecha de asistencia:</label>
        <input
          type="date"
          id="fecha"
          className="form-control"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Grado</th>
            <th>Presente</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est) => (
            <tr key={est.id}>
              <td>{est.nombre}</td>
              <td>{est.documento}</td>
              <td>{est.grado}</td>
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={!!asistencias[est.id]}
                  onChange={() => handleCheckbox(est.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-success mt-3" onClick={guardarAsistencias}>
        Guardar Asistencias
      </button>
    </div>
  );
}

export default Asistencia;
