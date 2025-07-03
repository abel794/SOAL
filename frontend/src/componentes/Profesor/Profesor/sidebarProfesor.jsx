import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

function SidebarProfesor({ setVista }) {
  const nombre = "Juan";

  return (
    <div className="d-flex flex-column justify-content-between bg-light p-3" style={{ width: '250px', height: '100vh' }}>
      <div>
        <div className="text-center mb-4">
          <div className="rounded-circle bg-primary mx-auto" style={{ width: '100px', height: '100px' }}></div>
          <h5 className="mt-3 fw-bold">Profesor</h5>
          <p>({nombre})</p>
          <p className="text-muted">Grado: 701</p>
        </div>

        <ul className="nav flex-column mb-3">
          <li className="nav-item">
            <button className="btn btn-outline-primary w-100 mb-2" onClick={() => setVista('Estudiantes')}>
              Estudiantes
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-outline-primary w-100 mb-2" onClick={() => setVista('Registrar Novedad')}>
              Registrar Novedad
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-outline-primary w-100 mb-2" onClick={() => setVista('Consultar Novedades')}>
              Consultar Novedades
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-outline-primary w-100 mb-2" onClick={() => setVista('Asistencias')}>
              Asistencias
            </button>
          </li>
        </ul>
      </div>

      <button className="btn btn-outline-danger w-100 mt-auto">
        <FaSignOutAlt className="me-2" /> Cerrar sesión
      </button>
    </div>
  );
}

export default SidebarProfesor;
