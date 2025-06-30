// src/componentes/Coordinador/PanelCoordinador.jsx
import React, { useState } from 'react';
import '../../App.css';
import ResumenObservaciones from '../ResumenObservaciones';
import Sidebar from '../Sidebar';
import UserHeader from '../UserHeader';
import DashboardCards from '../DashboardCards';
import TarjetasPorcentajes from '../TarjetasPorcentajes';
import TablaObservaciones from '../TablaObservaciones';
import BuscarEstudiante from '../BuscarEstudiante';
import RegistrarObservacion from '../registrarObservacion';
import HistorialObservaciones from '../historialObservaciones';
import AgendarCitaConAcudiente from '../Agendar_cita_con_acudiente';

function PanelCoordinador() {
  const [abierto, setAbierto] = useState(true);
  const [vista, setVista] = useState('Dashboard');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');

  const toggleMenu = () => setAbierto(!abierto);

  const renderContenido = () => {
    switch (vista) {
      case 'Buscar estudiante':
        return <BuscarEstudiante />;
      case 'Registrar observación':
        return (
          <RegistrarObservacion
            setVista={setVista}
            setEstudianteSeleccionado={setEstudianteSeleccionado}
          />
        );
      case 'Historial de Observaciones':
        return (
          <HistorialObservaciones nombre={estudianteSeleccionado} />
        );
      case 'Agendar cita con acudiente':
        return (
          <AgendarCitaConAcudiente nombre={estudianteSeleccionado} />
        );
      default:
        return (
          <>
            <UserHeader />
            <h1>Observador estudiantil</h1>
            <h3>Instituto Renato Descartes</h3>
            <div className="linea"></div>
            <DashboardCards />
            <ResumenObservaciones />
            <TablaObservaciones />
          </>
        );
    }
  };

  return (
    <div className="d-flex">
      <Sidebar abierto={abierto} toggleMenu={toggleMenu} setVista={setVista} />
      <div className="contenido-principal" style={{ marginLeft: abierto ? '250px' : '60px' }}>
        {renderContenido()}
      </div>
    </div>
  );
}

export default PanelCoordinador;
