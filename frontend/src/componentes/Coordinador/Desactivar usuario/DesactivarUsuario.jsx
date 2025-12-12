import React, { useEffect, useState, useRef, useCallback } from 'react';
import './DesactivarUsuario.css';
import ModalMensaje from "../../ui/ModalMensaje";

const API_BASE = 'http://localhost:3000/api';

const DesactivarUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [clientSideMode, setClientSideMode] = useState(false);
  const allUsuariosRef = useRef([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  // Mostrar mensaje optimizado con useCallback
  const mostrarMensaje = useCallback((tipo, texto, duracion = 2500) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), duracion);
  }, []);

  // Transformar estado optimizado
  const formatearEstado = useCallback((u) =>
    typeof u.id_estado_usuario !== 'undefined'
      ? (u.id_estado_usuario === 1 ? 'Activo' : 'Inactivo')
      : (u.estado === true || u.estado === 'Activo' ? 'Activo' : 'Inactivo'), []);

  // Fetch usuarios optimizado
  const fetchUsuarios = useCallback(async (filtroParam = '', paginaParam = 1, pageSizeParam = pageSize) => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/usuarios?filtro=${encodeURIComponent(filtroParam)}&pagina=${paginaParam}&pageSize=${pageSizeParam}`;
      const res = await fetch(url);

      if (res.status === 423) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.mensaje || 'Recurso bloqueado (423).');
      }

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data) || (data && data.usuarios)) {
        const lista = Array.isArray(data) ? data : data.usuarios;
        const totalFromServer = data.totalPaginas ?? data.total ?? data.totalCount ?? null;

        if (!totalFromServer) {
          allUsuariosRef.current = lista;
          setClientSideMode(true);
          aplicarPaginacionClientSide(lista, paginaParam, pageSizeParam, filtroParam);
        } else {
          setClientSideMode(false);
          setUsuarios(lista.map(u => ({ ...u, estado: formatearEstado(u) })));
          setTotalPaginas(Number(totalFromServer) || 1);
        }
      } else {
        setUsuarios([]);
        setTotalPaginas(1);
      }
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      mostrarMensaje('error', err.message || 'No se pudieron cargar los usuarios.');
      setUsuarios([]);
      setTotalPaginas(1);
    } finally {
      setLoading(false);
    }
  }, [pageSize, formatearEstado, mostrarMensaje]);

  // Paginación lado cliente optimizada
  const aplicarPaginacionClientSide = useCallback((lista, paginaParam = 1, pageSizeParam = 10, filtroParam = filtro) => {
    const filtroLower = (filtroParam || '').trim().toLowerCase();
    let filtrados = lista;
    if (filtroLower) {
      filtrados = lista.filter(u =>
        (u.username || '').toLowerCase().includes(filtroLower) ||
        (u.numero_documento || '').toLowerCase().includes(filtroLower)
      );
    }

    const total = filtrados.length;
    const paginasCalc = Math.max(1, Math.ceil(total / pageSizeParam));
    const inicio = (paginaParam - 1) * pageSizeParam;
    const pageSlice = filtrados.slice(inicio, inicio + pageSizeParam);

    setUsuarios(pageSlice.map(u => ({ ...u, estado: formatearEstado(u) })));
    setTotalPaginas(paginasCalc);
  }, [filtro, formatearEstado]);

  // Efecto inicial
  useEffect(() => {
    fetchUsuarios('', 1, pageSize);
  }, [fetchUsuarios, pageSize]);

  // Búsqueda y cambios optimizados
  const handleBuscar = useCallback(() => {
    setPagina(1);
    if (clientSideMode) {
      aplicarPaginacionClientSide(allUsuariosRef.current, 1, pageSize, filtro);
    } else {
      fetchUsuarios(filtro, 1, pageSize);
    }
  }, [clientSideMode, aplicarPaginacionClientSide, pageSize, filtro, fetchUsuarios]);

  const cambiarPagina = useCallback((nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPagina(nuevaPagina);
    if (clientSideMode) {
      aplicarPaginacionClientSide(allUsuariosRef.current, nuevaPagina, pageSize, filtro);
    } else {
      fetchUsuarios(filtro, nuevaPagina, pageSize);
    }
  }, [totalPaginas, clientSideMode, aplicarPaginacionClientSide, pageSize, filtro, fetchUsuarios]);

  const cambiarPageSize = useCallback((nuevoSize) => {
    setPageSize(nuevoSize);
    setPagina(1);
    if (clientSideMode) {
      aplicarPaginacionClientSide(allUsuariosRef.current, 1, nuevoSize, filtro);
    } else {
      fetchUsuarios(filtro, 1, nuevoSize);
    }
  }, [clientSideMode, aplicarPaginacionClientSide, filtro, fetchUsuarios]);

  // Toggle estado optimizado
  const toggleEstado = async (id_usuario) => {
    const snapshot = [...usuarios];
    const index = usuarios.findIndex(u => u.id_usuario === id_usuario);
    if (index === -1) return;

    const nuevoEstadoNum = usuarios[index].estado === 'Activo' ? 0 : 1;
    setUsuarios(prev =>
      prev.map(u =>
        u.id_usuario === id_usuario
          ? { ...u, id_estado_usuario: nuevoEstadoNum, estado: nuevoEstadoNum === 1 ? 'Activo' : 'Inactivo' }
          : u
      )
    );

    try {
      const res = await fetch(`${API_BASE}/usuarios/${id_usuario}/toggle-estado`, { method: 'PATCH' });
      if (res.status === 423) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.mensaje || 'Recurso bloqueado (423).');
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const body = await res.json();
      const newEstadoFromServer = (body && (body.estado ?? body.id_estado_usuario)) ?? nuevoEstadoNum;

      setUsuarios(prev =>
        prev.map(u =>
          u.id_usuario === id_usuario
            ? { ...u, id_estado_usuario: Number(newEstadoFromServer), estado: Number(newEstadoFromServer) === 1 ? 'Activo' : 'Inactivo' }
            : u
        )
      );

      mostrarMensaje('exito', body?.mensaje ?? 'Estado actualizado');
    } catch (err) {
      console.error('Error en toggleEstado:', err);
      setUsuarios(snapshot);
      mostrarMensaje('error', err.message || 'No se pudo cambiar el estado.');
    }
  };

  // Paginación visible optimizada para móvil
  const getVisiblePages = useCallback(() => {
    if (totalPaginas <= 5) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    }

    const maxVisible = window.innerWidth < 768 ? 3 : 5;
    let start = Math.max(1, pagina - Math.floor(maxVisible / 2));
    let end = Math.min(totalPaginas, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [pagina, totalPaginas]);

  // Manejo de teclado en búsqueda
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  }, [handleBuscar]);

  return (
    <div className="contenedor">
      <h2>Gestión de Estado de Usuarios</h2>

      {mensaje && <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>}
      {loading && <div className="mensaje info">Cargando usuarios...</div>}

      {/* CONTROLES SUPERIORES */}
      <div className="controles-superiores">
        <div className="busqueda-container">
          <div className="input-busqueda">
            <input
              type="text"
              placeholder="Buscar por nombre o documento"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Buscar usuario"
              disabled={loading}
            />
            <button
              className="btn btn-buscar"
              onClick={handleBuscar}
              disabled={loading}
              aria-label="Buscar"
            >
              <span className="icono-busqueda">🔍</span>
              <span className="texto-busqueda">Buscar</span>
            </button>
          </div>
        </div>

        <div className="controles-derecha">
          <label htmlFor="pageSizeSelect" className="label-paginacion">Mostrar:</label>
          <select 
            id="pageSizeSelect" 
            value={pageSize} 
            onChange={e => cambiarPageSize(Number(e.target.value))} 
            disabled={loading}
            aria-label="Cantidad de elementos por página"
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* TABLA RESPONSIVE */}
      <div className="tabla-container">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th className="col-usuario">Usuario</th>
              <th className="col-documento">Documento</th>
              <th className="col-estado">Estado</th>
              <th className="col-accion">Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? usuarios.map(u => (
              <tr key={u.id_usuario ?? u.numero_documento ?? u.username}>
                <td className="col-usuario" data-label="Usuario">{u.username || u.nombre || '—'}</td>
                <td className="col-documento" data-label="Documento">{u.numero_documento || u.documento || 'N/A'}</td>
                <td className="col-estado" data-label="Estado">
                  <span className={`badge-estado ${u.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
                    {u.estado}
                  </span>
                </td>
                <td className="col-accion" data-label="Acción">
                  <label className="switch" aria-label={`Cambiar estado de ${u.username}`}>
                    <input
                      type="checkbox"
                      checked={u.estado === 'Activo'}
                      onChange={() => toggleEstado(u.id_usuario)}
                      disabled={loading}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="sin-resultados">
                  {loading ? 'Cargando...' : 'No se encontraron usuarios'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN RESPONSIVE */}
      <div className="paginacion-container">
        <div className="paginacion-info">
          Página {pagina} de {totalPaginas}
        </div>
        <div className="paginacion-botones ">
          <button 
            onClick={() => cambiarPagina(1)} 
            disabled={pagina === 1 || loading}
            aria-label="Primera página"
          >
            ««
          </button>
          <button 
            onClick={() => cambiarPagina(pagina - 1)} 
            disabled={pagina === 1 || loading}
            aria-label="Página anterior"
          >
            ‹
          </button>
          
          {getVisiblePages().map(num => (
            <button
  key={num}
  style={{
    backgroundColor: pagina === num ? '#004aad' : '#f5f5f5',
    color: pagina === num ? 'white' : '#333',
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '6px 12px',
    margin: '0 4px',
    cursor: 'pointer',
    fontWeight: pagina === num ? '600' : 'normal',
  }}
  onClick={() => cambiarPagina(num)}
  disabled={loading}
>
  {num}
</button>

          ))}
          
          <button 
            onClick={() => cambiarPagina(pagina + 1)} 
            disabled={pagina === totalPaginas || loading}
            aria-label="Página siguiente"
          >
            ›
          </button>
          <button 
            onClick={() => cambiarPagina(totalPaginas)} 
            disabled={pagina === totalPaginas || loading}
            aria-label="Última página"
          >
            »»
          </button>
        </div>
      </div>

      {/* MODALES */}
      <ModalMensaje
        visible={showConfirm}
        tipo="confirmacion"
        titulo="Confirmación"
        mensaje={confirmMessage}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {}}
      />

      {mensaje && (
        <ModalMensaje
          visible
          tipo={mensaje.tipo}
          titulo="Notificación"
          mensaje={mensaje.texto}
          onClose={() => { setMensaje(null); setUsuarioGenerado(null); }}
        />
      )}
    </div>
  );
};

export default DesactivarUsuario;