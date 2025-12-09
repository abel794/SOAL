// 🔥 ProfesoresActivos.jsx - ULTRA PREMIUM EDITION 🔥
import React, { useEffect, useState } from "react";
import "./ProfesoresActivos.css";

export default function ProfesoresActivos() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCargo, setFilterCargo] = useState("todos");
  const [vistaActual, setVistaActual] = useState("cards"); // 'cards' o 'tabla'
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
const [mostrarModal, setMostrarModal] = useState(false);


  const token = localStorage.getItem("token");

  // ================================
  // 🔥 Cargar profesores completos
  // ================================
  const cargarProfesores = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/coordinador/dashboard/funcionarios/completos",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();

      // Filtrar profesores activos
      const filtrados =
        data.profesores?.filter(
          (p) =>
            p.usuario?.TipoUsuario?.nombre === "Profesor" &&
            p.usuario?.EstadoUsuario?.nombre === "Activo"
        ) || [];

      setProfesores(filtrados);
    } catch (error) {
      console.error("❌ Error cargando profesores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProfesores();
  }, []);

  // ================================
  // 🔍 Filtrado de profesores
  // ================================
  const profesoresFiltrados = profesores.filter((prof) => {
    const nombreCompleto = `${prof.persona?.nombre} ${prof.persona?.apellido}`.toLowerCase();
    const matchSearch = nombreCompleto.includes(searchTerm.toLowerCase()) ||
                        prof.persona?.correo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCargo = filterCargo === "todos" || prof.cargo === filterCargo;
    
    return matchSearch && matchCargo;
  });

  // Obtener cargos únicos para el filtro
  const cargosUnicos = [...new Set(profesores.map(p => p.cargo).filter(Boolean))];

  // ================================
  // 📊 Estadísticas
  // ================================
  const stats = {
    total: profesores.length,
    conGrados: profesores.filter(p => p.gradosAsignados?.length > 0).length,
    sinGrados: profesores.filter(p => !p.gradosAsignados || p.gradosAsignados.length === 0).length,
    totalGrados: profesores.reduce((acc, p) => acc + (p.gradosAsignados?.length || 0), 0)
  };

  // ================================
  // ⏳ Loader Ultra
  // ================================
  if (loading) {
    return (
      <div className="profesores-loading-ultra">
        <div className="loading-spinner-ultra"></div>
        <p className="loading-text-ultra">Cargando profesores...</p>
      </div>
    );
  }

  // ================================
  // 🎨 Vista Principal
  // ================================
  return (
    <div className="profesores-container-ultra">
      {/* HEADER ULTRA */}
      <div className="profesores-header-ultra">
        <div className="header-content-ultra">
          <div className="header-title-ultra">
            <h1>👨‍🏫 Profesores Activos</h1>
            <p>Gestión y seguimiento del cuerpo docente</p>
          </div>
          <div className="header-badge-ultra">
            <span className="badge-number">{profesores.length}</span>
            <span className="badge-text">Profesores</span>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS ULTRA */}
      <div className="stats-section-ultra">
        <div className="stat-card-mini total-stat">
          <div className="stat-icon-mini">👥</div>
          <div className="stat-data-mini">
            <h3>{stats.total}</h3>
            <p>Total Profesores</p>
          </div>
        </div>

        <div className="stat-card-mini grados-stat">
          <div className="stat-icon-mini">📚</div>
          <div className="stat-data-mini">
            <h3>{stats.conGrados}</h3>
            <p>Con Grados Asignados</p>
          </div>
        </div>

        <div className="stat-card-mini sin-grados-stat">
          <div className="stat-icon-mini">⚠️</div>
          <div className="stat-data-mini">
            <h3>{stats.sinGrados}</h3>
            <p>Sin Grados</p>
          </div>
        </div>

        <div className="stat-card-mini total-grados-stat">
          <div className="stat-icon-mini">🎯</div>
          <div className="stat-data-mini">
            <h3>{stats.totalGrados}</h3>
            <p>Asignaciones Totales</p>
          </div>
        </div>
      </div>

      {/* CONTROLES ULTRA */}
      <div className="controles-section-ultra">
        {/* Búsqueda */}
        <div className="search-box-ultra">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-ultra"
          />
          {searchTerm && (
            <button 
              className="search-clear"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtro por cargo */}
        <div className="filter-box-ultra">
          <span className="filter-icon">📋</span>
          <select
            value={filterCargo}
            onChange={(e) => setFilterCargo(e.target.value)}
            className="filter-select-ultra"
          >
            <option value="todos">Todos los cargos</option>
            {cargosUnicos.map(cargo => (
              <option key={cargo} value={cargo}>{cargo}</option>
            ))}
          </select>
        </div>

        {/* Toggle Vista */}
        <div className="vista-toggle-ultra">
          <button
            className={`vista-btn-ultra ${vistaActual === 'cards' ? 'active' : ''}`}
            onClick={() => setVistaActual('cards')}
          >
            <span>🎴</span> Cards
          </button>
          <button
            className={`vista-btn-ultra ${vistaActual === 'tabla' ? 'active' : ''}`}
            onClick={() => setVistaActual('tabla')}
          >
            <span>📋</span> Tabla
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {profesoresFiltrados.length === 0 ? (
        <div className="empty-state-ultra">
          <div className="empty-icon-ultra">🔍</div>
          <h3>No se encontraron profesores</h3>
          <p>
            {searchTerm || filterCargo !== "todos"
              ? "Intenta cambiar los filtros de búsqueda"
              : "No hay profesores activos registrados"}
          </p>
          {(searchTerm || filterCargo !== "todos") && (
            <button 
              className="btn-clear-filters"
              onClick={() => {
                setSearchTerm("");
                setFilterCargo("todos");
              }}
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      ) : vistaActual === 'cards' ? (
        // VISTA CARDS ULTRA
        <div className="profesores-grid-ultra">
          {profesoresFiltrados.map((prof, idx) => (
            <div key={prof.id_funcionario} className="profesor-card-ultra">
              {/* Avatar y nombre */}
              <div className="profesor-header-card">
                <div className="profesor-avatar-ultra">
                  {prof.persona?.nombre?.charAt(0)}{prof.persona?.apellido?.charAt(0)}
                </div>
                <div className="profesor-info-card">
                  <h3>{prof.persona?.nombre} {prof.persona?.apellido}</h3>
                  <span className="profesor-cargo-badge">
                    {prof.cargo || "Sin cargo"}
                  </span>
                </div>
                <div className="profesor-numero">#{idx + 1}</div>
              </div>

              {/* Información */}
              <div className="profesor-details-card">
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <div className="detail-content">
                    <span className="detail-label">Correo</span>
                    <a href={`mailto:${prof.persona?.correo}`} className="detail-value email-link">
                      {prof.persona?.correo || "No especificado"}
                    </a>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🆔</span>
                  <div className="detail-content">
                    <span className="detail-label">Documento</span>
                    <span className="detail-value documento-code">
                      {prof.numero_documento || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="detail-item full-width">
                  <span className="detail-icon">📚</span>
                  <div className="detail-content">
                    <span className="detail-label">Grados Asignados</span>
                    <div className="grados-container">
                      {prof.gradosAsignados?.length > 0 ? (
                        [...new Set(prof.gradosAsignados.map(g => g.grado?.nombre_grado))]
                          .map((grado, i) => (
                            <span key={i} className="grado-badge-ultra">
                              {grado}
                            </span>
                          ))
                      ) : (
                        <span className="sin-grados-text">Sin grados asignados</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="profesor-actions-card">
                <button
                    className="btn-tabla-primary"
                    title="Ver perfil"
                    onClick={() => {
                      setProfesorSeleccionado(prof);
                      setMostrarModal(true);
                    }}
                  >
                    👁️
                  </button>
                <button className="btn-action-secondary">
                  <span>✉️</span> Contactar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // VISTA TABLA ULTRA
        <div className="tabla-container-ultra">
          <div className="tabla-wrapper-ultra">
            <table className="tabla-profesores-ultra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre Completo</th>
                  <th>Correo</th>
                  <th>Cargo</th>
                  <th>Grados</th>
                  <th>Documento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {profesoresFiltrados.map((prof, idx) => (
                  <tr key={prof.id_funcionario}>
                    <td className="td-numero">
                      <span className="numero-badge">{idx + 1}</span>
                    </td>
                    
                    <td className="td-nombre">
                      <div className="nombre-cell">
                        <div className="avatar-mini">
                          {prof.persona?.nombre?.charAt(0)}{prof.persona?.apellido?.charAt(0)}
                        </div>
                        <span>{prof.persona?.nombre} {prof.persona?.apellido}</span>
                      </div>
                    </td>

                    <td className="td-correo">
                      <a href={`mailto:${prof.persona?.correo}`} className="correo-link">
                        {prof.persona?.correo}
                      </a>
                    </td>

                    <td className="td-cargo">
                      <span className="cargo-badge-tabla">
                        {prof.cargo || "Sin cargo"}
                      </span>
                    </td>

                    <td className="td-grados">
                      {prof.gradosAsignados?.length > 0 ? (
                        <div className="grados-cell">
                          {[...new Set(prof.gradosAsignados.map(g => g.grado?.nombre_grado))]
                            .slice(0, 2)
                            .map((grado, i) => (
                              <span key={i} className="grado-mini-badge">
                                {grado}
                              </span>
                            ))}
                          {prof.gradosAsignados.length > 2 && (
                            <span className="grado-more">
                              +{prof.gradosAsignados.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="sin-grados-tabla">Sin grados</span>
                      )}
                    </td>

                    <td className="td-documento">
                      <code className="documento-code-tabla">
                        {prof.numero_documento || "N/A"}
                      </code>
                    </td>

                    <td className="td-acciones">
                      <button 
                        className="btn-action-primary"
                        onClick={() => {
                          setProfesorSeleccionado(prof);
                          setMostrarModal(true);
                        }}
                      >
                        <span>👁️</span> Ver Perfil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer de tabla */}
          <div className="tabla-footer-ultra">
            <span>Mostrando {profesoresFiltrados.length} de {profesores.length} profesores</span>
          </div>
        </div>
      )}
      {mostrarModal && profesorSeleccionado && (
  <div className="modal-overlay-ultra">
    <div className="modal-content-ultra modal-scroll">

      {/* HEADER */}
      <div className="modal-header-ultra">
        <h2>
          {profesorSeleccionado.persona?.nombre}{" "}
          {profesorSeleccionado.persona?.apellido}
        </h2>

        <button className="modal-close-ultra" onClick={() => setMostrarModal(false)}>
          ✕
        </button>
      </div>

      {/* DATOS PRINCIPALES */}
      <div className="modal-body-ultra">
        <p><strong>📧 Correo:</strong> {profesorSeleccionado.persona?.correo}</p>
        <p><strong>🆔 Documento:</strong> {profesorSeleccionado.numero_documento}</p>
        <p><strong>💼 Cargo:</strong> {profesorSeleccionado.cargo}</p>

        <hr />

        {/* GRADOS */}
        <h3>📚 Grados Asignados</h3>
        {profesorSeleccionado.gradosAsignados?.length ? (
          <ul>
            {[
              ...new Set(
                profesorSeleccionado.gradosAsignados.map((g) => g.grado?.nombre_grado)
              ),
            ].map((g, i) => (
              <li key={i}>• {g}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Sin grados asignados</p>
        )}

        <hr />

        {/* OBSERVACIONES */}
        <h3>📘 Observaciones Generadas</h3>
        {profesorSeleccionado.observaciones?.length ? (
          <table className="tabla-modal">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Gravedad</th>
                <th>ID Estudiante</th>
              </tr>
            </thead>
            <tbody>
              {profesorSeleccionado.observaciones.map((obs) => (
                <tr key={obs.id_observacion}>
                  <td>{obs.fecha}</td>
                  <td>{obs.descripcion}</td>
                  <td>{obs.categoria?.nombre}</td>
                  <td>{obs.gravedad?.nombre}</td>
                  <td>{obs.id_estudiante}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No ha generado observaciones</p>
        )}

        <hr />

        {/* ASISTENCIAS */}
        <h3>📝 Asistencias Registradas</h3>
        {profesorSeleccionado.asistencias?.length ? (
          <table className="tabla-modal">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estudiante</th>
                <th>Estado</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {profesorSeleccionado.asistencias.map((asis) => (
                <tr key={asis.id_asistencia}>
                  <td>{asis.fecha}</td>
                  <td>
                    {asis.Estudiante?.persona?.nombre}{" "}
                    {asis.Estudiante?.persona?.apellido}
                  </td>
                  <td>{asis.id_estado_asistencia}</td>
                  <td>{asis.observacion || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No ha registrado asistencias</p>
        )}

        <hr />

        {/* CITAS */}
        <h3>📅 Citas Agendadas</h3>
        {profesorSeleccionado.citas?.length ? (
          <table className="tabla-modal">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Estudiante</th>
                <th>Acudiente</th>
              </tr>
            </thead>
            <tbody>
              {profesorSeleccionado.citas.map((cita) => (
                <tr key={cita.id_cita}>
                  <td>{new Date(cita.fecha_cita).toLocaleString()}</td>
                  <td>{cita.motivo}</td>
                  <td>{cita.estado}</td>
                  <td>{cita.estudiante?.id_estudiante}</td>
                  <td>{cita.acudiente?.numero_documento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No tiene citas registradas</p>
        )}
      </div>

      {/* FOOTER */}
      <div className="modal-footer-ultra">
        <button className="btn-action-secondary" onClick={() => setMostrarModal(false)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}