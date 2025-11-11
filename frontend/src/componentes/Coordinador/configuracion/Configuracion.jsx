import React, { useState, useEffect, useCallback } from 'react';
import './ConfiguracionSistema.css';
import ModalMensaje from '../../ui/ModalMensaje';

export default function ConfiguracionSistema() {
  // -------------------------
  // Estado: configuración del colegio
  // -------------------------
  const [colegio, setColegio] = useState({
    nombreColegio: '',
    direccion: '',
    telefono: '',
    correo: '',
    logo: null,
    anioEscolar: new Date().getFullYear(),
    horaCierre: '17:00',
    activarAnio: false,
    notificacion: 'Correo',
    horarioEnvio: 'mañana',
    notificarAcudiente: true,
    maxEstudiantesPorCurso: 30,
    mensajeInstitucional: ''
  });

  // -------------------------
  // Estados para manejo de entidades
  // -------------------------
  const [seleccionEntidad, setSeleccionEntidad] = useState('');
  const [nuevoRegistro, setNuevoRegistro] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [entidadesExistentes, setEntidadesExistentes] = useState([]);
  const [loadingEntidades, setLoadingEntidades] = useState(false);

  // -------------------------
  // Modal global
  // -------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState('info');
  const [modalTitulo, setModalTitulo] = useState('');
  const [modalMensaje, setModalMensaje] = useState('');
  const [modalOnConfirm, setModalOnConfirm] = useState(null);

  // -------------------------
  // Mapeo de endpoints según tu backend
  // -------------------------
  const rutasBackend = {
    grado: 'grado',
    categoria_observacion: 'categoria_observacion',
    gravedad_observacion: 'gravedadObservacion',
    eps: 'eps',
    tipo_usuario: 'tipoUsuario',
    nivel_escolaridad: 'nivel_escolaridad',
    canal_notificacion: 'canal_notificacion'
  };

  const opciones = Object.keys(rutasBackend);

  // -------------------------
  // Cargar configuración existente al montar el componente
  // -------------------------
  useEffect(() => {
    cargarConfiguracionExistente();
  }, []);

  const cargarConfiguracionExistente = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/configuracion', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data) {
          setColegio(prev => ({ ...prev, ...data }));
        }
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  // -------------------------
  // Cargar entidades existentes cuando se selecciona una entidad
  // -------------------------
  useEffect(() => {
    if (seleccionEntidad) {
      cargarEntidadesExistentes();
    }
  }, [seleccionEntidad]);

  const cargarEntidadesExistentes = async () => {
    setLoadingEntidades(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = rutasBackend[seleccionEntidad];
      const res = await fetch(`http://localhost:3000/api/coordinador/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setEntidadesExistentes(Array.isArray(data) ? data : []);
      } else {
        setEntidadesExistentes([]);
      }
    } catch (error) {
      console.error('Error cargando entidades:', error);
      setEntidadesExistentes([]);
    } finally {
      setLoadingEntidades(false);
    }
  };

  // -------------------------
  // Helpers: input handlers
  // -------------------------
  const handleChangeColegio = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setColegio(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleFileChangeColegio = useCallback((e) => {
    setColegio(prev => ({ ...prev, logo: e.target.files[0] }));
  }, []);

  const handleSeleccionEntidad = useCallback((e) => {
    setSeleccionEntidad(e.target.value);
    setNuevoRegistro('');
    setDescripcion('');
  }, []);

  const handleInputEntidad = useCallback((e) => setNuevoRegistro(e.target.value), []);
  const handleDescripcionChange = useCallback((e) => setDescripcion(e.target.value), []);

  // -------------------------
  // UTIL: abrir modal con configuración rápida
  // -------------------------
  const abrirModal = useCallback(({ tipo = 'info', titulo = '', mensaje = '', onConfirm = null }) => {
    setModalTipo(tipo);
    setModalTitulo(titulo);
    setModalMensaje(mensaje);
    setModalOnConfirm(() => onConfirm);
    setModalVisible(true);
  }, []);

  // -------------------------
  // Acción: Guardar configuración del colegio
  // -------------------------
  const handleSubmitColegio = useCallback(async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(colegio).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/configuracion', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        abrirModal({
          tipo: 'exito',
          titulo: '✅ Configuración Guardada',
          mensaje: 'Los cambios se han guardado correctamente en el sistema.'
        });
      } else {
        abrirModal({
          tipo: 'error',
          titulo: '❌ Error al Guardar',
          mensaje: data.error || data.detalle || 'No se pudo actualizar la configuración'
        });
      }
    } catch (error) {
      console.error(error);
      abrirModal({
        tipo: 'error',
        titulo: '🚨 Error de Conexión',
        mensaje: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.'
      });
    }
  }, [colegio, abrirModal]);

  // -------------------------
  // Acción: Agregar nueva entidad
  // -------------------------
  const handleSubmitEntidad = useCallback(async (e) => {
    e.preventDefault();
    if (!nuevoRegistro.trim()) {
      abrirModal({
        tipo: 'advertencia',
        titulo: '⚠️ Campo Requerido',
        mensaje: 'Debes ingresar un nombre para la entidad antes de continuar.'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = rutasBackend[seleccionEntidad];

      const payload =
        seleccionEntidad === 'grado'
          ? { nombre_grado: nuevoRegistro.trim(), descripcion: descripcion.trim() || null }
          : seleccionEntidad === 'canal_notificacion'
          ? { nombre: nuevoRegistro.trim() }
          : { nombre: nuevoRegistro.trim(), descripcion: descripcion.trim() || null };

      const res = await fetch(`http://localhost:3000/api/coordinador/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        abrirModal({
          tipo: 'exito',
          titulo: '✅ Entidad Creada',
          mensaje: `La entidad "${nuevoRegistro}" se ha agregado correctamente al sistema.`
        });
        setNuevoRegistro('');
        setDescripcion('');
        cargarEntidadesExistentes(); // Recargar la lista
      } else {
        abrirModal({
          tipo: 'error',
          titulo: '❌ Error al Crear',
          mensaje: data.error || data.detalle || 'No fue posible crear la entidad'
        });
      }
    } catch (err) {
      console.error(err);
      abrirModal({
        tipo: 'error',
        titulo: '🚨 Error de Conexión',
        mensaje: 'Error de conexión con el servidor al intentar crear la entidad.'
      });
    }
  }, [seleccionEntidad, nuevoRegistro, descripcion, abrirModal]);

  // -------------------------
  // Acción: Eliminar entidad
  // -------------------------
  const handleDeleteEntidad = useCallback((id, nombre) => {
    if (!seleccionEntidad) {
      abrirModal({
        tipo: 'advertencia',
        titulo: '⚠️ Selección Requerida',
        mensaje: 'Primero selecciona una entidad de la lista.'
      });
      return;
    }

    const ejecutarDelete = async () => {
      try {
        const token = localStorage.getItem('token');
        const endpoint = rutasBackend[seleccionEntidad];
        const res = await fetch(`http://localhost:3000/api/coordinador/${endpoint}/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok) {
          abrirModal({
            tipo: 'exito',
            titulo: '🗑️ Entidad Eliminada',
            mensaje: `La entidad "${nombre}" se ha eliminado correctamente.`
          });
          cargarEntidadesExistentes(); // Recargar la lista
        } else {
          abrirModal({
            tipo: 'error',
            titulo: '❌ Error al Eliminar',
            mensaje: data.error || data.detalle || 'No se pudo eliminar la entidad'
          });
        }
      } catch (error) {
        console.error(error);
        abrirModal({
          tipo: 'error',
          titulo: '🚨 Error de Servidor',
          mensaje: 'Ocurrió un problema con la conexión al intentar eliminar la entidad.'
        });
      }
    };

    abrirModal({
      tipo: 'confirmacion',
      titulo: '🗑️ Confirmar Eliminación',
      mensaje: `¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: ejecutarDelete
    });
  }, [seleccionEntidad, abrirModal]);

  // -------------------------
  // Render (JSX)
  // -------------------------
  return (
    <div className="configuracion-container">
      <div className="configuracion-content">
        {/* Header */}
        <div className="configuracion-header">
          <h1 className="titulo-principal">⚙️ Configuración del Sistema</h1>
          <p className="subtitulo">Gestiona la configuración general del colegio y las entidades del sistema</p>
        </div>

        {/* Sección: Configuración del Colegio */}
        <div className="seccion-configuracion">
          <div className="seccion-header">
            <h2>🏫 Configuración del Colegio</h2>
            <p>Información general y parámetros del sistema</p>
          </div>

          <form onSubmit={handleSubmitColegio} className="formulario-colegio">
            <div className="form-grid">
              {/* Información Básica */}
              <div className="form-group">
                <label className="form-label">
                  Nombre del Colegio <span className="required">*</span>
                </label>
                <input 
                  type="text" 
                  name="nombreColegio" 
                  value={colegio.nombreColegio} 
                  onChange={handleChangeColegio} 
                  className="form-input"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Dirección <span className="required">*</span>
                </label>
                <input 
                  type="text" 
                  name="direccion" 
                  value={colegio.direccion} 
                  onChange={handleChangeColegio} 
                  className="form-input"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Teléfono <span className="required">*</span>
                </label>
                <input 
                  type="tel" 
                  name="telefono" 
                  value={colegio.telefono} 
                  onChange={handleChangeColegio} 
                  className="form-input"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Correo Electrónico <span className="required">*</span>
                </label>
                <input 
                  type="email" 
                  name="correo" 
                  value={colegio.correo} 
                  onChange={handleChangeColegio} 
                  className="form-input"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Logo del Colegio
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChangeColegio} 
                  className="form-input"
                />
                <small className="input-help">Formatos: JPG, PNG, SVG (Máx. 5MB)</small>
              </div>
            </div>

            {/* Configuración Escolar */}
            <div className="seccion-interna">
              <h3>📅 Configuración Escolar</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Año Escolar Actual <span className="required">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="anioEscolar" 
                    min="2020" 
                    max="2030"
                    value={colegio.anioEscolar} 
                    onChange={handleChangeColegio} 
                    className="form-input"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Hora de Cierre del Sistema <span className="required">*</span>
                  </label>
                  <input 
                    type="time" 
                    name="horaCierre" 
                    value={colegio.horaCierre} 
                    onChange={handleChangeColegio} 
                    className="form-input"
                    required 
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="activarAnio" 
                      checked={colegio.activarAnio} 
                      onChange={handleChangeColegio} 
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Activar año escolar actual
                  </label>
                </div>
              </div>
            </div>

            {/* Configuración de Notificaciones */}
            <div className="seccion-interna">
              <h3>🔔 Configuración de Notificaciones</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Medio de Notificación <span className="required">*</span>
                  </label>
                  <select name="notificacion" value={colegio.notificacion} onChange={handleChangeColegio} className="form-select">
                    <option value="Correo">📧 Correo Electrónico</option>
                    <option value="WhatsApp">💬 WhatsApp</option>
                    <option value="Ambos">📱 Ambos</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Horario de Envío <span className="required">*</span>
                  </label>
                  <select name="horarioEnvio" value={colegio.horarioEnvio} onChange={handleChangeColegio} className="form-select">
                    <option value="mañana">🌅 Mañana (7:00 - 12:00)</option>
                    <option value="tarde">🌞 Tarde (12:00 - 18:00)</option>
                    <option value="noche">🌙 Noche (18:00 - 22:00)</option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="notificarAcudiente" 
                      checked={colegio.notificarAcudiente} 
                      onChange={handleChangeColegio} 
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Notificar al acudiente al registrar observaciones
                  </label>
                </div>
              </div>
            </div>

            {/* Límites y Mensajes */}
            <div className="seccion-interna">
              <h3>📊 Límites y Mensajes</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Estudiantes Máximo por Curso <span className="required">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="maxEstudiantesPorCurso" 
                    min="5" 
                    max="50"
                    value={colegio.maxEstudiantesPorCurso} 
                    onChange={handleChangeColegio} 
                    className="form-input"
                    required 
                  />
                  <small className="input-help">Mínimo: 5, Máximo: 50 estudiantes</small>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Mensaje Institucional
                  </label>
                  <textarea 
                    name="mensajeInstitucional" 
                    rows="4" 
                    value={colegio.mensajeInstitucional} 
                    onChange={handleChangeColegio} 
                    className="form-textarea"
                    placeholder="Escribe el mensaje institucional que aparecerá en las comunicaciones..."
                  />
                  <small className="input-help">Máximo 500 caracteres</small>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-guardar">
              💾 Guardar Configuración
            </button>
          </form>
        </div>

        {/* Sección: Gestión de Entidades */}
        <div className="seccion-entidades">
          <div className="seccion-header">
            <h2>📚 Gestión de Entidades del Sistema</h2>
            <p>Administra las categorías, grados y otras entidades del sistema</p>
          </div>

          <div className="entidades-content">
            {/* Selector de Entidad */}
            <div className="selector-entidad">
              <label className="form-label">
                Selecciona la Entidad a Gestionar <span className="required">*</span>
              </label>
              <select value={seleccionEntidad} onChange={handleSeleccionEntidad} className="form-select">
                <option value="">-- Selecciona una entidad --</option>
                {opciones.map(opt => (
                  <option key={opt} value={opt}>
                    {opt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Formulario de Entidades */}
            {seleccionEntidad && (
              <div className="formulario-entidad">
                <h3>➕ Agregar Nueva Entidad</h3>
                <form onSubmit={handleSubmitEntidad} className="form-entidad">
                  <div className="entidad-inputs">
                    <div className="form-group">
                      <input
                        type="text"
                        value={nuevoRegistro}
                        onChange={handleInputEntidad}
                        placeholder={`Nombre del ${seleccionEntidad.replace(/_/g, ' ')}`}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        value={descripcion}
                        onChange={handleDescripcionChange}
                        placeholder="Descripción (opcional)"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="entidad-actions">
                    <button type="submit" className="btn-agregar">
                      ✅ Agregar
                    </button>
                  </div>
                </form>

                {/* Lista de Entidades Existentes */}
                <div className="lista-entidades">
                  <h4>📋 Entidades Existentes</h4>
                  {loadingEntidades ? (
                    <div className="cargando-entidades">
                      <div className="spinner"></div>
                      <span>Cargando entidades...</span>
                    </div>
                  ) : entidadesExistentes.length > 0 ? (
                    <div className="entidades-grid">
                      {entidadesExistentes.map((entidad) => (
                        <div key={entidad.id || entidad.id_grado || entidad.id_categoria} className="entidad-card">
                          <div className="entidad-info">
                            <span className="entidad-nombre">
                              {entidad.nombre || entidad.nombre_grado || entidad.nombre_categoria}
                            </span>
                            {entidad.descripcion && (
                              <span className="entidad-descripcion">{entidad.descripcion}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn-eliminar-entidad"
                            onClick={() => handleDeleteEntidad(
                              entidad.id || entidad.id_grado || entidad.id_categoria,
                              entidad.nombre || entidad.nombre_grado || entidad.nombre_categoria
                            )}
                            title="Eliminar entidad"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="sin-entidades">
                      <span>📭</span>
                      <p>No hay entidades registradas</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Global */}
      <ModalMensaje
        visible={modalVisible}
        tipo={modalTipo}
        titulo={modalTitulo}
        mensaje={modalMensaje}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          if (typeof modalOnConfirm === 'function') modalOnConfirm();
        }}
      />
    </div>
  );
}