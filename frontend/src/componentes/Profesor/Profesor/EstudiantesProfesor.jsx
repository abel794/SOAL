import React from 'react';

function EstudiantesProfesor() {
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

   return (
    <div className="container mt-4">
      <h2 className="mb-3">Estudiantes Asignados</h2>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Grado</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est, index) => (
            <tr key={index}>
              <td>{est.nombre}</td>
              <td>{est.documento}</td>
              <td>{est.grado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default EstudiantesProfesor;
