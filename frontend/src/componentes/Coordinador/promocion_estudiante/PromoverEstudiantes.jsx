import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, 
  FaSearch, 
  FaUserGraduate, 
  FaCheck, 
  FaTimes, 
  FaInfoCircle,
  FaArrowRight,
  FaHistory,
  FaFilter,
  FaFileAlt,
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEye,
  FaList,
  FaChevronRight,
  FaBuilding,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaBook,
  FaExclamationTriangle,
  FaUserCheck,
  FaTimesCircle
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const PromoverEstudiantes = () => {
  // Estados principales
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [profesorTitular, setProfesorTitular] = useState(null);
  const [siguienteGrado, setSiguienteGrado] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  
  // Estados de UI
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [modoAccion, setModoAccion] = useState(null);
  const [verificacion, setVerificacion] = useState(null);
  const [historialVisible, setHistorialVisible] = useState(false);
  const [filtroEstudiante, setFiltroEstudiante] = useState('');
  const [filtroGrado, setFiltroGrado] = useState('');
  const [vista, setVista] = useState('grados');
  const [anioAcademico, setAnioAcademico] = useState(new Date().getFullYear());

  // Cargar todos los grados al iniciar
  useEffect(() => {
    cargarGrados();
  }, []);

  // Cargar grados disponibles
  const cargarGrados = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const gradosEjemplo = [
          { 
            id: 1, 
            nombre_grado: "Primero A - Mañana", 
            descripcion: "Primer grado - Turno mañana",
            cantidad_estudiantes: 25,
            anio_academico: 2025,
            profesor_titular: "Prof. María González",
            estado: "Activo",
            orden: 1
          },
          { 
            id: 2, 
            nombre_grado: "Segundo A - Mañana", 
            descripcion: "Segundo grado - Turno mañana",
            cantidad_estudiantes: 22,
            anio_academico: 2025,
            profesor_titular: "Prof. Carlos Rodríguez",
            estado: "Activo",
            orden: 2
          },
          { 
            id: 3, 
            nombre_grado: "Tercero A - Mañana", 
            descripcion: "Tercer grado - Turno mañana",
            cantidad_estudiantes: 20,
            anio_academico: 2025,
            profesor_titular: "Prof. Ana Martínez",
            estado: "Activo",
            orden: 3
          }
        ];
        setGrados(gradosEjemplo);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error cargando grados:', error);
      setMensaje('❌ Error al cargar los grados');
      setLoading(false);
    }
  };

  // Cargar detalle de un grado específico
  const cargarDetalleGrado = async (grado) => {
    setLoading(true);
    setGradoSeleccionado(grado);
    setVista('detalle');
    
    try {
      setTimeout(() => {
        // 1. Estudiantes del grado
        const estudiantesEjemplo = [
          { 
            id: 1, 
            nombre: "andrea", 
            apellido: "Pérez",
            documento: "3546845513", 
            estado: "Activo",
            fecha_nacimiento: "2015-03-15",
            acudiente: "Juan Pérez",
            telefono_acudiente: "3001234567",
            observaciones_count: 3,
            asistencias: 45,
            faltas: 2
          },
          { 
            id: 2, 
            nombre: "Sara", 
            apellido: "Gómez",
            documento: "1005", 
            estado: "Activo",
            fecha_nacimiento: "2015-06-20",
            acudiente: "María Gómez",
            telefono_acudiente: "3007654321",
            observaciones_count: 1,
            asistencias: 48,
            faltas: 0
          }
        ];
        setEstudiantes(estudiantesEjemplo);

        // 2. Profesor titular del grado
        setProfesorTitular({
          nombre: "Prof. Carlos Rodríguez",
          documento: "987654321",
          telefono: "3001112233",
          email: "carlos.rodriguez@colegio.edu",
          especialidad: "Matemáticas y Ciencias",
          años_experiencia: 8
        });

        // 3. Siguiente grado
        const siguienteGradoEjemplo = grados.find(g => g.orden === grado.orden + 1) || {
          id: 4,
          nombre_grado: "Cuarto A - Mañana",
          descripcion: "Cuarto grado - Turno mañana"
        };
        setSiguienteGrado(siguienteGradoEjemplo);

        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error cargando detalle del grado:', error);
      setMensaje('❌ Error al cargar el detalle del grado');
      setLoading(false);
    }
  };

  // Filtrar estudiantes
  const estudiantesFiltrados = estudiantes.filter(est => 
    `${est.nombre} ${est.apellido}`.toLowerCase().includes(filtroEstudiante.toLowerCase()) ||
    est.documento.includes(filtroEstudiante)
  );

  // Filtrar grados
  const gradosFiltrados = grados.filter(grado => 
    grado.nombre_grado.toLowerCase().includes(filtroGrado.toLowerCase()) ||
    grado.descripcion.toLowerCase().includes(filtroGrado.toLowerCase())
  );

  // Verificar si un estudiante puede ser promovido
  const verificarPromocion = async (estudiante) => {
    setLoading(true);
    try {
      setTimeout(() => {
        const puedePromover = 
          estudiante.faltas <= 5 && 
          estudiante.observaciones_count <= 3 && 
          (estudiante.asistencias / 50) >= 0.85;

        setVerificacion({
          estudiante: estudiante.nombre,
          puedePromover,
          observaciones: puedePromover 
            ? '✅ Cumple con todos los requisitos para promoción' 
            : `⚠️ No cumple con algún requisito`,
          detalles: {
            faltas: estudiante.faltas,
            faltasLimite: 5,
            observaciones: estudiante.observaciones_count,
            observacionesLimite: 3,
            asistencia: Math.round((estudiante.asistencias / 50) * 100),
            asistenciaMinima: 85
          }
        });

        setMensaje(puedePromover 
          ? `✅ ${estudiante.nombre} puede ser promovido` 
          : `⚠️ ${estudiante.nombre} necesita revisión antes de promoción`
        );
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error verificando promoción:', error);
      setMensaje('❌ Error al verificar promoción');
      setLoading(false);
    }
  };

  // Promover estudiante
  const promoverEstudiante = async () => {
    if (!estudianteSeleccionado || !siguienteGrado) return;
    
    setLoading(true);
    try {
      setTimeout(() => {
        setMensaje(`✅ ${estudianteSeleccionado.nombre} ${estudianteSeleccionado.apellido} promovido exitosamente a ${siguienteGrado.nombre_grado}`);
        setEstudiantes(prev => prev.filter(e => e.id !== estudianteSeleccionado.id));
        setGradoSeleccionado(prev => ({
          ...prev,
          cantidad_estudiantes: prev.cantidad_estudiantes - 1
        }));
        setEstudianteSeleccionado(null);
        setObservaciones('');
        setModoAccion(null);
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error('Error promoviendo estudiante:', error);
      setMensaje('❌ Error al promover estudiante');
      setLoading(false);
    }
  };

  // Reprobar estudiante
  const reprobarEstudiante = async () => {
    if (!estudianteSeleccionado) return;
    
    setLoading(true);
    try {
      setTimeout(() => {
        setMensaje(`⚠️ ${estudianteSeleccionado.nombre} ${estudianteSeleccionado.apellido} reprobado - Repetirá el grado actual`);
        setEstudianteSeleccionado(null);
        setObservaciones('');
        setModoAccion(null);
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error('Error reprobando estudiante:', error);
      setMensaje('❌ Error al reprobar estudiante');
      setLoading(false);
    }
  };

  // Volver a la vista de grados
  const volverAGrados = () => {
    setVista('grados');
    setGradoSeleccionado(null);
    setEstudianteSeleccionado(null);
    setObservaciones('');
    setVerificacion(null);
    setHistorialVisible(false);
  };

  return (
    <div className="container-fluid py-3">
      {/* Header principal */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3 rounded">
            <div className="d-flex align-items-center">
              <FaGraduationCap className="fs-2 me-3" />
              <div>
                <h1 className="h3 mb-0">Gestión Académica - Promoción de Estudiantes</h1>
                <small className="opacity-75">Coordinador Académico</small>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaCalendarAlt className="me-2" />
              <select 
                className="form-select form-select-sm w-auto"
                value={anioAcademico} 
                onChange={(e) => setAnioAcademico(parseInt(e.target.value))}
              >
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <div className={`alert ${mensaje.includes('✅') ? 'alert-success' : mensaje.includes('⚠️') ? 'alert-warning' : 'alert-danger'} mb-3`}>
          {mensaje}
        </div>
      )}

      {/* Contenido principal */}
      {vista === 'grados' ? (
        /* =================== VISTA DE GRADOS =================== */
        <div className="card">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">
              <FaBuilding className="me-2" /> Grados Académicos - Año {anioAcademico}
            </h3>
            <div className="input-group w-auto">
              <span className="input-group-text">
                <FaFilter />
              </span>
              <input 
                type="text" 
                className="form-control"
                placeholder="Buscar grado..." 
                value={filtroGrado}
                onChange={(e) => setFiltroGrado(e.target.value)}
              />
            </div>
          </div>
          
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando grados académicos...</p>
              </div>
            ) : gradosFiltrados.length === 0 ? (
              <div className="alert alert-info">
                No se encontraron grados académicos.
              </div>
            ) : (
              <div className="row">
                {gradosFiltrados.map(grado => (
                  <div key={grado.id} className="col-md-6 col-lg-4 mb-3">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title mb-0">{grado.nombre_grado}</h5>
                          <span className="badge bg-primary">Año {grado.anio_academico}</span>
                        </div>
                        <p className="card-text text-muted small">{grado.descripcion}</p>
                        
                        <div className="row text-center mt-3">
                          <div className="col-4">
                            <FaUsers className="fs-5 text-primary mb-2" />
                            <div className="fs-6 fw-bold">{grado.cantidad_estudiantes}</div>
                            <div className="text-muted small">Estudiantes</div>
                          </div>
                          <div className="col-4">
                            <FaChalkboardTeacher className="fs-5 text-primary mb-2" />
                            <div className="fs-6 fw-bold text-truncate" title={grado.profesor_titular}>
                              {grado.profesor_titular.split(' ')[0]}
                            </div>
                            <div className="text-muted small">Titular</div>
                          </div>
                          <div className="col-4">
                            <FaGraduationCap className="fs-5 text-primary mb-2" />
                            <div className="fs-6 fw-bold">Nivel {grado.orden}</div>
                            <div className="text-muted small">Orden</div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => cargarDetalleGrado(grado)}
                        >
                          <FaEye className="me-1" /> Ver Detalle
                        </button>
                        {grado.orden < Math.max(...grados.map(g => g.orden)) && (
                          <small className="text-muted">
                            <FaArrowRight className="me-1" /> Siguiente: {grados.find(g => g.orden === grado.orden + 1)?.nombre_grado}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =================== VISTA DETALLE DEL GRADO =================== */
        <div>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button 
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={volverAGrados}
                >
                  <FaChevronRight className="rotate-180 me-1" /> Volver a Grados
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {gradoSeleccionado?.nombre_grado}
              </li>
            </ol>
          </nav>

          {/* Información del grado seleccionado */}
          <div className="card bg-primary text-white mb-4">
            <div className="card-body">
              <h2 className="card-title">{gradoSeleccionado?.nombre_grado}</h2>
              <p className="card-text opacity-75 mb-4">
                {gradoSeleccionado?.descripcion} | Año Académico: {gradoSeleccionado?.anio_academico}
              </p>
              
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="bg-white bg-opacity-25 p-3 rounded">
                    <FaUsers className="mb-2" />
                    <div className="fw-bold">Total Estudiantes</div>
                    <div className="fs-4">{gradoSeleccionado?.cantidad_estudiantes}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white bg-opacity-25 p-3 rounded">
                    <FaChalkboardTeacher className="mb-2" />
                    <div className="fw-bold">Profesor Titular</div>
                    <div>{profesorTitular?.nombre}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-white bg-opacity-25 p-3 rounded">
                    <FaArrowRight className="mb-2" />
                    <div className="fw-bold">Siguiente Grado</div>
                    <div>{siguienteGrado?.nombre_grado}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalle del profesor titular */}
          {profesorTitular && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <FaUserTie className="me-2" /> Información del Profesor Titular
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <strong>Nombre:</strong> {profesorTitular.nombre}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Documento:</strong> {profesorTitular.documento}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Teléfono:</strong> <FaPhone className="me-1" /> {profesorTitular.telefono}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Email:</strong> <FaEnvelope className="me-1" /> {profesorTitular.email}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Especialidad:</strong> <FaBook className="me-1" /> {profesorTitular.especialidad}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Años de Experiencia:</strong> {profesorTitular.años_experiencia}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenido principal de estudiantes */}
          <div className="row">
            {/* Panel izquierdo: Lista de estudiantes */}
            <div className="col-lg-8 mb-4">
              <div className="card">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <FaUserGraduate className="me-2" /> Estudiantes del Grado
                  </h5>
                  <div className="input-group w-auto">
                    <span className="input-group-text">
                      <FaFilter />
                    </span>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Buscar estudiante..." 
                      value={filtroEstudiante}
                      onChange={(e) => setFiltroEstudiante(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="card-body p-0">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="mt-2">Cargando estudiantes...</p>
                    </div>
                  ) : estudiantesFiltrados.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No se encontraron estudiantes en este grado.</p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {estudiantesFiltrados.map(estudiante => (
                        <div 
                          key={estudiante.id} 
                          className={`list-group-item list-group-item-action ${estudianteSeleccionado?.id === estudiante.id ? 'active' : ''}`}
                          onClick={() => setEstudianteSeleccionado(estudiante)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex w-100 justify-content-between align-items-start">
                            <div className="w-100">
                              <div className="d-flex justify-content-between mb-2">
                                <h6 className="mb-0">
                                  <strong>{estudiante.nombre} {estudiante.apellido}</strong>
                                </h6>
                                <span className="badge bg-secondary">{estudiante.documento}</span>
                              </div>
                              
                              <div className="mb-2">
                                <small className="text-muted">
                                  <strong>Acudiente:</strong> {estudiante.acudiente}
                                </small>
                                <br />
                                <small className="text-muted">
                                  <strong>Teléfono:</strong> {estudiante.telefono_acudiente}
                                </small>
                              </div>
                              
                              <div className="d-flex gap-2">
                                <span className="badge bg-warning text-dark">
                                  Obs: {estudiante.observaciones_count}
                                </span>
                                <span className="badge bg-success">
                                  Asist: {estudiante.asistencias}
                                </span>
                                <span className="badge bg-danger">
                                  Faltas: {estudiante.faltas}
                                </span>
                              </div>
                            </div>
                            
                            <div className="d-flex flex-column gap-1 ms-3">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  verificarPromocion(estudiante);
                                }}
                              >
                                <FaCheck /> Verificar
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEstudianteSeleccionado(estudiante);
                                  setHistorialVisible(true);
                                }}
                              >
                                <FaFileAlt /> Historial
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Panel derecho: Acciones de promoción */}
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Acciones de Promoción</h5>
                </div>
                
                <div className="card-body">
                  {!estudianteSeleccionado ? (
                    <div className="text-center py-4">
                      <FaUserGraduate size={48} className="text-muted mb-3" />
                      <p className="text-muted">
                        Seleccione un estudiante de la lista para realizar acciones.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Información del estudiante seleccionado */}
                      <div className="mb-4">
                        <h6 className="border-bottom pb-2">
                          <FaUserCheck className="me-2" /> Estudiante Seleccionado
                        </h6>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <tbody>
                              <tr>
                                <td><strong>Nombre:</strong></td>
                                <td>{estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}</td>
                              </tr>
                              <tr>
                                <td><strong>Documento:</strong></td>
                                <td>{estudianteSeleccionado.documento}</td>
                              </tr>
                              <tr>
                                <td><strong>Acudiente:</strong></td>
                                <td>{estudianteSeleccionado.acudiente}</td>
                              </tr>
                              <tr>
                                <td><strong>Teléfono:</strong></td>
                                <td>{estudianteSeleccionado.telefono_acudiente}</td>
                              </tr>
                              <tr>
                                <td><strong>Observaciones:</strong></td>
                                <td>
                                  <span className={`badge ${estudianteSeleccionado.observaciones_count > 3 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                    {estudianteSeleccionado.observaciones_count}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td><strong>Asistencias:</strong></td>
                                <td>{estudianteSeleccionado.asistencias}</td>
                              </tr>
                              <tr>
                                <td><strong>Faltas:</strong></td>
                                <td>
                                  <span className={`badge ${estudianteSeleccionado.faltas > 5 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                    {estudianteSeleccionado.faltas}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Resultado de verificación */}
                      {verificacion && verificacion.estudiante === estudianteSeleccionado.nombre && (
                        <div className={`alert ${verificacion.puedePromover ? 'alert-success' : 'alert-warning'} mb-3`}>
                          <h6 className="alert-heading">
                            <FaCheck className="me-2" /> Verificación de Promoción
                          </h6>
                          <p className="mb-2">{verificacion.observaciones}</p>
                          <hr />
                          <div className="small">
                            <div>Faltas: {verificacion.detalles.faltas}/{verificacion.detalles.faltasLimite}</div>
                            <div>Observaciones: {verificacion.detalles.observaciones}/{verificacion.detalles.observacionesLimite}</div>
                            <div>Asistencia: {verificacion.detalles.asistencia}% (Mín: {verificacion.detalles.asistenciaMinima}%)</div>
                          </div>
                        </div>
                      )}

                      {/* Historial comprensivo */}
                      {historialVisible && (
                        <div className="alert alert-info mb-3">
                          <h6 className="alert-heading">
                            <FaHistory className="me-2" /> Historial Comprensivo
                          </h6>
                          <div className="small">
                            <div>Observaciones: {estudianteSeleccionado.observaciones_count}</div>
                            <div>Asistencias: {estudianteSeleccionado.asistencias} días</div>
                            <div>Faltas: {estudianteSeleccionado.faltas} días</div>
                            <div>Porcentaje: {Math.round((estudianteSeleccionado.asistencias / (estudianteSeleccionado.asistencias + estudianteSeleccionado.faltas)) * 100)}%</div>
                          </div>
                        </div>
                      )}

                      {/* Observaciones */}
                      <div className="mb-3">
                        <label className="form-label">
                          <FaFileAlt className="me-2" /> Observaciones:
                        </label>
                        <textarea
                          className="form-control"
                          value={observaciones}
                          onChange={(e) => setObservaciones(e.target.value)}
                          placeholder="Ingrese observaciones..."
                          rows="3"
                        />
                      </div>

                      {/* Botones de acción */}
                      <div className="d-grid gap-2">
                        <button
                          className={`btn btn-success ${!verificacion?.puedePromover ? 'disabled' : ''}`}
                          onClick={promoverEstudiante}
                          disabled={loading || (verificacion && !verificacion.puedePromover)}
                        >
                          <FaArrowRight className="me-2" /> Promover a {siguienteGrado?.nombre_grado}
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={reprobarEstudiante}
                          disabled={loading}
                        >
                          <FaTimes className="me-2" /> Reprobar (Repetir grado)
                        </button>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-secondary flex-fill"
                            onClick={() => setHistorialVisible(!historialVisible)}
                          >
                            <FaHistory className="me-2" /> {historialVisible ? 'Ocultar' : 'Historial'}
                          </button>
                          <button
                            className="btn btn-outline-dark flex-fill"
                            onClick={() => {
                              setEstudianteSeleccionado(null);
                              setObservaciones('');
                              setVerificacion(null);
                              setHistorialVisible(false);
                            }}
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Búsqueda por documento */}
              <div className="card mt-3">
                <div className="card-header">
                  <h6 className="card-title mb-0">
                    <FaSearch className="me-2" /> Buscar estudiante
                  </h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="alert alert-secondary mb-2">
                      <strong>3546845513</strong>
                    </div>
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary">
                        <FaCheck className="me-2" /> Verificar
                      </button>
                      <button className="btn btn-outline-primary">
                        <FaHistory className="me-2" /> Historial
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && modoAccion && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center py-5">
                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h5>
                  {modoAccion === 'promover' 
                    ? `Promoviendo a ${estudianteSeleccionado?.nombre}...` 
                    : `Reprobando a ${estudianteSeleccionado?.nombre}...`}
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoverEstudiantes;