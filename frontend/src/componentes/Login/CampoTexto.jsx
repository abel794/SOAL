import React from 'react';
import '../Login/style/CampoTexto.css';

const CampoTexto = ({ etiqueta, tipo, placeholder, valor, onChange }) => {
  return (
    <div className="campo-texto">
      <label>{etiqueta}</label>
      <input
        type={tipo}
        placeholder={placeholder}
        value={valor}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default CampoTexto;
