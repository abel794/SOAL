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
  FaFileAlt
} from 'react-icons/fa';
import './PromoverEstudiantes.css';

const PromocionProfesor = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [gradoActual, setGradoActual] = useState({
    id: 1,
    nombre: "Segundo A - Mañana",
    anio: 2025
  });

  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [verificacion, setVerificacion] = useState(null);
  const [historialVisible, setHistorialVisible] = useState(false);
  const [filtro, setFiltro] = useState('');

  // Datos ficticios
  const estudiantesEjemplo = [
    { id: 1, nombre: "Andrea", documento: "3546845513", estado: "Activo" },
    { id: 2, nombre: "Sara", documento: "1005", estado: "Activo" },
    { id: 3, nombre: "Camilo", documento: "12345", estado: "Activo" },
    { id: 4, nombre: "Damaris", documento: "46541855", estado: "Activo" }
  ];

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = () => {
    setLoading(true);
    setTimeout(() => {
      setEstudiantes(estudiantesEjemplo);
      setLoading(false);
    }, 800);
  };

  // Filtrar
  const estudiantesFiltrados = estudiantes.filter(est =>
    est.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    est.documento.includes(filtro)
  );

  // Verificación
  const verificarPromocion = (estudiante) => {
    setLoading(true);
    setTimeout(() => {
      const puedePromover = Math.random() > 0.3;
      setVerificacion({
        estudiante: estudiante.nombre,
        puedePromover,
        mensaje: puedePromover
          ? "Cumple con los requisitos mínimos."
          : "Tiene observaciones pendientes."
      });
      setMensaje(
        puedePromover
          ? `✔ ${estudiante.nombre} cumple condiciones para ser promovido.`
          : `⚠ ${estudiante.nombre} necesita revisión.`
      );
      setLoading(false);
    }, 700);
  };

  // Enviar recomendación al coordinador
  const recomendar = (tipo) => {
    setLoading(true);

    setTimeout(() => {
      setMensaje(
        tipo === "promover"
          ? `✔ Recomendación enviada: Promover a ${estudianteSeleccionado.nombre}`
          : `⚠ Recomendación enviada: Reprobar a ${estudianteSeleccionado.nombre}`
      );
      setLoading(false);
      setObservaciones('');
      setEstudianteSeleccionado(null);
    }, 1000);
  };

  return (
    <div className="promover-estudiantes-container">
      
      {/* Header */}
      <div className="promover-header">
        <div className="header-title">
          <FaGraduationCap className="header-icon" />
          <h1>Recomendación de Promoción (Profesor)</h1>
        </div>

        <div className="grado-info">
          <div>
            <span className="label">Grado a cargo:</span>
            <span className="valor destacado">{gradoActual.nombre}</span>
          </div>
        </div>
      </div>

      {mensaje && (
        <div className="mensaje-alerta">{mensaje}</div>
      )}

      <div className="promover-content">

        {/* Lista de estudiantes */}
        <div className="panel-estudiantes">
          <div className="panel-header">
            <h3>
              <FaUserGraduate /> Estudiantes
            </h3>

            <div className="filtro-busqueda">
              <FaFilter />
              <input
                type="text"
                placeholder="Buscar..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>

          {/* Lista */}
          {!loading ? (
            estudiantesFiltrados.map((est) => (
              <div
                key={est.id}
                className={`estudiante-item ${
                  estudianteSeleccionado?.id === est.id ? 'seleccionado' : ''
                }`}
                onClick={() => setEstudianteSeleccionado(est)}
              >
                <div>
                  <span>{est.nombre}</span>
                  <span className="estudiante-documento">{est.documento}</span>
                </div>

                <div className="estudiante-acciones">
                  <button
                    className="btn-accion btn-verificar"
                    onClick={(e) => {
                      e.stopPropagation();
                      verificarPromocion(est);
                    }}
                  >
                    <FaCheck /> Verificar
                  </button>

                  <button
                    className="btn-accion btn-detalles"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHistorialVisible(true);
                      setEstudianteSeleccionado(est);
                    }}
                  >
                    <FaInfoCircle /> Historial
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Cargando...</p>
          )}
        </div>

        {/* Acciones */}
        <div className="panel-acciones">

          {!estudianteSeleccionado ? (
            <p className="texto-guia">Seleccione un estudiante.</p>
          ) : (
            <>
              <h3><FaUserGraduate /> {estudianteSeleccionado.nombre}</h3>

              {verificacion &&
                verificacion.estudiante === estudianteSeleccionado.nombre && (
                  <div className="verificacion-resultado">
                    {verificacion.mensaje}
                  </div>
                )}

              {historialVisible && (
                <div className="historial-comprensivo">
                  <h4><FaHistory /> Historial Académico y Conductual</h4>
                  <p>Observaciones: 4</p>
                  <p>Asistencias: 86%</p>
                  <p>Citas a acudientes: 1</p>
                </div>
              )}

              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Observaciones para el coordinador..."
              />

              <div className="botones-accion">
                <button
                  className="btn-accion-principal btn-promover"
                  onClick={() => recomendar("promover")}
                >
                  <FaArrowRight /> Recomendar Promoción
                </button>

                <button
                  className="btn-accion-principal btn-reprobar"
                  onClick={() => recomendar("reprobar")}
                >
                  <FaTimes /> Recomendar Reprobación
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromocionProfesor;
