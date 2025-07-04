// src/componentes/ModalCerrarSesion.jsx
import React from 'react';
import './ModalCerrarSesion.css';

export default function ModalCerrarSesion({ onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>¿Estás seguro de que quieres cerrar sesión?</p>
        <div className="modal-botones">
          <button onClick={onConfirmar} className="btn btn-danger">Sí</button>
          <button onClick={onCancelar} className="btn btn-secondary">No</button>
        </div>
      </div>
    </div>
  );
}
