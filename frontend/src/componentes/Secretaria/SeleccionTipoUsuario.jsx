import React from 'react';

const SeleccionTipoUsuario = ({ onSelect }) => {
  return (
    <div className="d-flex justify-content-around">
      <button className="btn btn-primary" onClick={() => onSelect('estudiante')}>Registrar Estudiante</button>
      <button className="btn btn-secondary" onClick={() => onSelect('docente')}>Registrar Docente</button>
    </div>
  );
};

export default SeleccionTipoUsuario;