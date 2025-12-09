import React from 'react';
import { X, User, Users, FileText, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import './ModalDetallesEstudiante.css';

const ModalDetallesEstudiante = ({ estudiante, onClose }) => {
  if (!estudiante) return null;

  // Calcular progreso del año académico
  const calcularProgresoAnio = () => {
    const inicioAnio = new Date('2025-02-01'); // Febrero inicio año escolar
    const finAnio = new Date('2025-11-30'); // Noviembre fin año escolar
    const hoy = new Date();
    
    const totalDias = (finAnio - inicioAnio) / (1000 * 60 * 60 * 24);
    const diasTranscurridos = (hoy - inicioAnio) / (1000 * 60 * 60 * 24);
    const porcentaje = Math.min(Math.max((diasTranscurridos / totalDias) * 100, 0), 100);
    
    return {
      porcentaje: porcentaje.toFixed(1),
      mesInicio: 'Febrero',
      mesActual: 'Noviembre',
      diasTranscurridos: Math.floor(diasTranscurridos),
      diasTotales: Math.floor(totalDias)
    };
  };

  const progreso = calcularProgresoAnio();

  // Obtener hermanos (excluyendo al estudiante actual)
  const hermanos = estudiante.acudientes?.[0]?.hermanos
    ?.filter(h => h.id_estudiante !== estudiante.id_estudiante) || [];

  return (
    <div className="modal-fondo-detalles" onClick={onClose}>
      <div className="modal-contenedor-detalles" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header-gradient">
          <h2 className="modal-titulo">Detalles del Estudiante</h2>
          <button 
            onClick={onClose}
            className="btn-cerrar-modal"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body-scroll">
          
          {/* Información Personal */}
          <div className="seccion-info">
            <div className="seccion-header">
              <User className="icono-seccion" size={24} />
              <h3>Información Personal</h3>
            </div>
            <div className="info-grid">
              <div className="info-campo">
                <span className="info-label">Nombre Completo</span>
                <span className="info-valor">{estudiante.persona?.nombre} {estudiante.persona?.apellido}</span>
              </div>
              <div className="info-campo">
                <span className="info-label">Documento</span>
                <span className="info-valor">{estudiante.numero_documento || estudiante.persona?.numero_documento}</span>
              </div>
              <div className="info-campo">
                <span className="info-label">Fecha de Nacimiento</span>
                <span className="info-valor">
                  {estudiante.persona?.fecha_nacimiento 
                    ? new Date(estudiante.persona.fecha_nacimiento).toLocaleDateString('es-CO')
                    : '—'}
                </span>
              </div>
              <div className="info-campo">
                <span className="info-label">Teléfono</span>
                <span className="info-valor">{estudiante.persona?.telefono || '—'}</span>
              </div>
              <div className="info-campo">
                <span className="info-label">Correo</span>
                <span className="info-valor">{estudiante.persona?.correo || '—'}</span>
              </div>
              <div className="info-campo">
                <span className="info-label">Dirección</span>
                <span className="info-valor">{estudiante.persona?.direccion || '—'}</span>
              </div>
              <div className="info-campo">
                <span className="info-label">EPS</span>
                <span className="info-valor">{estudiante.eps?.nombre || '—'}</span>
              </div>
              <div className="info-campo">
                <span className="info-label">Estado Académico</span>
                <span className={`badge-estado ${estudiante.estadoAcademico?.nombre?.toLowerCase()}`}>
                  {estudiante.estadoAcademico?.nombre || '—'}
                </span>
              </div>
              <div className="info-campo info-campo-full">
                <span className="info-label">Grado Actual</span>
                <span className="info-valor-destacado">
                  {estudiante.gradoActual?.grado?.nombre_grado || estudiante.grado || '—'}
                </span>
                {estudiante.gradoActual?.grado?.descripcion && (
                  <span className="info-descripcion">{estudiante.gradoActual.grado.descripcion}</span>
                )}
              </div>
            </div>
          </div>

          {/* Progreso del Año Académico */}
          <div className="seccion-progreso">
            <div className="seccion-header">
              <Calendar className="icono-seccion" size={24} />
              <h3>Progreso del Año Académico {estudiante.gradoActual?.anio_academico || '2025'}</h3>
            </div>
            <div className="progreso-contenido">
              <div className="progreso-info">
                <span className="progreso-inicio">{progreso.mesInicio} 2025</span>
                <span className="progreso-porcentaje">{progreso.porcentaje}%</span>
                <span className="progreso-fin">{progreso.mesActual} 2025</span>
              </div>
              <div className="barra-progreso">
                <div 
                  className="barra-progreso-fill"
                  style={{ width: `${progreso.porcentaje}%` }}
                ></div>
              </div>
              <p className="progreso-texto">
                {progreso.diasTranscurridos} de {progreso.diasTotales} días transcurridos
              </p>
            </div>
          </div>

          {/* Historial Académico */}
          <div className="seccion-historial">
            <div className="seccion-header">
              <TrendingUp className="icono-seccion" size={24} />
              <h3>Historial Académico</h3>
            </div>
            <div className="historial-cards">
              <div className="historial-card card-observaciones">
                <div className="card-numero">{estudiante.totalObservaciones || 0}</div>
                <div className="card-texto">Total Observaciones</div>
                <div className="card-subtexto">Registradas este año</div>
              </div>
              
              <div className="historial-card card-asistencias">
                <div className="card-numero">{estudiante.asistencias?.length || 0}</div>
                <div className="card-texto">Total Asistencias</div>
                <div className="card-subtexto">Días registrados</div>
              </div>
              
              <div className="historial-card card-anio">
                <div className="card-numero">{estudiante.gradoActual?.anio_academico || '2025'}</div>
                <div className="card-texto">Año Académico</div>
                <div className="card-subtexto">{estudiante.gradoActual?.grado?.nombre_grado || '—'}</div>
              </div>
            </div>

            {/* Resumen de Asistencias */}
            {estudiante.resumenAsistencias && (
              <div className="resumen-asistencias">
                <p className="resumen-titulo">Resumen de Asistencias</p>
                <div className="resumen-grid">
                  <div className="resumen-item resumen-presente">
                    <div className="resumen-numero">{estudiante.resumenAsistencias["1"] || 0}</div>
                    <div className="resumen-label">Presente</div>
                  </div>
                  <div className="resumen-item resumen-tarde">
                    <div className="resumen-numero">{estudiante.resumenAsistencias["2"] || 0}</div>
                    <div className="resumen-label">Tarde</div>
                  </div>
                  <div className="resumen-item resumen-ausente">
                    <div className="resumen-numero">{estudiante.resumenAsistencias["3"] || 0}</div>
                    <div className="resumen-label">Ausente</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Acudientes */}
          <div className="seccion-acudientes">
            <div className="seccion-header">
              <Users className="icono-seccion" size={24} />
              <h3>Acudientes</h3>
            </div>
            {estudiante.acudientes?.length > 0 ? (
              estudiante.acudientes.map((acu, index) => (
                <div key={acu.id_acudiente || index} className="acudiente-card">
                  <div className="info-grid">
                    <div className="info-campo">
                      <span className="info-label">Nombre</span>
                      <span className="info-valor">{acu.persona?.nombre} {acu.persona?.apellido}</span>
                    </div>
                    <div className="info-campo">
                      <span className="info-label">Documento</span>
                      <span className="info-valor">{acu.numero_documento}</span>
                    </div>
                    <div className="info-campo">
                      <span className="info-label">Teléfono</span>
                      <span className="info-valor">{acu.persona?.telefono || '—'}</span>
                    </div>
                    <div className="info-campo">
                      <span className="info-label">Correo</span>
                      <span className="info-valor">{acu.persona?.correo || '—'}</span>
                    </div>
                    <div className="info-campo info-campo-full">
                      <span className="info-label">Dirección</span>
                      <span className="info-valor">{acu.persona?.direccion || '—'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="texto-vacio">No tiene acudientes registrados.</p>
            )}
          </div>

          {/* Hermanos */}
          <div className="seccion-hermanos">
            <div className="seccion-header">
              <Users className="icono-seccion" size={24} />
              <h3>Hermanos</h3>
            </div>
            {hermanos.length > 0 ? (
              hermanos.map((her, index) => (
                <div key={her.id_estudiante || index} className="hermano-item">
                  <div className="hermano-info">
                    <span className="hermano-nombre">{her.persona?.nombre} {her.persona?.apellido}</span>
                    <span className="hermano-doc">Doc: {her.numero_documento || her.persona?.numero_documento}</span>
                  </div>
                  <div className="hermano-grado">
                    {her.gradoActual?.grado?.nombre_grado || her.grado || '—'}
                  </div>
                </div>
              ))
            ) : (
              <p className="texto-vacio">No tiene hermanos registrados.</p>
            )}
          </div>

          {/* Novedades */}
          <div className="seccion-novedades">
            <div className="seccion-header">
              <AlertCircle className="icono-seccion" size={24} />
              <h3>Novedades Recientes</h3>
            </div>
            {estudiante.ultimaObservacion ? (
              <div className="novedad-destacada">
                <div className="novedad-header">
                  <span className="novedad-badge">Última Novedad</span>
                  <span className="novedad-fecha">
                    {new Date(estudiante.ultimaObservacion.fecha).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <p className="novedad-descripcion">{estudiante.ultimaObservacion.descripcion}</p>
              </div>
            ) : (
              <p className="texto-vacio">No tiene novedades recientes.</p>
            )}
          </div>

          {/* Observaciones */}
          <div className="seccion-observaciones">
            <div className="seccion-header">
              <FileText className="icono-seccion" size={24} />
              <h3>Observaciones</h3>
            </div>
            {estudiante.observaciones?.length > 0 ? (
              <div className="observaciones-lista">
                {estudiante.observaciones.map((obs, index) => (
                  <div key={obs.id_observacion || index} className="observacion-item">
                    <div className="observacion-header">
                      <span className="observacion-numero">Observación #{obs.id_observacion}</span>
                      <span className="observacion-fecha">
                        {new Date(obs.fecha).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    {obs.profesor && (
                      <p className="observacion-profesor">
                        Profesor: {obs.profesor.persona?.nombre} {obs.profesor.persona?.apellido}
                      </p>
                    )}
                    <p className="observacion-descripcion">{obs.descripcion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="texto-vacio">No tiene observaciones registradas.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cerrar-footer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetallesEstudiante;