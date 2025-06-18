import React from 'react';

const BotonContinuar = ({ avanzarPaso, retrocederPaso }) => {
  return (
    <div className="contenedor-botones">
      <button type="button" className="boton-secundario" onClick={retrocederPaso}>Volver</button>
      <button type="button" className="boton-formulario" onClick={avanzarPaso}>Continuar</button>
    </div>
  );
};

export default BotonContinuar;