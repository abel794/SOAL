import React, { useEffect, useState, useCallback } from 'react';
import './AsignarGrado.css';
import ModalMensaje from '../../ui/ModalMensaje';

export default function AsignarGradoProfesor() {
  const [term, setTerm] = useState('');
  const [profesor, setProfesor] = useState(null);
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [loadingBuscar, setLoadingBuscar] = useState(false);
  const [loadingAsignar, setLoadingAsignar] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [confirmarAsignacion, setConfirmarAsignacion] = useState(false);
  const [historialAsignaciones, setHistorialAsignaciones] = useState([]);

  // 🔔 Mostrar mensaje temporal con ModalMensaje
  const mostrarMensaje = useCallback((tipo, texto, duracion = 3000) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), duracion);
  }, []);

  // 📦 Cargar lista de grados
  useEffect(() => {
    const cargarGrados = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/grado`);
        if (!response.ok) throw new Error('Error al cargar grados');
        const data = await response.json();
        setGrados(data);
      } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('error', 'No se pudieron cargar los grados.');
      }
    };

    cargarGrados();
  }, [mostrarMensaje]);

  // 🔍 Buscar profesor por cédula o nombre
  const buscarProfesor = useCallback(async () => {
    const q = term.trim();
    if (!q) {
      mostrarMensaje('advertencia', 'Ingresa un nombre o documento para buscar.');
      return;
    }

    setLoadingBuscar(true);
    setProfesor(null);
    setGradoSeleccionado('');

    try {
      // Intentar buscar por cédula primero
      let res = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/funcionario/cedula/${q}`);
      if (res.ok) {
        const data = await res.json();
        setProfesor(data);
        cargarHistorialAsignaciones(data.id_funcionario);
        mostrarMensaje('exito', `Profesor encontrado: ${data.persona?.nombre} ${data.persona?.apellido}`);
        return;
      }

      // Si no encuentra por cédula, buscar por nombre
      res = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/funcionario/buscar?nombre=${encodeURIComponent(q)}`);
      if (res.ok) {
        const { data } = await res.json();
        const profesorEncontrado = data.find(f => 
          f.cargo?.toLowerCase().includes('profesor') || 
          f.cargo?.toLowerCase().includes('docente')
        );
        
        if (profesorEncontrado) {
          setProfesor(profesorEncontrado);
          cargarHistorialAsignaciones(profesorEncontrado.id_funcionario);
          mostrarMensaje('exito', `Profesor encontrado: ${profesorEncontrado.persona?.nombre} ${profesorEncontrado.persona?.apellido}`);
          return;
        }
      }

      mostrarMensaje('info', 'No se encontró ningún profesor con ese nombre o documento.');
    } catch (err) {
      console.error('Error al buscar profesor:', err);
      mostrarMensaje('error', 'No se pudo conectar con el servidor.');
    } finally {
      setLoadingBuscar(false);
    }
  }, [term, mostrarMensaje]);

  // 📋 Cargar historial de asignaciones del profesor
  const cargarHistorialAsignaciones = async (idFuncionario) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/funcionario/${idFuncionario}/grados-asignados`);
      if (res.ok) {
        const data = await res.json();
        setHistorialAsignaciones(data || []);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
      setHistorialAsignaciones([]);
    }
  };

  // 🎯 Asignar el grado al profesor
  const asignarGrado = useCallback(async () => {
    if (!profesor || !gradoSeleccionado) {
      mostrarMensaje('advertencia', 'Selecciona un profesor y un grado antes de continuar.');
      return;
    }

    try {
      setLoadingAsignar(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/funcionario/asignar-grado`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id_funcionario: profesor.id_funcionario,
          id_grado: parseInt(gradoSeleccionado)
        })
      });

      const data = await res.json();

      if (res.ok) {
        mostrarMensaje('exito', '✅ La asignación se realizó correctamente.');
        setGradoSeleccionado('');
        setProfesor(null);
        setTerm('');
        setHistorialAsignaciones([]);
      } else {
        throw new Error(data.mensaje || 'Error en la asignación');
      }
    } catch (error) {
      console.error('Error al asignar grado:', error);
      mostrarMensaje('error', error.message || 'No se pudo asignar el grado.');
    } finally {
      setLoadingAsignar(false);
    }
  }, [profesor, gradoSeleccionado, mostrarMensaje]);

  // Manejar tecla Enter en la búsqueda
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      buscarProfesor();
    }
  }, [buscarProfesor]);

  // Obtener nombre del grado seleccionado
  const getNombreGradoSeleccionado = () => {
    const grado = grados.find(g => g.id_grado === parseInt(gradoSeleccionado));
    return grado ? (grado.nombre_grado || grado.nombre) : '';
  };

  return (
    <div className="asignar-container">
      <div className="asignar-card">
        <div className="card-header">
          <h1 className="titulo-principal">🎓 Asignar Grado a Profesor</h1>
          <p className="subtitulo">Busca un profesor y asígnale un grado académico</p>
        </div>

        {/* 🔍 Sección de Búsqueda */}
        <div className="seccion-busqueda">
          <div className="busqueda-container">
            <input
              type="text"
              className="input-buscar"
              placeholder="🔍 Ingresa documento o nombre del profesor..."
              value={term}
              onChange={e => setTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loadingBuscar}
            />
            <button
              className="btn-buscar"
              onClick={buscarProfesor}
              disabled={loadingBuscar || !term.trim()}
            >
              {loadingBuscar ? (
                <>
                  <span className="spinner"></span>
                  Buscando...
                </>
              ) : (
                'Buscar Profesor'
              )}
            </button>
          </div>
        </div>

        {/* 👨‍🏫 Información del Profesor Encontrado */}
        {profesor && (
          <div className="profesor-section">
            <div className="profesor-info-card">
              <h3 className="info-titulo">👤 Profesor Seleccionado</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Nombre completo:</span>
                  <span className="info-value">{profesor.persona?.nombre} {profesor.persona?.apellido}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Documento:</span>
                  <span className="info-value">{profesor.persona?.numero_documento}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Cargo:</span>
                  <span className="info-value">{profesor.cargo}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profesor.persona?.correo || 'No registrado'}</span>
                </div>
              </div>
            </div>

            {/* 📚 Historial de Asignaciones */}
            {historialAsignaciones.length > 0 && (
              <div className="historial-section">
                <h4 className="historial-titulo">📋 Grados Asignados Anteriormente</h4>
                <div className="historial-grid">
                  {historialAsignaciones.map((asignacion, index) => (
                    <div key={index} className="historial-item">
                      <span className="grado-nombre">{asignacion.nombre_grado}</span>
                      <span className="fecha-asignacion">
                        {new Date(asignacion.fecha_asignacion).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🎯 Formulario de Asignación */}
            <div className="asignacion-section">
              <h4 className="asignacion-titulo">🎯 Asignar Nuevo Grado</h4>
              
              <div className="formulario-asignacion">
                <div className="form-group">
                  <label className="form-label">
                    Seleccionar Grado <span className="required">*</span>
                  </label>
                  <select
                    className="select-grado"
                    value={gradoSeleccionado}
                    onChange={e => setGradoSeleccionado(e.target.value)}
                  >
                    <option value="">-- Selecciona un grado --</option>
                    {grados.map(grado => (
                      <option key={grado.id_grado} value={grado.id_grado}>
                        {grado.nombre_grado || grado.nombre}
                        {grado.descripcion ? ` - ${grado.descripcion}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn-asignar"
                  onClick={() => setConfirmarAsignacion(true)}
                  disabled={!gradoSeleccionado || loadingAsignar}
                >
                  {loadingAsignar ? (
                    <>
                      <span className="spinner"></span>
                      Asignando...
                    </>
                  ) : (
                    '✅ Asignar Grado'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 💡 Información de ayuda */}
        {!profesor && (
          <div className="info-ayuda">
            <h4>💡 ¿Cómo buscar?</h4>
            <div className="tips-grid">
              <div className="tip-card">
                <strong>📝 Por nombre</strong>
                <p>Escribe el nombre completo o parcial del profesor</p>
              </div>
              <div className="tip-card">
                <strong>🆔 Por documento</strong>
                <p>Ingresa el número de documento del profesor</p>
              </div>
              <div className="tip-card">
                <strong>🔍 Resultados</strong>
                <p>Se mostrarán solo funcionarios con cargo de profesor</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 💬 Modal de mensaje */}
      {mensaje && (
        <ModalMensaje
          visible
          tipo={mensaje.tipo}
          titulo="Notificación"
          mensaje={mensaje.texto}
          onClose={() => setMensaje(null)}
        />
      )}

      {/* ✅ Modal de confirmación de asignación */}
      {confirmarAsignacion && (
        <ModalMensaje
          visible
          tipo="confirmacion"
          titulo="Confirmar Asignación"
          mensaje={
            <div className="confirmacion-contenido">
              <p>¿Estás seguro de asignar el siguiente grado?</p>
              <div className="detalles-asignacion">
                <p><strong>Profesor:</strong> {profesor?.persona?.nombre} {profesor?.persona?.apellido}</p>
                <p><strong>Grado:</strong> {getNombreGradoSeleccionado()}</p>
                <p><strong>Documento:</strong> {profesor?.persona?.numero_documento}</p>
              </div>
              <p className="advertencia-texto">⚠️ Esta acción no se puede deshacer automáticamente.</p>
            </div>
          }
          onClose={() => setConfirmarAsignacion(false)}
          onConfirm={async () => {
            setConfirmarAsignacion(false);
            await asignarGrado();
          }}
        />
      )}
    </div>
  );
}