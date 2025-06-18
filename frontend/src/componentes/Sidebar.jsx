import React from 'react';
import { FaBars } from 'react-icons/fa';
import '../App.css';

function Sidebar({ abierto, toggleMenu, setVista }) {
  const opciones = [
    'Dashboard',
    'Buscar estudiante',
    'Registrar observación',
    'Historial de Observaciones',
    'Agendar cita con acudiente',
    'Notificaciones',
    'Configuración',
    'Matricular estudiante',
    'Registrar profesor',
    'Registrar secretaria',
    'Asignar grado a profesor',
    'Activar o desactivar usuario',
    'Cerrar sesión',
  ];

  return (
    <div className={`barra-lateral ${abierto ? '' : 'colapsada'}`} style={{ width: abierto ? '250px' : '60px' }}>
      <button onClick={toggleMenu} className="btn btn-outline-light toggle-btn">
        <FaBars />
      </button>
      {abierto && (
        <>
          <h5>Panel administrativo<br />coordinador</h5>
          <ul className="nav flex-column mt-3">
            {opciones.map((text, i) => (
              <li className="nav-item" key={i}>
                <button
                  className="btn btn-link text-white nav-link text-start border m-1 w-100"
                  onClick={() => setVista(text)}
                >
                  {text}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Sidebar;
