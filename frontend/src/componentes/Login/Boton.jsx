import React from 'react';
import '../Login/style/Boton.css';

const Boton = ({ texto }) => {
  return (
    <button className="boton">
      {texto}
    </button>
  );
};

export default Boton;
