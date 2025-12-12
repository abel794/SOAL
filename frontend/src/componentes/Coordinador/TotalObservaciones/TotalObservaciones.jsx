import React, { useState, useEffect } from 'react';
import {
  FaClipboardList,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaInfoCircle
} from 'react-icons/fa';
import './TotalObservaciones.css';

const ListaObservaciones = () => {
  const [datos, setDatos] = useState({
    totalObservaciones: 0,
    observaciones: []
  });
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('fecha');
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const [observacionSeleccionada, setObservacionSeleccionada] = useState(null);

  // 🔹 Cargar datos al montar el componente
  useEffect(() => {
    cargarObservaciones();
  }, []);

  const cargarObservaciones = async () => {
    try {
      // Reemplaza esta URL con tu endpoint real
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/observaciones/contar`);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const data = await res.json();
      console.log("📋 Datos de observaciones:", data);

      setDatos({
        totalObservaciones: data.totalObservaciones || 0,
        observaciones: data.observaciones || []
      });
    } catch (err) {
      console.error("❌ Error cargando observaciones:", err);
      
    }
  };

  const { totalObservaciones, observaciones } = datos;

  // 🔹 Filtrar y ordenar observaciones
  const observacionesFiltradas = observaciones
    .filter(obs => {
      const cumpleTexto = obs.descripcion.toLowerCase().includes(filtroTexto.toLowerCase());
      const cumpleFecha = !filtroFecha || obs.fecha === filtroFecha;
      return cumpleTexto && cumpleFecha;
    })
    .sort((a, b) => {
      if (ordenarPor === 'fecha') {
        return ordenAscendente 
          ? new Date(a.fecha) - new Date(b.fecha)
          : new Date(b.fecha) - new Date(a.fecha);
      } else if (ordenarPor === 'id') {
        return ordenAscendente 
          ? a.id_observacion - b.id_observacion
          : b.id_observacion - a.id_observacion;
      }
      return 0;
    });

  // 🔹 Fechas únicas para el filtro
  const fechasUnicas = [...new Set(observaciones.map(obs => obs.fecha))].sort().reverse();

  // 🔹 Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 🔹 Alternar orden
  const alternarOrden = (campo) => {
    if (ordenarPor === campo) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdenAscendente(false);
    }
  };

  return (
    <div className="container-fluid py-4 lista-observaciones-container">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">
              <FaClipboardList className="me-2 text-primary" />
              Lista de Observaciones
            </h2>
            <div className="badge bg-primary fs-6">
              Total: {totalObservaciones} observaciones
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar en descripciones..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <select 
            className="form-select"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          >
            <option value="">Todas las fechas</option>
            {fechasUnicas.map(fecha => (
              <option key={fecha} value={fecha}>
                {formatearFecha(fecha)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 mb-3">
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => alternarOrden('fecha')}
              title="Ordenar por fecha"
            >
              <FaSort className="me-1" />
              Fecha {ordenarPor === 'fecha' && (ordenAscendente ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-3">
              <div className="row text-center">
                <div className="col-md-3">
                  <h6 className="text-muted mb-1">Mostrando</h6>
                  <h4 className="text-primary mb-0">{observacionesFiltradas.length}</h4>
                </div>
                <div className="col-md-3">
                  <h6 className="text-muted mb-1">Filtradas</h6>
                  <h4 className="text-warning mb-0">{observaciones.length - observacionesFiltradas.length}</h4>
                </div>
                <div className="col-md-3">
                  <h6 className="text-muted mb-1">Fechas distintas</h6>
                  <h4 className="text-info mb-0">{fechasUnicas.length}</h4>
                </div>
                <div className="col-md-3">
                  <h6 className="text-muted mb-1">Más reciente</h6>
                  <h6 className="text-success mb-0">
                    {observaciones.length > 0 ? formatearFecha(observaciones[0].fecha) : 'N/A'}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Observaciones */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaClipboardList className="me-2 text-primary" />
                Observaciones Registradas
              </h5>
              <span className="badge bg-secondary">
                {observacionesFiltradas.length} de {totalObservaciones}
              </span>
            </div>
            
            <div className="card-body p-0">
              {observacionesFiltradas.length > 0 ? (
                <div className="list-group list-group-flush">
                  {observacionesFiltradas.map((observacion) => (
                    <div 
                      key={observacion.id_observacion}
                      className="list-group-item list-group-item-action observacion-item"
                      onClick={() => setObservacionSeleccionada(observacion)}
                    >
                      <div className="row align-items-center">
                        <div className="col-md-1">
                          <span className="badge bg-light text-dark fs-6">
                            #{observacion.id_observacion}
                          </span>
                        </div>
                        <div className="col-md-3">
                          <div className="d-flex align-items-center">
                            <FaCalendarAlt className="text-muted me-2" />
                            <span className="fecha-observacion">
                              {formatearFecha(observacion.fecha)}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-0 descripcion-observacion">
                            {observacion.descripcion}
                          </p>
                        </div>
                        <div className="col-md-2 text-end">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setObservacionSeleccionada(observacion);
                            }}
                          >
                            <FaEye className="me-1" />
                            Ver
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaInfoCircle className="text-muted fs-1 mb-3" />
                  <h5 className="text-muted">No se encontraron observaciones</h5>
                  <p className="text-muted">
                    {filtroTexto || filtroFecha 
                      ? "Intenta con otros criterios de búsqueda" 
                      : "No hay observaciones registradas"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalle */}
      {observacionSeleccionada && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Observación #{observacionSeleccionada.id_observacion}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setObservacionSeleccionada(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-12">
                    <strong>Fecha:</strong>
                    <div className="d-flex align-items-center mt-1">
                      <FaCalendarAlt className="text-primary me-2" />
                      {formatearFecha(observacionSeleccionada.fecha)}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <strong>Descripción:</strong>
                    <p className="mt-2 p-3 bg-light rounded">
                      {observacionSeleccionada.descripcion}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setObservacionSeleccionada(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaObservaciones;