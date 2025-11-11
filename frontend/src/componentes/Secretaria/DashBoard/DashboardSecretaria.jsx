import React from 'react';
import './style/DashboardSecretaria.css';
import TarjetasResumen from './TarjetasResumen';
import GraficoBarras from './GraficoBarras';
import TablaRecientes from './TablaRecientes';
import GraficoCircular from './GraficoCircular';

const DashboardSecretaria = () => {
  return (
    <div className="contenedor-dashboard">
      <div className="dashboard-secretaria">
        <br />
        <br />
        <h2 className="titulo-dashboard"> 📊Panel de Secretaría</h2>
        <TarjetasResumen />
        <div className="seccion-central">
          <GraficoBarras />
        </div>
        <div className="seccion-inferior">
          <TablaRecientes />
          <GraficoCircular />
        </div>
      </div>
    </div>
  );
};

export default DashboardSecretaria;
