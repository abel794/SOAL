import React, { useState } from 'react';
import './App.css';
import ResumenObservaciones from './componentes/ResumenObservaciones';
import Sidebar from './componentes/Sidebar';
import UserHeader from './componentes/UserHeader';
import DashboardCards from './componentes/DashboardCards';
import TarjetasPorcentajes from './componentes/TarjetasPorcentajes';
import TablaObservaciones from './componentes/TablaObservaciones';
import BuscarEstudiante from './componentes/BuscarEstudiante';
import RegistrarObservacion from './componentes/registrarObservacion';
import HistorialObservaciones from './componentes/historialObservaciones'; // ✅ Corrige nombre

function App() {
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

export default App;
