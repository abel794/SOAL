import React from 'react';
import './Boton.css';

const Boton = ({ texto }) => {
  return (
    <button className="boton">
      {texto}
    </button>
  );
};

export default Boton;
