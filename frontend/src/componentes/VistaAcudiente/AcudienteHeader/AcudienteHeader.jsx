import React from 'react';
import './AcudienteHeader.css';

function AcudienteHeader({ nombreUsuario }) {
  return (
    <header className="header">
      <h1>Observador Estudiantil</h1>
      <div className="user-info">
        <span>{nombreUsuario}</span>
        <img src="https://via.placeholder.com/40" alt="Foto de usuario" />
      </div>
    </header>
  );
}

export default AcudienteHeader;
