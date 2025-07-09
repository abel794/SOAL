// src/componentes/Coordinador/PanelCoordinador.jsx
import React, { useState } from 'react';
import './PanelCoordinador.css';



// Componentes
import Sidebar from '../Sidebar/Sidebar';
import UserHeader from '../UserHeader/UserHeader';
import DashboardCards from '../DashboardCards/DashboardCards';
import ResumenObservaciones from '../ResumenObservaciones/ResumenObservaciones';
import TablaObservaciones from '../TablaObservaciones/TablaObservaciones';
import BuscarEstudiante from '../BuscarEstudiante/BuscarEstudiante';
import RegistrarObservacion from '../registrarObservacion/registrarObservacion';
import HistorialObservaciones from '../historialObservaciones/historialObservaciones';
import AgendarCitaConAcudiente from '../Agendar_cita_con_acudiente/Agendar_cita_con_acudiente';
import MatricularEstudiante from '../matricular estudiante/MatricularEstudiante';
import Notificaciones from '../notificaciones/Notificaciones';
import Configuracion from '../configuracion/Configuracion';
import RegistroProfesor from '../RegistrProfesor/RegistroProfesor';
import RegistroSecretaria from '../RegistrSecretaria/RegistroSecretaria';
import DesactivarUsuario from '../Desactivar usuario/DesactivarUsuario';
import AsignarGradoProfesor from '../AsignarGradoProfesor/AsignarGradoProfesor';
import RegistrarAsistencia from '../RegistrarAsistencia/RegistrarAsistencia';
import ModalCerrarSesion from './ModalCerrarSesion'; // ✅ CORRECTO


function PanelCoordinador() {
  const [abierto, setAbierto] = useState(true);
  const [vista, setVista] = useState('Dashboard');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
  const [mostrarModalCerrarSesion, setMostrarModalCerrarSesion] = useState(false);

  const toggleMenu = () => setAbierto(!abierto);

  const manejarCerrarSesion = () => {
    setMostrarModalCerrarSesion(true);
  };

  const confirmarCerrarSesion = () => {
    // Aquí puedes limpiar sesión o redirigir
    window.location.href = '/login';
  };

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
        return <HistorialObservaciones nombre={estudianteSeleccionado} />;
      case 'Agendar cita con acudiente':
        return <AgendarCitaConAcudiente nombre={estudianteSeleccionado} />;
      case 'Matricular estudiante':
        return <MatricularEstudiante />;
      case 'Notificaciones':
        return <Notificaciones />;
      case 'Configuración':
        return <Configuracion />;
      case 'Registrar profesor':
        return <RegistroProfesor />;
      case 'Registrar secretaria':
        return <RegistroSecretaria />;
      case 'Activar o desactivar usuario':
        return <DesactivarUsuario />;
      case 'Asignar grado a profesor':
        return <AsignarGradoProfesor />;
      case 'Registrar asistencia':
        return <RegistrarAsistencia />;
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
      <Sidebar
        abierto={abierto}
        toggleMenu={toggleMenu}
        setVista={setVista}
        onCerrarSesion={manejarCerrarSesion}
      />
      <div className="contenido-principal" style={{ marginLeft: abierto ? '250px' : '60px' }}>
        {renderContenido()}
      </div>

      {mostrarModalCerrarSesion && (
        <ModalCerrarSesion
          onConfirmar={confirmarCerrarSesion}
          onCancelar={() => setMostrarModalCerrarSesion(false)}
        />
      )}
    </div>
  );
}

export default PanelCoordinador;
