// 📂 src/componentes/Acudiente/EstudiantesCards.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import "./estudiante_acudiente.css";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EstudiantesCards = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuActivo, setMenuActivo] = useState("dashboard");

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
        <div className="loading-spinner"></div>
        <p>Cargando información de estudiantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="acudiente-error">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar los datos</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div className="acudiente-empty">
        <div className="empty-icon">👨‍🎓</div>
        <h3>No hay estudiantes registrados</h3>
        <p>No se encontraron estudiantes asociados a su cuenta.</p>
      </div>
    );
  }

  return (
    <div className="acudiente-panel">
      {/* Header Principal */}
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
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="acudiente-main">
        {/* Resumen General */}
        <section className="resumen-section">
          <div className="section-header">
            <h2>Resumen General</h2>
            <p>Vista completa del rendimiento de tus estudiantes</p>
          </div>
          
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon estudiantes">👥</div>
                <div className="stat-data">
                  <h3>{estudiantes.length}</h3>
                  <p>Total Estudiantes</p>
                </div>
              </div>
            </div>
            
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
                </div>
              </div>
            </div>
          </div>
        </section>

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