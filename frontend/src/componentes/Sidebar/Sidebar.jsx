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
      {/* Botón para abrir/cerrar menú (si está colapsado) */}
      <button className="toggle-btn" onClick={toggleMenu}>
        <FaBars />
      </button>

      <div className={`barra-lateral ${!abierto ? 'colapsada' : ''}`}>
        <h4 className="mb-4">{abierto ? 'Coordinador' : '👤'}</h4>
        <ul className="list-unstyled">
          {opciones.map((op, index) => (
            <li
              key={index}
              style={{ margin: '10px 0', cursor: 'pointer' }}
              onClick={() => setVista(op.label)}
            >
              <span style={{ marginRight: '10px' }}>{op.icon}</span>
              {abierto && op.label}
            </li>
          ))}
        </ul>

        <hr />
        <button
          onClick={onCerrarSesion}
          className="btn btn-light mt-3"
          style={{ width: '100%' }}
        >
          <FaSignOutAlt /> {abierto && 'Cerrar sesión'}
        </button>
      </div>
    </>
  );
}

export default Sidebar;
