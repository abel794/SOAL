import React, { useState, useEffect } from 'react';
import './App.css';
import './componentes/Secretaria/Secretaria.css';
import Sidebar from './componentes/Sidebar';
import UserHeader from './componentes/UserHeader';
import DashboardCards from './componentes/DashboardCards';
import TarjetasPorcentajes from './componentes/TarjetasPorcentajes';
import TablaObservaciones from './componentes/TablaObservaciones';
import BuscarEstudiante from './componentes/BuscarEstudiante';
import RegistrarObservacion from './componentes/registrarObservacion';
//componentes Secretaria
import { EncabezadoDeRegistro, SeleccionTipoUsuario, FormularioRegistro,  ListaUsuarios, BotonContinuar } from './componentes/Secretaria';

function App() {
  const [abierto, setAbierto] = useState(true);
  const [vista, setVista] = useState('Dashboard');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [paso, setPaso] = useState(1);
  const [usuarios, setUsuarios] = useState([]);
  
  const toggleMenu = () => setAbierto(!abierto);
  const avanzarPaso = () => setPaso(paso + 1);
  const retrocederPaso = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    } else {
      setVista('SeleccionTipoUsuario'); 
    }
  };



  const agregarUsuario = (nuevoUsuario) => {
    fetch('http://localhost:5000/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoUsuario),
    })
      .then(() => {
        setUsuarios([...usuarios, nuevoUsuario]);
        setVista('ListaUsuarios');
      })
      .catch((error) => console.error('Error al agregar usuario:', error));
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
      case 'Matricular estudiante':
        return (
            <>
              <EncabezadoDeRegistro />
              {!tipoUsuario ? (
                <SeleccionTipoUsuario onSelect={setTipoUsuario} />
              ) : (
                <>
                  <FormularioRegistro tipoUsuario={tipoUsuario} actualizarDatos={setUsuarios} />
                  <BotonContinuar avanzarPaso={avanzarPaso} retrocederPaso={retrocederPaso} />
                </>
              )}
            </>
          );
         case 'ListaUsuarios':
        return <ListaUsuarios usuarios={usuarios} />;
      default:
        return (
          <>
            <UserHeader />
            <h1>Observador estudiantil</h1>
            <h3>Instituto Renato Descartes</h3>
            <div className="linea"></div>
            <DashboardCards />
            <TarjetasPorcentajes />
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
