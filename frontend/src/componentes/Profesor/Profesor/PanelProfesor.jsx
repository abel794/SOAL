import React, { useState } from 'react';
import SidebarProfesor from './sidebarProfesor';
import Estudiantes from './EstudiantesProfesor';
import Asistencia from './Asistencia';
import RegistrarNovedad from './RegistrarNovedad';


function PanelProfesor() {
  const [vista, setVista] = useState('Estudiantes');

  const renderVista = () => {
    switch (vista) {
      case 'Estudiantes':
        return <Estudiantes />;
      case 'Registrar Novedad':
        return <RegistrarNovedad />;

      case 'Consultar Novedades':
        return <div className="p-4">Aquí se mostrarán las novedades registradas.</div>;
      case 'Asistencias':
        return <Asistencia />; 
      default:
        return <div className="p-4">Seleccione una opción.</div>;
    }
  };

  return (
    <div className="d-flex">
      <SidebarProfesor setVista={setVista} />
      <div className="flex-grow-1 p-4">{renderVista()}</div>
    </div>
  );
}

export default PanelProfesor;
