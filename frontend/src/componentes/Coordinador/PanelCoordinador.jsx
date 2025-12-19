// src/componentes/Coordinador/PanelCoordinador.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';

import Sidebar from '../Coordinador/Sidebar/Sidebar';
import UserHeader from '../Coordinador/UserHeader/UserHeader';
import DashboardCards from './DashboardCards/DashboardCards';
import ResumenObservaciones from './ResumenObservaciones/ResumenObservaciones';
import TablaObservaciones from './TablaObservaciones/TablaObservaciones';
import BuscarEstudiante from './BuscarEstudiante/BuscarEstudiante';
import RegistrarObservacion from './registrarObservacion/registrarObservacion';
import HistorialObservaciones from './historialObservaciones/historialObservaciones';
import AgendarCitaConAcudiente from './Agendar_cita_con_acudiente/Agendar_cita_con_acudiente';
import MatricularEstudiante from './matricular estudiante/MatricularEstudiante';
import Notificaciones from './notificaciones/Notificaciones';
import Configuracion from './configuracion/Configuracion';
import RegistroProfesor from './RegistrProfesor/RegistroProfesor';
import RegistroSecretaria from './RegistrSecretaria/RegistroSecretaria';
import DesactivarUsuario from './Desactivar usuario/DesactivarUsuario';
import AsignarGradoProfesor from './AsignarGradoProfesor/AsignarGradoProfesor';
import RegistrarAsistencia from './RegistrarAsistencia/RegistrarAsistencia';
import CasosCriticos from './CasosCriticos';
import GradosYEstudiantes from './GradosYEstudiantes';
import VerCitas from './Agendar_cita_con_acudiente/VerCitas';
import ResponderPqr from './ResponderPQR/ResponderPQR';
import VerArchivos from './ver_archivos/ver_archivos.jsx'
import GradoObservaciones from './GradoObservaciones/GradoObservaciones.jsx'
import TotalObservaciones from './TotalObservaciones/TotalObservaciones.jsx'
import PromoverEstudiantes from './promocion_estudiante/PromoverEstudiantes.jsx';


import './PanelCoordinador.css';
import { useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../../utils/auth';
import useAutoLogout from '../Login/useAutoLogout';
import ProfesoresActivos from './ProfesoresActivos/ProfesoresActivos.jsx';

export default function PanelCoordinador() {
  
  
  const [vista, setVista] = useState('Dashboard');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const token = localStorage.getItem('token')

  const navigate = useNavigate();

  // 👉 Funciones de logout
  const handleRequestLogout = () => setShowLogoutModal(true);

  const ejecutarCerrarSesion = () => {
    setShowLogoutModal(false);
    cerrarSesion(navigate);
  };

  const cancelarCerrarSesion = () => setShowLogoutModal(false);

  // Auto logout por inactividad (10 minutos)
  useAutoLogout(() => cerrarSesion(navigate), 10 * 60 * 1000);

  

  // Detectamos si es móvil
  

  // Bloqueo de scroll y efecto blur cuando sidebar está abierto en móvil
  

  const WIDTH_OPEN = 280;
  const WIDTH_COLLAPSED = 70;

  const contenidoStyle = {
  marginLeft: 0,
  width: '100%',
  minHeight: '100vh',
  padding: 20
};


  const renderContenido = () => {
    switch (vista) {
      case "Profesores Activos":
        return <ProfesoresActivos />;
      case 'Buscar estudiante':
        return <BuscarEstudiante />;

      case 'Promover Estudiantes':
        return (
          <PromoverEstudiantes
            setVista={setVista}
            />);
      case 'Registrar observación':
        return (
          <RegistrarObservacion
            setVista={setVista}
            setEstudianteSeleccionado={setEstudianteSeleccionado}
          />
        );
      case 'Historial de Observaciones':
        return <HistorialObservaciones nombre={estudianteSeleccionado} token={token}/>;
      case 'Agendar cita con acudiente':
        return (
          <AgendarCitaConAcudiente
            setVista={setVista}
            nombre={estudianteSeleccionado}
          />
        );
      case 'Total Observaciones':
        return <TotalObservaciones 
        setVista={setVista}/>;
      case 'Matricular estudiante':
        return <MatricularEstudiante 
        setVista={setVista}/>;
      case 'Grado Mas Observaciones':
        return <GradoObservaciones 
        setVista={setVista}/>;
      case 'Matricular':
        return <MatricularEstudiante 
        setVista={setVista}/>;
      case 'Notificaciones':
        return <Notificaciones 
        setVista={setVista}/>;
      case 'Configuración':
        return <Configuracion 
        setVista={setVista}/>;
      case 'Registrar profesor':
        return <RegistroProfesor 
        setVista={setVista}/>;
      case 'Registrar secretaria':
        return <RegistroSecretaria 
        setVista={setVista}/>;
      case 'Activar o desactivar usuario':
        return <DesactivarUsuario 
        setVista={setVista}/>;
      case 'Asignar grado a profesor':
        return <AsignarGradoProfesor 
        setVista={setVista}/>;
      case 'Registrar asistencia':
        return <RegistrarAsistencia 
        setVista={setVista}/>;
      case 'Casos críticos':
        return <CasosCriticos 
        setVista={setVista}/>;
      case 'Grados y estudiantes':
        return <GradosYEstudiantes 
        setVista={setVista}/>;
      case 'Ver archivos':
        return <VerArchivos 
        setVista={setVista}/>;
      case 'Ver citas':
        return (
          <VerCitas
            setVista={setVista}
            setCitaSeleccionada={setCitaSeleccionada}
          />
        );
      case 'Responder PQR':
        return <ResponderPqr 
        setVista={setVista}/>;
      case 'Detalle de Cita':
        return (
          <div className="container mt-4">
            <h2 className="text-primary">📌 Detalle de la cita</h2>
            <hr />
            {citaSeleccionada ? (
              <div className="card p-3 shadow-sm">
                <p>
                  <strong>Estudiante:</strong>{' '}
                  {citaSeleccionada.estudiante?.persona?.nombre}{' '}
                  {citaSeleccionada.estudiante?.persona?.apellido}
                </p>
                <p>
                  <strong>Acudiente:</strong>{' '}
                  {citaSeleccionada.acudiente?.persona?.nombre}{' '}
                  {citaSeleccionada.acudiente?.persona?.apellido}
                </p>
                <p>
                  <strong>Funcionario:</strong>{' '}
                  {citaSeleccionada.funcionario?.usuario?.usuario}
                </p>
                <p>
                  <strong>Fecha:</strong>{' '}
                  {new Date(citaSeleccionada.fecha_cita).toLocaleString()}
                </p>
                <p>
                  <strong>Motivo:</strong> {citaSeleccionada.motivo}
                </p>
                <button
                  className="btn btn-secondary mt-3"
                  onClick={() => setVista('Ver citas')}
                >
                  🔙 Volver
                </button>
              </div>
            ) : (
              <p>No se ha seleccionado ninguna cita.</p>
            )}
          </div>
        );
      default:
        return (
          <>
            <UserHeader 
            onActionSelect={setVista} 
            onCerrarSesion={handleRequestLogout}
            />

            <div className="cards-panel mt-4">
              <h1 className="mb-1">Observador estudiantil</h1>
              <h4 className="text-muted mb-3">
                Instituto Renato Descartes
              </h4>
              <DashboardCards setVista={setVista} />
              <ResumenObservaciones />
              <TablaObservaciones setVista={setVista}/>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div
        className="panel-coordinador"
        style={{ minHeight: '100vh', background: '#f6f7fb' }}
      >
        

        {/* Añadimos una clase condicional para el efecto blur */}
        <main className="contenido-principal" style={contenidoStyle}>

          {renderContenido()}
        </main>
      </div>

      {/* ✅ Modal de confirmación estilizado */}
      {showLogoutModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg rounded-3 animate__animated animate__zoomIn">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Confirmar cierre de sesión
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={cancelarCerrarSesion}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p className="mb-3 fs-5">
                  ¿Estás seguro que deseas{' '}
                  <strong>cerrar tu sesión</strong>?
                </p>
                <small className="text-muted">
                  Si cierras sesión, tendrás que iniciar nuevamente para
                  acceder al sistema.
                </small>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={cancelarCerrarSesion}
                >
                  No, quedarme
                </button>
                <button
                  className="btn btn-danger px-4"
                  onClick={ejecutarCerrarSesion}
                >
                  Sí, cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}