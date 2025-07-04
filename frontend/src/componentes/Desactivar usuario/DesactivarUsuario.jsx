import React, { useState, useEffect } from 'react';
import './DesactivarUsuario.css';

const datosIniciales = [
  { id: 1, nombre: 'Laura Gómez', documento: '10203040', estado: 'Activo', rol: 'Profesor' },
  { id: 2, nombre: 'Carlos Ruiz', documento: '11223344', estado: 'Activo', rol: 'Secretaria' },
  { id: 3, nombre: 'Ana Torres', documento: '22334455', estado: 'Inactivo', rol: 'Coordinador' },
];

export default function DesactivarUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    // Aquí puedes hacer fetch al backend si deseas
    setUsuarios(datosIniciales);
  }, []);

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const handleFiltroEstado = (e) => {
    setEstadoFiltro(e.target.value);
  };

  const toggleEstado = (id) => {
    const actualizados = usuarios.map(u =>
      u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u
    );
    setUsuarios(actualizados);
    const actualizado = actualizados.find(u => u.id === id);
    setMensaje({
      tipo: 'exito',
      texto: `✅ Usuario ${actualizado.estado.toLowerCase()} correctamente.`,
    });
    setTimeout(() => setMensaje(null), 2500);
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
