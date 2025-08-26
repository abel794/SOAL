// frontend/src/Profesor/PanelProfesor.jsx
import React, { useState, useEffect } from 'react';
import ListaEstudiantes from './ListaEstudiantes';
import axios from 'axios';

const PanelProfesor = () => {
  const [profesor, setProfesor] = useState({});
  const [funcionSeleccionada, setFuncionSeleccionada] = useState('estudiantes');

  useEffect(() => {
    // Obtenemos los datos del profesor desde localStorage o una API
    const fetchProfesor = async () => {
      try {
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (usuario) {
          setProfesor({
            nombre: usuario.username,
            id_funcionario: usuario.id_funcionario,
            id_tipo_usuario: usuario.id_tipo_usuario
          });
        }
      } catch (error) {
        console.error("Error cargando datos del profesor:", error);
      }
    };

    fetchProfesor();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <h2>👨‍🏫 Profesor</h2>
        <p><strong>Nombre:</strong> {profesor.nombre}</p>
        <p><strong>ID:</strong> {profesor.id_funcionario}</p>
        <hr />
        <button 
          onClick={() => setFuncionSeleccionada('estudiantes')} 
          style={{ display: 'block', margin: '10px 0', padding: '5px' }}
        >
          Mis Estudiantes
        </button>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, padding: '20px' }}>
        {funcionSeleccionada === 'estudiantes' && <ListaEstudiantes />}
      </div>
    </div>
  );
};

export default PanelProfesor;
