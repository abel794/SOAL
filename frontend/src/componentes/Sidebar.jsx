import React from 'react';
import { FaBars } from 'react-icons/fa';
import '../App.css'; // ✅ Asegúrate de que App.css esté dentro de src/

function Sidebar({ abierto, toggleMenu, setVista, onCerrarSesion }) {
  const opciones = [
    { label: 'Dashboard', icono: '🏠' },
    { label: 'Buscar estudiante', icono: '🔍' },
    { label: 'Registrar asistencia', icono: '📘' },
    { label: 'Registrar observación', icono: '📝' },
    { label: 'Historial de Observaciones', icono: '📖' },
    { label: 'Agendar cita con acudiente', icono: '📆' },
    { label: 'Notificaciones', icono: '🔔' },
    { label: 'Configuración', icono: '⚙️' },
    { label: 'Matricular estudiante', icono: '🎓' },
    { label: 'Registrar profesor', icono: '👨‍🏫' },
    { label: 'Registrar secretaria', icono: '💼' },
    { label: 'Asignar grado a profesor', icono: '🏫' },
    { label: 'Activar o desactivar usuario', icono: '🟢/🔴' },
    { label: 'Cerrar sesión', icono: '🚪' },
  ];

  const manejarClick = (label) => {
    if (label === 'Cerrar sesión') {
      onCerrarSesion();
    } else {
      setVista(label);
    }
  };

  return (
    <div className={`barra-lateral ${abierto ? '' : 'colapsada'}`} style={{ width: abierto ? '250px' : '60px' }}>
      <button onClick={toggleMenu} className="btn btn-outline-light toggle-btn" title="Mostrar/ocultar menú">
        <FaBars />
      </button>

      {abierto && (
        <>
          <h5 className="text-white mt-3">
            Panel administrativo<br />coordinador
          </h5>
          <ul className="nav flex-column mt-3">
            {opciones.map((op, i) => (
              <li className="nav-item" key={i}>
                <button
                  className="btn btn-link text-white nav-link text-start border m-1 w-100"
                  onClick={() => manejarClick(op.label)}
                >
                  <span style={{ marginRight: '8px' }}>{op.icono}</span> {op.label}
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
