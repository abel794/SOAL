import React from 'react';
import './style/TablaRecientes.css';

const TablaRecientes = () => {
  const datos = [
    { item: 'Inscripción', fecha: '02/08/2023', estado: 'Completado' },
    { item: 'Actualización', fecha: '10/08/2023', estado: 'Pendiente' },
    { item: 'Cita acudiente', fecha: '15/08/2023', estado: 'Completado' },
    { item: 'Pago' , fecha: '15/10/2023', estado: 'Completado'},
  ];

  return (
    <div className="tabla-recientes">
      <h3>Movimientos recientes</h3>
      <table>
        <thead>
          <tr>
            <th>Acción</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d, i) => (
            <tr key={i}>
              <td>{d.item}</td>
              <td>{d.fecha}</td>
              <td className={`estado ${d.estado.toLowerCase()}`}>{d.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaRecientes;
