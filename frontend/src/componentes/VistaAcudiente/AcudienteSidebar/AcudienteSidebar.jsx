import React, { useState } from 'react';
import './AcudienteSidebar.css';

function AcudienteSidebar() {
  const [colapsado, setColapsado] = useState(false);

  return (
    <div className={`sidebar ${colapsado ? 'colapsado' : ''}`}>
      <button className="toggle-btn" onClick={() => setColapsado(!colapsado)}>☰</button>
      {!colapsado && (
        <>
          <h2>Panel acudiente</h2>
          <ul>
            <li>Dashboard</li>
            <li>Notificaciones</li>
            <li>Solicitar PQR</li>
            <li>Relación Acudiente</li>
            <li>Configuración</li>
            <li>Cerrar sesión</li>
          </ul>
        </>
      )}
    </div>
  );
}

export default AcudienteSidebar;
