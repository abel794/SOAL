import React, { useEffect, useState } from 'react';
import './style/TarjetasResumen.css';
import axios from 'axios';

const TarjetasResumen = () => {
  const [resumen, setResumen] = useState({
    estudiantes: 0,
    docentes: 0,
    reportes: 0
  });

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/dashboard-secretaria/resumen'); 
        setResumen(res.data);
      } catch (error) {
        console.error("Error al obtener el resumen:", error);
      }
    };

    fetchResumen();
  }, []);

  return (
    <div className="tarjetas-resumen">
      <div className="tarjeta">
        <h3>Estudiantes</h3>
        <p>{resumen.estudiantes}</p>
      </div>
      <div className="tarjeta">
        <h3>Docentes</h3>
        <p>{resumen.docentes}</p>
      </div>
      <div className="tarjeta">
        <h3>Reportes</h3>
        <p>{resumen.reportes}</p>
      </div>
    </div>
  );
};

export default TarjetasResumen;

