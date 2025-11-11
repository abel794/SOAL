// src/componentes/VistaAcudiente/AcudienteObservacionCard/AcudienteObservacionCard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../AcudienteObservacionCard/AcudienteObservacionCard.css";


/* ---------- ObservacionCard (presentacional) ---------- */
const ObservacionCard = ({ observacion, onToggleLeida }) => {
  const estudianteNombre = observacion.estudianteNombre ?? observacion.nombre ?? "";
  const estudianteApellido = observacion.estudianteApellido ?? observacion.apellido ?? "";
  const nombreCompleto = `${estudianteNombre} ${estudianteApellido}`.trim();

  const grado = observacion.grado ?? observacion.nombre_grado ?? "No definido";
  const categoria = observacion.categoria ?? "General";
  const gravedad = observacion.gravedad ?? "Leve";
  const descripcion = observacion.descripcion ?? "-";

  const fecha = observacion.fecha ?? observacion.createdAt ?? null;
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto || "Alumno")}&background=0D6EFD&color=fff&size=128`;

  // Colores según gravedad
  const getColorGravedad = (nivel) => {
    const colores = {
      'Leve': '#28a745',
      'Moderada': '#ffc107',
      'Grave': '#fd7e14',
      'Crítica': '#dc3545',
      'Urgente': '#dc3545'
    };
    return colores[nivel] || '#6c757d';
  };

  return (
    <div className={`observacion-card ${observacion.leida ? 'leida' : 'no-leida'}`}>
      <div className="observacion-avatar">
        <img
          src={avatar}
          alt={nombreCompleto}
          className="avatar-img"
          onError={(e) => { 
            e.currentTarget.onerror = null; 
            e.currentTarget.src = avatar; 
          }}
        />
      </div>
      
      <div className="observacion-content">
        <div className="observacion-header">
          <div className="estudiante-info">
            <strong className="estudiante-nombre">{nombreCompleto || "Nombre desconocido"}</strong>
            <span className="observacion-grado">Grado: {grado}</span>
          </div>
          <div className="observacion-meta">
            <span 
              className="categoria-badge"
              style={{ backgroundColor: getColorGravedad(gravedad) }}
            >
              {categoria}
            </span>
            <span 
              className="gravedad-badge"
              style={{ backgroundColor: getColorGravedad(gravedad) }}
            >
              {gravedad}
            </span>
          </div>
        </div>
        
        <p className="observacion-descripcion">{descripcion}</p>
        
        <div className="observacion-footer">
          <small className="observacion-fecha">
            {fecha ? new Date(fecha).toLocaleString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : ""}
          </small>
          
          {!observacion.leida && (
            <button
              onClick={() => onToggleLeida(observacion.id_observacion)}
              className="btn-marcar-leida"
              title="Marcar como leída"
            >
              <span className="check-icon">✔️</span>
              <span className="btn-text">Marcar leída</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Componente principal ---------- */
const AcudienteObservacionCard = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CARGAR TODOS LOS DATOS DE UNA SOLA VEZ
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No se encontró el token de autenticación");
          return;
        }

        // Usar el endpoint que proporciona estudiantes y observaciones juntos
        const res = await axios.get(
          "http://localhost:3000/api/acudientes/observaciones",
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
          }
        );

        console.log("📡 Datos cargados:", res.data);

        if (res.data && res.data.success) {
          // Extraer estudiantes y observaciones de la respuesta
          const estudiantesData = res.data.data.estudiantes || [];
          const observacionesData = res.data.data.observaciones || [];
          
          setEstudiantes(estudiantesData);
          setObservaciones(observacionesData.map(obs => ({ ...obs, leida: false })));
          
          // Seleccionar automáticamente el primer estudiante si existe
          if (estudiantesData.length > 0) {
            setSelectedStudentId(estudiantesData[0].id_estudiante);
          }
        } else {
          setError("Formato de respuesta inesperado");
        }
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
        setError(
          err.response?.data?.message || 
          err.message || 
          "Error al cargar la información de observaciones"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // SELECCIONAR ESTUDIANTE
  const handleSelectStudent = (est) => {
    const id = est.id_estudiante;
    setSelectedStudentId(id);
  };

  // Marcar observación como leída
  const handleToggleLeida = (observacionId) => {
    setObservaciones(prev => 
      prev.map(obs => 
        obs.id_observacion === observacionId 
          ? { ...obs, leida: true }
          : obs
      )
    );
  };

  // Obtener observaciones del estudiante seleccionado
  const observacionesDelSeleccionado = selectedStudentId 
    ? observaciones.filter(obs => obs.id_estudiante === selectedStudentId)
    : [];

  // Obtener estudiante seleccionado
  const estudianteSeleccionado = estudiantes.find(est => est.id_estudiante === selectedStudentId);

  if (loading) {
    return (
      <div className="acudiente-observaciones-container">
        <div className="estado-mensaje loading">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Cargando observaciones...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="acudiente-observaciones-container">
        <div className="estado-mensaje error">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div className="acudiente-observaciones-container">
        <div className="estado-mensaje info">
          No hay estudiantes asociados a tu cuenta.
        </div>
      </div>
    );
  }

  return (
    <div className="acudiente-observaciones-container">
      <h2 className="seccion-titulo">Observaciones</h2>

      {/* Selector de estudiantes */}
      <div className="estudiantes-selector">
        <div className="estudiantes-grid">
          {estudiantes.map(est => {
            const observacionesEstudiante = observaciones.filter(obs => obs.id_estudiante === est.id_estudiante);
            const isSelected = selectedStudentId === est.id_estudiante;
            const tieneObservaciones = observacionesEstudiante.length > 0;
            
            return (
              <div
                key={est.id_estudiante}
                role="button"
                onClick={() => handleSelectStudent(est)}
                className={`estudiante-selector-card ${isSelected ? 'activo' : ''} ${
                  tieneObservaciones ? 'con-observaciones' : 'sin-observaciones'
                }`}
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleSelectStudent(est)}
              >
                <div className="estudiante-avatar">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(est.nombre + ' ' + est.apellido)}&background=0D6EFD&color=fff&size=64`}
                    alt={`${est.nombre} ${est.apellido}`}
                    className="avatar-img"
                  />
                </div>
                <div className="estudiante-info">
                  <div className="estudiante-nombre">
                    {est.nombre} {est.apellido}
                  </div>
                  <div className="estudiante-grado">
                    {est.grado}
                  </div>
                  <div className="estudiante-stats">
                    <span className="observaciones-count">
                      {observacionesEstudiante.length} observaciones
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de observaciones */}
      {selectedStudentId && estudianteSeleccionado && (
        <div className="observaciones-seccion">
          <div className="observaciones-header">
            <h3 className="observaciones-titulo">
              Observaciones de{" "}
              <span className="estudiante-seleccionado">
                {estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}
              </span>
            </h3>
            <div className="observaciones-count">
              {observacionesDelSeleccionado.length} observación(es)
            </div>
          </div>

          {observacionesDelSeleccionado.length === 0 ? (
            <div className="estado-mensaje info">
              No hay observaciones para este estudiante.
            </div>
          ) : (
            <div className="observaciones-list">
              {observacionesDelSeleccionado.map(obs => (
                <ObservacionCard
                  key={obs.id_observacion}
                  observacion={obs}
                  onToggleLeida={handleToggleLeida}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcudienteObservacionCard;