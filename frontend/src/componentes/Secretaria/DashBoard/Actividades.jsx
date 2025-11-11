import React from 'react';
import './style/Actividades.css'; 

const actividades = [
  { nombre: 'Cargar documentos de matrícula' },
  { nombre: 'Enviar reportes al rector' },
  { nombre: 'Verificar formularios pendientes' },
];

const Actividades = () => {
  return (
    <div className="actividades">
      <h3>Actividades</h3>
      <ul>
        {actividades.map((a, i) => (
          <li key={i}>{a.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Actividades;
