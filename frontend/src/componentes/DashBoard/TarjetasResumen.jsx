import React from 'react';
import './style/TarjetasResumen.css';

const TarjetasResumen = () => {
  const tarjetas = [
    { titulo: 'Estudiantes inscritos', total: '452', cambio: 'total', color: 'verde' },
    { titulo: 'Docentes activos', total: '452', cambio: 'total', color: 'verde' },
    { titulo: 'Reportes generados', total: '300', cambio: 'alto', color: 'rojo' },
  ];

  return (
    <div className="tarjetas-resumen">
      {tarjetas.map((t, i) => (
        <div key={i} className="tarjeta">
          <p className="titulo">{t.titulo}</p>
          <h2>{t.total}</h2>
          <span className={`cambio ${t.color}`}>{t.cambio}</span>
        </div>
      ))}
    </div>
  );
};

export default TarjetasResumen;
