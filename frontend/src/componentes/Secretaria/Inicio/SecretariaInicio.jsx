import React, { useState } from 'react';
import BarraLateralSecretaria from '../Menu/BarraLateralSecretaria';
import MatricularEstudiante from '../MatricularEstudiante/MatricularEstudiante'; 
import ResponderPQR from '../Pqr/ResponderPQR';

import './style/SecretariaInicio.css';
import {
  FaUsers,
  FaGraduationCap,
  FaCommentDots,
  FaBell,
  FaSearch,
  FaCogs,
} from 'react-icons/fa';
import { HiUserAdd } from "react-icons/hi";
import DashboardSecretaria from '../DashBoard/DashboardSecretaria';
import BuscarEstudiantes from '../Estudiantes/BuscarEstudiantes';
import NotificacionesSecretaria from '../Notificaciones/NotificacionesSecretaria';
import ConfiguracionSecretaria from '../Configuracion/ConfiguracionSecretaria';
import Header from '../headerSecretaria/Header';

const SecretariaInicio = () => {
  const [vista, setVista] = useState("inicio");

  return (
    <div className="layout-secretaria">
      
      <BarraLateralSecretaria setVista={setVista} />
      
      
      <div className="contenido-secretaria">
        {vista === "inicio" && (
          <div>
            <Header/>
            <div className='texto1'>
              <h2>Bienvenida, Secretaría</h2>
              <p>Panel principal del sistema escolar</p>
            </div>

            <div className="tarjetas-contenedor">
              <div className="tarjeta" onClick={() => setVista("Dashboard")}>
                <FaUsers className="iconoInicio" />
                <h3>Dashboard</h3>
                <p>Ver y gestionar los usuarios registrados</p>
              </div>

              <div className="tarjeta" onClick={() => setVista("estudiantes")}>
                <FaGraduationCap className="iconoInicio" />
                <h3>Estudiantes</h3>
                <p>Accede al listado y control de estudiantes</p>
              </div>

              

              <div className="tarjeta" onClick={() => setVista("notificaciones")}>
                <FaBell className="iconoInicio" />
                <h3>Notificaciones</h3>
                <p>Consulta avisos y recordatorios</p>
              </div>
              
              <div className="tarjeta" onClick={() => setVista("ResponderPQR")}>
                <FaSearch className="iconoInicio" />
                <h3>PQR</h3>
                <p>Ver y Responder PQR</p>
              </div>

              <div className="tarjeta" onClick={() => setVista("matriculas")}>
                <HiUserAdd className="iconoInicio" />
                <h3>Matricular Estudiante</h3>
                <p>Realizar matriculas de Estudiantes</p>
              </div>

              <div className="tarjeta" onClick={() => setVista("configuracion")}>
                <FaCogs className="iconoInicio" />
                <h3>Configuración</h3>
                <p>Modifica las preferencias del sistema</p>
              </div>
            </div>


            <div className="mensaje">
              Desde este panel puedes acceder rápidamente a las funciones esenciales del sistema escolar.
            </div>
          </div>
        )}
        {vista === "matriculas" && <MatricularEstudiante />}
        {vista === "ResponderPQR" && <ResponderPQR />}
        {vista === "Dashboard" && <DashboardSecretaria />}
        {vista === "estudiantes" && <BuscarEstudiantes />}
        {vista === "notificaciones" && <NotificacionesSecretaria />}
        {vista === "configuracion" && <ConfiguracionSecretaria/>}
      </div>
    </div>
  );
};

export default SecretariaInicio;
