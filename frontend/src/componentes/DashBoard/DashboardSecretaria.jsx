import React from 'react';
import './style/DashboardSecretaria.css';
import TarjetasResumen from './TarjetasResumen';
import GraficoBarras from './GraficoBarras';
import TablaRecientes from './TablaRecientes';
import Actividades from './Actividades';
import GraficoCircular from './GraficoCircular';

const DashboardSecretaria = () => {
  return (
    <div className="dashboard-secretaria">
      <div className="encabezado">
        <h1>Panel de Secretaría</h1>
        <p>Bienvenida, usuaria</p>
      </div>
      <TarjetasResumen />
      <div className="seccion-central">
        <GraficoBarras />
        <Actividades />
      </div>
      <div className="seccion-inferior">
        <TablaRecientes />
        <GraficoCircular />
      </div>
    </div>
  );
};

export default DashboardSecretaria;
