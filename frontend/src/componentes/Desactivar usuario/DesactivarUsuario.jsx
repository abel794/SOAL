import React, { useEffect, useState } from 'react';
import './DesactivarUsuario.css';

const DesactivarUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/usuarios');
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setUsuarios(
          data.map(u => ({
            ...u,
            estado: u.id_estado_usuario === 1 ? 'Activo' : 'Inactivo'
          }))
        );
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
        setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los usuarios.' });
        setTimeout(() => setMensaje(null), 2500);
      }
    };
    fetchUsuarios();
  }, []);

  const toggleEstado = async (id_usuario) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${id_usuario}/toggle-estado`,
        { method: 'PATCH' }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { mensaje: msg, estado } = await res.json();
      setUsuarios(prev =>
        prev.map(u =>
          u.id_usuario === id_usuario
            ? { ...u, id_estado_usuario: estado, estado: estado === 1 ? 'Activo' : 'Inactivo' }
            : u
        )
      );
      setMensaje({ tipo: 'exito', texto: msg });
    } catch (err) {
      console.error('Error en toggleEstado:', err);
      setMensaje({ tipo: 'error', texto: 'No se pudo cambiar el estado.' });
    } finally {
      setTimeout(() => setMensaje(null), 2500);
    }
  };

  return (
    <div className="contenedor">
      <h2>Gestión de Estado de Usuarios</h2>

      {mensaje && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Documento</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id_usuario}>
              <td>{u.username}</td>
              <td>{u.numero_documento || 'N/A'}</td>
              <td>{u.estado}</td>
              <td>
                {/* Toggle switch personalizado */}
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={u.estado === 'Activo'}
                    onChange={() => toggleEstado(u.id_usuario)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesactivarUsuario;
