import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import "../EstudianteAcudiente/estudiante_acudiente.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_URL = `${process.env.REACT_APP_API_URL}/api/acudientes/informacion/estudiantes`;

const EstudiantesCards = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vistaActual, setVistaActual] = useState("cards");
  const [estadisticas, setEstadisticas] = useState({
    totalEstudiantes: 0,
    totalAsistencias: 0,
    totalObservaciones: 0,
    promedioRendimiento: 0,
    estudiantesConObservaciones: 0
  });

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No se encontró token de autenticación");
          return;
        }

        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });

        const raw = Array.isArray(res.data?.estudiantes)
          ? res.data.estudiantes
          : [];

        const mapeados = raw.map((e) => ({
          id_estudiante: e.id_estudiante,
          nombre: e.nombre,
          apellido: e.apellido,
          documento: e.numero_documento || e.documento,
          grado: e.grado || "No asignado",
          observaciones: e.observaciones ?? 0,
          asistencias: e.asistencias ?? 0,
        }));

        setEstudiantes(mapeados);
        
        // Calcular estadísticas
        const totalObservaciones = mapeados.reduce((acc, e) => acc + (e.observaciones || 0), 0);
        const totalAsistencias = mapeados.reduce((acc, e) => acc + (e.asistencias || 0), 0);
        const total = totalObservaciones + totalAsistencias;
        const promedioRendimiento = Math.round((totalAsistencias / (total || 1)) * 100);
        const estudiantesConObservaciones = mapeados.filter(e => (e.observaciones || 0) > 0).length;
        
        setEstadisticas({
          totalEstudiantes: mapeados.length,
          totalAsistencias,
          totalObservaciones,
          promedioRendimiento,
          estudiantesConObservaciones
        });
        
      } catch (error) {
        console.error("Error cargando estudiantes:", error);
        setError(error.response?.data?.message || error.message || "Error al cargar estudiantes");
        setEstudiantes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudiantes();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <h4 className="fw-semibold text-primary mb-2">Cargando tu dashboard...</h4>
            <p className="text-muted">Obteniendo información de estudiantes</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger" role="alert">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                <div>
                  <h5 className="alert-heading mb-2">Error al cargar datos</h5>
                  <p className="mb-0">{error}</p>
                  <button 
                    className="btn btn-outline-danger btn-sm mt-2"
                    onClick={() => window.location.reload()}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body text-center py-5">
                <i className="bi bi-people display-1 text-muted mb-3"></i>
                <h4 className="fw-semibold text-muted mb-2">No hay estudiantes asociados</h4>
                <p className="text-muted mb-3">No se encontraron estudiantes asociados a tu cuenta.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header del Dashboard */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="h2 fw-bold mb-1">
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard del Acudiente
              </h1>
              <p className="text-muted mb-0">Seguimiento completo del rendimiento académico</p>
            </div>
            <div className="mt-2 mt-md-0">
              <span className="badge bg-primary fs-6">
                <i className="bi bi-person-fill me-1"></i>
                {estadisticas.totalEstudiantes} Estudiantes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card border-start border-primary border-4 shadow-sm h-100 hover-shadow">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" 
                       style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-people fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="fw-bold mb-0">{estadisticas.totalEstudiantes}</h3>
                  <p className="text-muted mb-0">Total Estudiantes</p>
                </div>
              </div>
              <div className="mt-3">
                <span className="badge bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-check-circle me-1"></i>
                  Activos
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-start border-success border-4 shadow-sm h-100 hover-shadow">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" 
                       style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-check-circle fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="fw-bold mb-0">{estadisticas.totalAsistencias}</h3>
                  <p className="text-muted mb-0">Asistencias Totales</p>
                </div>
              </div>
              <div className="mt-3">
                <span className="badge bg-success bg-opacity-10 text-success">
                  <i className="bi bi-arrow-up me-1"></i>
                  +12% vs anterior
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-start border-warning border-4 shadow-sm h-100 hover-shadow">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" 
                       style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-exclamation-triangle fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="fw-bold mb-0">{estadisticas.totalObservaciones}</h3>
                  <p className="text-muted mb-0">Observaciones Totales</p>
                </div>
              </div>
              <div className="mt-3">
                <span className="badge bg-warning bg-opacity-10 text-warning">
                  <i className="bi bi-people me-1"></i>
                  {estadisticas.estudiantesConObservaciones} estudiantes
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-start border-info border-4 shadow-sm h-100 hover-shadow">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center" 
                       style={{width: '50px', height: '50px'}}>
                    <i className="bi bi-graph-up fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="fw-bold mb-0">{estadisticas.promedioRendimiento}%</h3>
                  <p className="text-muted mb-0">Rendimiento Promedio</p>
                </div>
              </div>
              <div className="mt-3">
                <span className={`badge ${
                  estadisticas.promedioRendimiento >= 80 ? 'bg-success bg-opacity-10 text-success' :
                  estadisticas.promedioRendimiento >= 60 ? 'bg-warning bg-opacity-10 text-warning' :
                  'bg-danger bg-opacity-10 text-danger'
                }`}>
                  <i className={`bi ${
                    estadisticas.promedioRendimiento >= 80 ? 'bi-emoji-smile' :
                    estadisticas.promedioRendimiento >= 60 ? 'bi-emoji-neutral' :
                    'bi-emoji-frown'
                  } me-1`}></i>
                  {estadisticas.promedioRendimiento >= 80 ? 'Excelente' :
                   estadisticas.promedioRendimiento >= 60 ? 'Bueno' : 'Necesita atención'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Vista */}
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  className={`btn btn-lg px-4 ${
                    vistaActual === "cards" 
                      ? "btn-primary shadow" 
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setVistaActual("cards")}
                >
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Vista Cards
                </button>

                <button
                  className={`btn btn-lg px-4 ${
                    vistaActual === "lista" 
                      ? "btn-primary shadow" 
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setVistaActual("lista")}
                >
                  <i className="bi bi-list-ul me-2"></i>
                  Vista Lista
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas o lista de estudiantes - MODIFICADO PARA TARJETAS MÁS GRANDES */}
      <div className={`row g-4 ${vistaActual === "lista" ? "row-cols-1" : "row-cols-1 row-cols-md-1 row-cols-lg-2"}`}>
        {estudiantes.map((est) => {
          const obs = est.observaciones || 0;
          const asis = est.asistencias || 0;
          const total = obs + asis;
          const rendimiento = Math.round((asis / (total || 1)) * 100);

          // Determinar color según rendimiento
          const getRendimientoColor = () => {
            if (rendimiento >= 80) return "success";
            if (rendimiento >= 60) return "warning";
            return "danger";
          };

          const rendimientoColor = getRendimientoColor();

          return (
            <div className="col" key={est.id_estudiante}>
              <div className="card shadow-lg border-0 h-100 hover-lift student-card-large">
                {/* Header de la tarjeta */}
                <div className={`card-header bg-gradient bg-${rendimientoColor} text-white border-0 py-3`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title mb-2 fw-bold">
                        {est.nombre} {est.apellido}
                      </h5>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-white bg-opacity-25">
                          <i className="bi bi-mortarboard me-1"></i>
                          {est.grado}
                        </span>
                        <span className="badge bg-white bg-opacity-25">
                          <i className="bi bi-person-badge me-1"></i>
                          {est.documento}
                        </span>
                      </div>
                    </div>
                    <div className="avatar-circle-large bg-white bg-opacity-25 text-white d-flex align-items-center justify-content-center">
                      {est.nombre?.charAt(0)}{est.apellido?.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Body de la tarjeta */}
                <div className="card-body d-flex flex-column">
                  {/* Estadísticas rápidas - Mejoradas */}
                  <div className="row text-center mb-4">
                    <div className="col-4">
                      <div className="stat-box-large">
                        <div className="stat-icon-large bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                          <i className="bi bi-exclamation-triangle fs-5"></i>
                        </div>
                        <h3 className="fw-bold mb-5 display-6">{obs}</h3>
                        <small className="text-muted fw-semibold">Observaciones</small>
                      </div>
                    </div>
                    
                    <div className="col-4">
                      <div className="stat-box-large">
                        <div className="stat-icon-large bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                          <i className="bi bi-check-circle fs-5"></i>
                        </div>
                        <h3 className="fw-bold mb-5 display-6">{asis}</h3>
                        <small className="text-muted fw-semibold">Asistencias</small>
                      </div>
                    </div>
                    
                    <div className="col-4">
                      <div className="stat-box-large">
                        <div className={`stat-icon-large bg-${rendimientoColor} bg-opacity-10 text-${rendimientoColor} rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}>
                          <i className={`bi ${
                            rendimiento >= 80 ? 'bi-arrow-up-circle' :
                            rendimiento >= 60 ? 'bi-dash-circle' : 'bi-arrow-down-circle'
                          } fs-5`}></i>
                        </div>
                        <h3 className={`fw-bold mb-5 display-6 text-${rendimientoColor}`}>
                          {rendimiento}%
                        </h3>
                        <small className="text-muted fw-semibold">Rendimiento</small>
                      </div>
                    </div>
                  </div>

                  {/* Gráficos - Más grandes */}
                  <div className="row g-3 mb-5 flex-grow-1">
                    <div className="col-6">
                      <div className="chart-container-large">
                        <h6 className="chart-title-large text-center mb-3">
                          <i className="bi bi-bar-chart me-2"></i>
                          Comparación
                        </h6>
                        <div className="chart-wrapper-large">
                          <Bar
                            data={{
                              labels: ["Observaciones", "Asistencias"],
                              datasets: [
                                {
                                  data: [obs, asis],
                                  backgroundColor: ["rgba(220, 53, 69, 0.9)", "rgba(25, 135, 84, 0.9)"],
                                  borderColor: ["#dc3545", "#198754"],
                                  borderWidth: 2,
                                  borderRadius: 8,
                                  borderSkipped: false,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: { 
                                legend: { display: false },
                                tooltip: {
                                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                  titleColor: '#fff',
                                  bodyColor: '#fff',
                                  padding: 12,
                                  cornerRadius: 8,
                                  titleFont: { size: 14 },
                                  bodyFont: { size: 14 }
                                }
                              },
                              scales: {
                                y: { 
                                  beginAtZero: true,
                                  grid: { 
                                    display: true,
                                    color: 'rgba(0, 0, 0, 0.05)'
                                  },
                                  ticks: { 
                                    color: '#6c757d',
                                    font: { size: 12 },
                                    padding: 5
                                  }
                                },
                                x: { 
                                  grid: { display: false },
                                  ticks: { 
                                    color: '#6c757d',
                                    font: { size: 12 }
                                  }
                                }
                              },
                              animation: {
                                duration: 1500,
                                easing: 'easeInOutQuart'
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="chart-container-large">
                        <h6 className="chart-title-large text-center mb-3">
                          <i className="bi bi-pie-chart me-2"></i>
                          Distribución
                        </h6>
                        <div className="chart-wrapper-large">
                          <Doughnut
                            data={{
                              labels: ["Observaciones", "Asistencias"],
                              datasets: [
                                {
                                  data: total ? [obs, asis] : [1],
                                  backgroundColor: ["rgba(220, 53, 69, 0.9)", "rgba(25, 135, 84, 0.9)"],
                                  borderColor: ["#dc3545", "#198754"],
                                  borderWidth: 3,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: { 
                                legend: { 
                                  display: true,
                                  position: 'bottom',
                                  labels: {
                                    color: '#495057',
                                    font: { size: 12 },
                                    padding: 20
                                  }
                                },
                                tooltip: {
                                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                  titleColor: '#fff',
                                  bodyColor: '#fff',
                                  padding: 12,
                                  cornerRadius: 8
                                }
                              },
                              cutout: "55%",
                              animation: {
                                animateScale: true,
                                animateRotate: true,
                                duration: 2000
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso - Mejorada */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-semibold mb-0">
                        <i className="bi bi-graph-up me-2"></i>
                        Progreso Académico
                      </h6>
                      <h6 className={`fw-bold text-${rendimientoColor} mb-0`}>
                        {rendimiento}%
                      </h6>
                    </div>
                    <div className="progress progress-large" style={{ height: '12px' }}>
                      <div 
                        className={`progress-bar bg-${rendimientoColor} progress-bar-striped progress-bar-animated`}
                        role="progressbar" 
                        style={{ width: `${rendimiento}%` }}
                        aria-valuenow={rendimiento}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-muted">Bajo</small>
                      <small className="text-muted">Excelente</small>
                    </div>
                  </div>
                </div>

                {/* Footer de la tarjeta */}
                <div className="card-footer bg-transparent border-top-0 py-3">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-primary px-4 d-flex align-items-center gap-2">
                      <i className="bi bi-eye"></i>
                      Ver detalles completos
                    </button>
                    <button className="btn btn-outline-primary px-3 d-flex align-items-center gap-2">
                      <i className="bi bi-envelope"></i>
                      Contactar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Agregar estilos CSS personalizados para tarjetas más grandes


// Insertar estilos en el documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");

  document.head.appendChild(styleSheet);
}

export default EstudiantesCards;