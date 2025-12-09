// 📂 src/componentes/Acudiente/EstudiantesCards.jsx - 🔥 ULTIMATE EDITION 🔥
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import "./estudiante_acudiente.css";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const EstudiantesCards = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [vistaActual, setVistaActual] = useState('cards'); // 'cards' o 'lista'
=======
  const [menuActivo, setMenuActivo] = useState("dashboard");
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3

  // CARGAR TODOS LOS DATOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token de autenticación");
          return;
        }

        const res = await axios.get(
          "http://localhost:3000/api/acudientes/informacion/estudiantes",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        if (res.data && res.data.success) {
          setEstudiantes(res.data.estudiantes || []);
          setObservaciones(res.data.observaciones || []);
        } else {
          setEstudiantes([]);
          setObservaciones([]);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Error al cargar la información de estudiantes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="acudiente-loading">
<<<<<<< HEAD
        <div className="loading-spinner-ultra"></div>
        <p className="loading-text">Cargando tu dashboard...</p>
=======
        <div className="loading-spinner"></div>
        <p>Cargando información de estudiantes...</p>
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3
      </div>
    );
  }

  if (error) {
    return (
      <div className="acudiente-error">
<<<<<<< HEAD
        <div className="error-icon-ultra">⚠️</div>
        <h3>Ups! Algo salió mal</h3>
        <p>{error}</p>
        <button className="retry-btn-ultra" onClick={() => window.location.reload()}>
          🔄 Reintentar
=======
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar los datos</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Reintentar
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3
        </button>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div className="acudiente-empty">
<<<<<<< HEAD
        <div className="empty-icon-ultra">📚</div>
        <h3>No hay estudiantes registrados</h3>
        <p>Aún no tienes estudiantes asociados a tu cuenta.</p>
=======
        <div className="empty-icon">👨‍🎓</div>
        <h3>No hay estudiantes registrados</h3>
        <p>No se encontraron estudiantes asociados a su cuenta.</p>
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3
      </div>
    );
  }

<<<<<<< HEAD
  // Calcular estadísticas
  const totalObservaciones = estudiantes.reduce((acc, e) => acc + (e.observaciones || 0), 0);
  const totalAsistencias = estudiantes.reduce((acc, e) => acc + (e.asistencias || 0), 0);
  const estudiantesConObs = estudiantes.filter(e => (e.observaciones || 0) > 0).length;
  const promedioRendimiento = Math.round(
    estudiantes.reduce((acc, e) => {
      const total = (e.observaciones || 0) + (e.asistencias || 0);
      return acc + (total > 0 ? ((e.asistencias || 0) / total) * 100 : 0);
    }, 0) / estudiantes.length
  );

  return (
    <div className="acudiente-panel">
      {/* HEADER ULTRA */}
=======
  return (
    <div className="acudiente-panel">
      {/* Header Principal */}
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3
      <header className="acudiente-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Panel Acudiente</h1>
            <p>Gestión y seguimiento de estudiantes</p>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <span>CD</span>
            </div>
            <div className="user-details">
              <span className="user-name">Camilo Descartes</span>
              <span className="user-email">correo@camilo.es</span>
            </div>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* NAVEGACIÓN ULTRA */}
      <nav className="acudiente-nav">
        <div className="nav-container">
          <div className="nav-items">
            <button className="nav-item active">
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">🔔</span>
              <span className="nav-text">Notificaciones</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">📨</span>
              <span className="nav-text">PQR</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">📝</span>
              <span className="nav-text">Justificaciones</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">📋</span>
              <span className="nav-text">Historial</span>
            </button>
=======
      {/* Menú de Navegación */}
      <nav className="acudiente-nav">
        <div className="nav-container">
          <div className="nav-items">
            <button 
              className={`nav-item ${menuActivo === 'dashboard' ? 'active' : ''}`}
              onClick={() => setMenuActivo('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </button>
            <button 
              className={`nav-item ${menuActivo === 'notificaciones' ? 'active' : ''}`}
              onClick={() => setMenuActivo('notificaciones')}
            >
              <span className="nav-icon">🔔</span>
              <span className="nav-text">Notificaciones</span>
            </button>
            <button 
              className={`nav-item ${menuActivo === 'por' ? 'active' : ''}`}
              onClick={() => setMenuActivo('por')}
            >
              <span className="nav-icon">📨</span>
              <span className="nav-text">Enviar POR</span>
            </button>
            <button 
              className={`nav-item ${menuActivo === 'justificaciones' ? 'active' : ''}`}
              onClick={() => setMenuActivo('justificaciones')}
            >
              <span className="nav-icon">📝</span>
              <span className="nav-text">Justificaciones</span>
            </button>
            <button 
              className={`nav-item ${menuActivo === 'historial' ? 'active' : ''}`}
              onClick={() => setMenuActivo('historial')}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">Historial</span>
            </button>
            <button 
              className={`nav-item ${menuActivo === 'configuracion' ? 'active' : ''}`}
              onClick={() => setMenuActivo('configuracion')}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Configuración</span>
            </button>
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3
          </div>
        </div>
      </nav>

<<<<<<< HEAD
      {/* CONTENIDO PRINCIPAL */}
      <main className="acudiente-main">
        {/* ESTADÍSTICAS GENERALES ULTRA */}
        <section className="resumen-section">
          <div className="section-header-ultra">
=======
      {/* Contenido Principal */}
      <main className="acudiente-main">
        {/* Resumen General */}
        <section className="resumen-section">
          <div className="section-header">
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3
            <h2>Resumen General</h2>
            <p>Vista completa del rendimiento de tus estudiantes</p>
          </div>
          
<<<<<<< HEAD
          <div className="stats-cards-ultra">
            <div className="stat-card-ultra estudiantes-card">
              <div className="stat-icon-circle">👥</div>
              <div className="stat-data-ultra">
                <h3>{estudiantes.length}</h3>
                <p>Total Estudiantes</p>
                <div className="stat-badge">Activos</div>
              </div>
              <div className="stat-sparkline"></div>
            </div>
            
            <div className="stat-card-ultra asistencias-card">
              <div className="stat-icon-circle">✅</div>
              <div className="stat-data-ultra">
                <h3>{totalAsistencias}</h3>
                <p>Asistencias Totales</p>
                <div className="stat-badge success">+12% vs mes anterior</div>
              </div>
            </div>
            
            <div className="stat-card-ultra observaciones-card">
              <div className="stat-icon-circle">📝</div>
              <div className="stat-data-ultra">
                <h3>{totalObservaciones}</h3>
                <p>Observaciones Totales</p>
                <div className="stat-badge warning">
                  {estudiantesConObs} estudiantes afectados
=======
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon estudiantes">👥</div>
                <div className="stat-data">
                  <h3>{estudiantes.length}</h3>
                  <p>Total Estudiantes</p>
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3
                </div>
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="stat-card-ultra rendimiento-card">
              <div className="stat-icon-circle">🎯</div>
              <div className="stat-data-ultra">
                <h3>{promedioRendimiento}%</h3>
                <p>Rendimiento Promedio</p>
                <div className={`stat-badge ${promedioRendimiento >= 80 ? 'success' : promedioRendimiento >= 60 ? 'warning' : 'danger'}`}>
                  {promedioRendimiento >= 80 ? 'Excelente' : promedioRendimiento >= 60 ? 'Bueno' : 'Requiere atención'}
=======
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon asistencias">✅</div>
                <div className="stat-data">
                  <h3>{estudiantes.reduce((acc, e) => acc + (e.asistencias || 0), 0)}</h3>
                  <p>Asistencias Totales</p>
                </div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon observaciones">📝</div>
                <div className="stat-data">
                  <h3>{estudiantes.reduce((acc, e) => acc + (e.observaciones || 0), 0)}</h3>
                  <p>Observaciones Totales</p>
                </div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon rendimiento">📊</div>
                <div className="stat-data">
                  <h3>{estudiantes.filter(e => e.observaciones > 0).length}</h3>
                  <p>Con Observaciones</p>
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3
                </div>
              </div>
            </div>
          </div>
        </section>
<<<<<<< HEAD

        {/* CONTROLES DE VISTA */}
        <div className="vista-controls">
          <button 
            className={`vista-btn ${vistaActual === 'cards' ? 'active' : ''}`}
            onClick={() => setVistaActual('cards')}
          >
            <span>🎴</span> Vista Cards
          </button>
          <button 
            className={`vista-btn ${vistaActual === 'lista' ? 'active' : ''}`}
            onClick={() => setVistaActual('lista')}
          >
            <span>📋</span> Vista Lista
          </button>
        </div>

        {/* ANÁLISIS INDIVIDUAL ULTRA */}
        <section className="analisis-section">
          <div className="section-header-ultra">
            <h2>Análisis Individual</h2>
            <p>Rendimiento detallado de cada estudiante</p>
          </div>

          <div className={`estudiantes-analisis ${vistaActual === 'lista' ? 'vista-lista' : ''}`}>
            {estudiantes.map((estudiante) => {
              const observacionesCount = estudiante.observaciones || 0;
              const asistenciasCount = estudiante.asistencias || 0;
              const total = observacionesCount + asistenciasCount;
              const rendimiento = Math.round((asistenciasCount / Math.max(total, 1)) * 100);

              return (
                <div key={estudiante.id_estudiante} className="analisis-card-ultra">
                  {/* HEADER DEL ESTUDIANTE */}
                  <div className="estudiante-header-ultra">
                    <div className="estudiante-avatar-ultra">
                      {estudiante.nombre?.charAt(0)}{estudiante.apellido?.charAt(0)}
                    </div>
                    <div className="estudiante-info-ultra">
                      <h3>{estudiante.nombre} {estudiante.apellido}</h3>
                      <div className="estudiante-meta-ultra">
                        <span className="grado-badge">{estudiante.grado || "Sin grado"}</span>
                        <span className="documento-badge">Doc: {estudiante.documento || "N/A"}</span>
                      </div>
                    </div>
                    <div className={`estudiante-status ${rendimiento >= 80 ? 'excelente' : rendimiento >= 60 ? 'bueno' : 'bajo'}`}>
                      {rendimiento >= 80 ? '🌟 Excelente' : rendimiento >= 60 ? '👍 Bueno' : '⚠️ Atención'}
                    </div>
                  </div>

                  {/* ESTADÍSTICAS PRINCIPALES ULTRA */}
                  <div className="estadisticas-principales-ultra">
                    <div className="estadistica-ultra observaciones-stat">
                      <div className="estadistica-icon-ultra">📝</div>
                      <div className="estadistica-data-ultra">
                        <span className="valor">{observacionesCount}</span>
                        <span className="label">Observaciones</span>
                      </div>
                      <div className="estadistica-trend">
                        {observacionesCount > 0 ? '⬆️' : '✅'}
                      </div>
                    </div>
                    
                    <div className="estadistica-ultra asistencias-stat">
                      <div className="estadistica-icon-ultra">✅</div>
                      <div className="estadistica-data-ultra">
                        <span className="valor">{asistenciasCount}</span>
                        <span className="label">Asistencias</span>
                      </div>
                      <div className="estadistica-trend">
                        {asistenciasCount > 5 ? '🔥' : '👍'}
                      </div>
                    </div>
                    
                    <div className="estadistica-ultra rendimiento-stat">
                      <div className="estadistica-icon-ultra">📊</div>
                      <div className="estadistica-data-ultra">
                        <span className={`valor ${rendimiento >= 80 ? 'excelente' : rendimiento >= 60 ? 'bueno' : 'bajo'}`}>
                          {rendimiento}%
                        </span>
                        <span className="label">Rendimiento</span>
                      </div>
                      <div className="estadistica-trend">
                        {rendimiento >= 80 ? '🎯' : '📈'}
                      </div>
                    </div>
                  </div>

                  {/* GRÁFICOS ULTRA */}
                  <div className="charts-container-ultra">
                    <div className="chart-wrapper-ultra">
                      <h4>📊 Comparación</h4>
                      <div className="chart-inner-ultra">
                        <Bar
                          data={{
                            labels: ['Observaciones', 'Asistencias'],
                            datasets: [{
                              data: [observacionesCount, asistenciasCount],
                              backgroundColor: [
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(34, 197, 94, 0.8)'
                              ],
                              borderColor: [
                                'rgba(239, 68, 68, 1)',
                                'rgba(34, 197, 94, 1)'
                              ],
                              borderWidth: 2,
                              borderRadius: 8,
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { 
                              legend: { display: false },
                              tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                padding: 12,
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 13 },
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                borderWidth: 1
                              }
                            },
                            scales: {
                              y: { 
                                beginAtZero: true, 
                                ticks: { stepSize: 1, font: { size: 11 } },
                                grid: { color: 'rgba(0,0,0,0.05)' }
                              },
                              x: { 
                                grid: { display: false },
                                ticks: { font: { size: 11, weight: 'bold' } }
                              }
                            }
                          }}
                          height={140}
                        />
                      </div>
                    </div>
                    
                    <div className="chart-wrapper-ultra">
                      <h4>🎯 Distribución</h4>
                      <div className="chart-inner-ultra">
                        <Doughnut
                          data={{
                            labels: ['Observaciones', 'Asistencias'],
                            datasets: [{
                              data: total > 0 ? [observacionesCount, asistenciasCount] : [1],
                              backgroundColor: total > 0 
                                ? ['rgba(239, 68, 68, 0.8)', 'rgba(34, 197, 94, 0.8)'] 
                                : ['rgba(200, 200, 200, 0.3)'],
                              borderColor: '#fff',
                              borderWidth: 3,
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { 
                                position: 'bottom',
                                labels: { 
                                  usePointStyle: true, 
                                  padding: 15,
                                  font: { size: 11, weight: 'bold' }
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                padding: 12,
                                callbacks: {
                                  label: (context) => {
                                    const value = context.parsed;
                                    const percentage = Math.round((value / total) * 100);
                                    return `${context.label}: ${value} (${percentage}%)`;
                                  }
                                }
                              }
                            },
                            cutout: '65%'
                          }}
                          height={140}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BARRA DE PROGRESO ULTRA */}
                  <div className="progreso-section-ultra">
                    <div className="progreso-header-ultra">
                      <span>Progreso Académico</span>
                      <span className={`progreso-porcentaje-ultra ${rendimiento >= 80 ? 'excelente' : rendimiento >= 60 ? 'bueno' : 'bajo'}`}>
                        {rendimiento}%
                      </span>
                    </div>
                    <div className="progreso-bar-ultra">
                      <div 
                        className={`progreso-fill-ultra ${rendimiento >= 80 ? 'excelente' : rendimiento >= 60 ? 'bueno' : 'bajo'}`}
                        style={{ width: `${rendimiento}%` }}
                      >
                        <span className="progreso-glow"></span>
                      </div>
                    </div>
                    <div className="progreso-labels-ultra">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* ACCIONES ULTRA */}
                  <div className="acciones-section-ultra">
                    <button className="btn-primario-ultra">
                      <span className="btn-icon">👁️</span>
                      <span className="btn-text">Ver Detalles</span>
                      <span className="btn-arrow">→</span>
                    </button>
                    <button className="btn-secundario-ultra">
                      <span className="btn-icon">📧</span>
                      <span className="btn-text">Contactar</span>
=======

        {/* Análisis Individual por Estudiante */}
        <section className="analisis-section">
          <div className="section-header">
            <h2>Análisis Individual</h2>
            <p>Rendimiento detallado de cada estudiante</p>
          </div>

          <div className="estudiantes-analisis">
            {estudiantes.map((estudiante) => {
              const observacionesCount = estudiante.observaciones || 0;
              const asistenciasCount = estudiante.asistencias || 0;
              const total = observacionesCount + asistenciasCount;
              const rendimiento = Math.round((asistenciasCount / Math.max(total, 1)) * 100);

              return (
                <div key={estudiante.id_estudiante} className="analisis-card">
                  {/* Header del Estudiante */}
                  <div className="estudiante-header">
                    <div className="estudiante-avatar">
                      {estudiante.nombre?.charAt(0)}{estudiante.apellido?.charAt(0)}
                    </div>
                    <div className="estudiante-info">
                      <h3>{estudiante.nombre} {estudiante.apellido}</h3>
                      <div className="estudiante-meta">
                        <span className="grado">{estudiante.grado || "Sin grado asignado"}</span>
                        <span className="documento">Doc: {estudiante.documento || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas Principales */}
                  <div className="estadisticas-principales">
                    <div className="estadistica">
                      <div className="estadistica-icon observaciones">📝</div>
                      <div className="estadistica-data">
                        <span className="valor">{observacionesCount}</span>
                        <span className="label">Observaciones</span>
                      </div>
                    </div>
                    
                    <div className="estadistica">
                      <div className="estadistica-icon asistencias">✅</div>
                      <div className="estadistica-data">
                        <span className="valor">{asistenciasCount}</span>
                        <span className="label">Asistencias</span>
                      </div>
                    </div>
                    
                    <div className="estadistica">
                      <div className="estadistica-icon rendimiento">📊</div>
                      <div className="estadistica-data">
                        <span className={`valor ${rendimiento >= 80 ? 'excelente' : rendimiento >= 60 ? 'bueno' : 'bajo'}`}>
                          {rendimiento}%
                        </span>
                        <span className="label">Rendimiento</span>
                      </div>
                    </div>
                  </div>

                  {/* Gráficos */}
                  <div className="charts-container">
                    <div className="chart-wrapper">
                      <h4>Comparación Directa</h4>
                      <div className="chart-inner">
                        <Bar
                          data={{
                            labels: ['Observaciones', 'Asistencias'],
                            datasets: [{
                              data: [observacionesCount, asistenciasCount],
                              backgroundColor: ['#ff6b6b', '#51cf66'],
                              borderColor: ['#ff6b6b', '#51cf66'],
                              borderWidth: 2,
                              borderRadius: 6,
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                              y: { 
                                beginAtZero: true, 
                                ticks: { stepSize: 1 },
                                grid: { color: 'rgba(0,0,0,0.1)' }
                              },
                              x: { 
                                grid: { display: false }
                              }
                            }
                          }}
                          height={120}
                        />
                      </div>
                    </div>
                    
                    <div className="chart-wrapper">
                      <h4>Distribución</h4>
                      <div className="chart-inner">
                        <Doughnut
                          data={{
                            labels: ['Observaciones', 'Asistencias'],
                            datasets: [{
                              data: total > 0 ? [observacionesCount, asistenciasCount] : [1],
                              backgroundColor: total > 0 ? ['#ff6b6b', '#51cf66'] : ['#e9ecef'],
                              borderWidth: 2,
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { 
                                position: 'bottom',
                                labels: { usePointStyle: true, padding: 15 }
                              }
                            },
                            cutout: '60%'
                          }}
                          height={120}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="progreso-section">
                    <div className="progreso-header">
                      <span>Progreso Académico</span>
                      <span className={`progreso-porcentaje ${rendimiento >= 80 ? 'excelente' : rendimiento >= 60 ? 'bueno' : 'bajo'}`}>
                        {rendimiento}%
                      </span>
                    </div>
                    <div className="progreso-bar">
                      <div 
                        className={`progreso-fill ${rendimiento >= 80 ? 'excelente' : rendimiento >= 60 ? 'bueno' : 'bajo'}`}
                        style={{ width: `${rendimiento}%` }}
                      ></div>
                    </div>
                    <div className="progreso-labels">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="acciones-section">
                    <button className="btn-primario">
                      <span>👁️ Ver Detalles Completos</span>
                    </button>
                    <button className="btn-secundario">
                      <span>📧 Contactar Colegio</span>
>>>>>>> a43669583a660c0a97b731df552b28ce5b167ac3
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EstudiantesCards;