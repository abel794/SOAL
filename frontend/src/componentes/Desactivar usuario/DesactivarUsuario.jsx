import React, { useState, useEffect } from 'react';
import './DesactivarUsuario.css';

export default function DesactivarUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error al cargar usuarios:', err));
  }, []);

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const handleFiltroEstado = (e) => {
    setEstadoFiltro(e.target.value);
  };

  const toggleEstado = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}/toggle-estado`, {
        method: 'PATCH'
      });

      const data = await res.json();

      if (res.ok) {
        setUsuarios(prev =>
          prev.map(u =>
            u.id === id ? { ...u, estado: data.estado === 1 ? 'Activo' : 'Inactivo' } : u
          )
        );

        setMensaje({
          tipo: 'exito',
          texto: `✅ Usuario ${data.estado === 1 ? 'activado' : 'desactivado'} correctamente.`
        });
      } else {
        setMensaje({
          tipo: 'error',
          texto: data.mensaje || '❌ Error al cambiar estado.'
        });
      }

      setTimeout(() => setMensaje(null), 2500);
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ tipo: 'error', texto: '❌ Error de conexión al servidor' });
      setTimeout(() => setMensaje(null), 2500);
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const coincideTexto =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.documento.includes(busqueda);
    const coincideEstado = estadoFiltro === 'Todos' || u.estado === estadoFiltro;
    return coincideTexto && coincideEstado;
  });

  return (
    <div className="desactivar-contenedor">
      <h2>Desactivar Usuario</h2>

      <div className="desactivar-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre o documento"
          value={busqueda}
          onChange={handleBusqueda}
        />
        <select value={estadoFiltro} onChange={handleFiltroEstado}>
          <option value="Todos">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      <div className="usuarios-lista">
        {usuariosFiltrados.map(u => (
          <div key={u.id} className="usuario-item">
            <div>
              <p><strong>{u.nombre}</strong> ({u.rol})</p>
              <p>Documento: {u.documento}</p>
            </div>

            <div className="switch-container">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={u.estado === 'Activo'}
                  onChange={() => toggleEstado(u.id)}
                />
                <span className="slider round"></span>
              </label>
              <span className={`estado-label ${u.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
                {u.estado}
              </span>
            </div>
          </div>
        ))}
      </div>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}
    </div>
  );
}
