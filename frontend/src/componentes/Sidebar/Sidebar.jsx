import React from 'react';
import { FaBars, FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ abierto, toggleMenu, setVista, onCerrarSesion }) {
  const opciones = [
    { label: 'Dashboard', icon: <FaHome /> },
    { label: 'Buscar estudiante', icon: <FaUser /> },
    { label: 'Registrar observación', icon: '📝' },
    { label: 'Historial de Observaciones', icon: '📋' },
    { label: 'Agendar cita con acudiente', icon: '📅' },
    { label: 'Matricular estudiante', icon: '🎓' },
    { label: 'Notificaciones', icon: '🔔' },
    { label: 'Configuración', icon: '⚙️' },
    { label: 'Registrar profesor', icon: '👨‍🏫' },
    { label: 'Registrar secretaria', icon: '👩‍💼' },
    { label: 'Activar o desactivar usuario', icon: '🔓' },
    { label: 'Asignar grado a profesor', icon: '🏫' },
    { label: 'Registrar asistencia', icon: '✅' },
  ];

  return (
    <>
      {/* Botón hamburguesa SIEMPRE visible arriba */}
      <button className="toggle-btn" onClick={toggleMenu}>
        <FaBars />
      </button>

      <div className={`barra-lateral ${!abierto ? 'colapsada' : ''}`}>
        {/* 👤 avatar cuando está colapsado */}
        {!abierto && <div className="avatar-colapsado">👤</div>}

        {/* Texto Coordinador cuando está abierto */}
        <div className='text-center mb-3'>
        {abierto && <h4 className="mb-4 text-center">Coordinador</h4>}
        </div>
        {/* Lista de opciones */}
        <ul className="list-unstyled w-110">
          {opciones.map((op, index) => (
            <li key={index} className="mb-2">
              <button
                className={`btn btn-outline-light w-100 d-flex align-items-center border rounded sidebar-btn ${
                  !abierto ? 'centrado' : ''
                }`}
                onClick={() => setVista(op.label)}
              >
                <span className="me-2">{op.icon}</span>
                {abierto && <span>{op.label}</span>}
              </button>
            </li>
          ))}
        </ul>

        {/* Botón de cerrar sesión */}
        <div className="cerrar-sesion w-100">
          <hr />
          <button
            onClick={onCerrarSesion}
            className={`btn btn-outline-light w-100 d-flex align-items-center justify-content-center border rounded mt-3 ${
              !abierto ? 'centrado' : ''
            }`}
          >
            <FaSignOutAlt className="me-3" />
            {abierto && 'Cerrar sesión'}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
