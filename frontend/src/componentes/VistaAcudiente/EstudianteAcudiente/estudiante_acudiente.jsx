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

        // Endpoint que proporciona estudiantes con observaciones y asistencias reales
        const res = await axios.get(
          "http://localhost:3000/api/acudientes/informacion/estudiantes",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        console.log("📡 Datos para dashboard:", res.data);

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

  // Función para contar observaciones por estudiante
  const getObservacionesPorEstudiante = (idEstudiante) => {
    return observaciones.filter((obs) => obs.id_estudiante === idEstudiante);
  };

  // Función para calcular estadísticas generales
  const calcularEstadisticas = () => {
    if (estudiantes.length === 0)
      return {
        totalObservaciones: 0,
        estudiantesConObservaciones: 0,
        promedioObservaciones: 0,
      };

    const totalObservaciones = observaciones.length;
    const estudiantesConObservaciones = estudiantes.filter(
      (est) => getObservacionesPorEstudiante(est.id_estudiante).length > 0
    ).length;
    const promedioObservaciones = Math.round(
      totalObservaciones / estudiantes.length
    );

    return {
      totalObservaciones,
      estudiantesConObservaciones,
      promedioObservaciones,
    };
  };

  if (loading) {
    return (
      <div className="container mt-4 w-100 h-100 d-flex justify-content-center align-items-center">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="ms-3">Cargando información de estudiantes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (estudiantes.length === 0) {
    return (
      <div className="container mt-4 w-100 h-100 d-flex justify-content-center align-items-center">
        <div className="text-center py-5">
          <i className="bi bi-person-x display-1 text-muted"></i>
          <h3 className="mt-3 text-muted">No hay estudiantes registrados</h3>
          <p className="text-muted">
            No se encontraron estudiantes asociados a su cuenta.
          </p>
        </div>
      </div>
    );
  }

  const {
    totalObservaciones,
    estudiantesConObservaciones,
    promedioObservaciones,
  } = calcularEstadisticas();

  return (
    <div className="container mt-4">
    {/* Header con estadísticas generales */}
<div className="row mb-4">
  <div className="col-12">
    <div className="dashboard-header p-4 rounded-3">
      <div className="row text-center">
        {/* Total de estudiantes */}
        <div className="col-md-3">
          <div className="stat-card">
            <i className="bi bi-people display-4 text-primary"></i>
            <h3 className="mt-2">{estudiantes.length}</h3>
            <p className="text-muted">Estudiantes</p>
          </div>
        </div>

        {/* Promedio de observaciones */}
        <div className="col-md-3">
          <div className="stat-card">
            <i className="bi bi-check-circle display-4 text-success"></i>
            <h3 className="mt-2">
              {(
                estudiantes.reduce((acc, e) => acc + e.observaciones, 0) /
                (estudiantes.length || 1)
              ).toFixed(1)}
            </h3>
            <p className="text-muted">Obs. Promedio</p>
          </div>
        </div>

        {/* Total de observaciones */}
        <div className="col-md-3">
          <div className="stat-card">
            <i className="bi bi-exclamation-triangle display-4 text-warning"></i>
            <h3 className="mt-2">
              {estudiantes.reduce((acc, e) => acc + e.observaciones, 0)}
            </h3>
            <p className="text-muted">Observaciones Totales</p>
          </div>
        </div>

        {/* Estudiantes con al menos una observación */}
        <div className="col-md-3">
          <div className="stat-card">
            <i className="bi bi-graph-up display-4 text-info"></i>
            <h3 className="mt-2">
              {estudiantes.filter((e) => e.observaciones > 0).length}
            </h3>
            <p className="text-muted">Con Observaciones</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Sección de Gráficos */}
      <div className="row mb-5">
        <div className="col-12 ">
          <h2 className="section-title mb-4">
            <i className="bi bi-bar-chart-fill me-2"></i>
            Resumen Gráfico
          </h2>
        </div>

        {estudiantes.map((estudiante) => {
          const observacionesEstudiante = getObservacionesPorEstudiante(
            estudiante.id_estudiante
          );
          const observacionesCount = estudiante.observaciones || 0;
          const asistenciasCount = estudiante.asistencias || 0;

          // Datos para gráfico de barras
          const barChartData = {
            labels: ["Observaciones", "Asistencias"],
            datasets: [
              {
                label: "Cantidad",
                data: [observacionesCount, asistenciasCount],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(54, 162, 235, 0.8)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                ],
                borderWidth: 1,
              },
            ],
          };

          // Datos para gráfico de doughnut
          const total = observacionesCount + asistenciasCount;
          const doughnutData = {
            labels: ["Observaciones", "Asistencias"],
            datasets: [
              {
                data:
                  total > 0 ? [observacionesCount, asistenciasCount] : [1],
                backgroundColor:
                  total > 0
                    ? [
                        "rgba(255, 99, 132, 0.8)",
                        "rgba(54, 162, 235, 0.8)",
                      ]
                    : ["rgba(200, 200, 200, 0.5)"],
                borderColor:
                  total > 0
                    ? [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                      ]
                    : ["rgba(150, 150, 150, 1)"],
                borderWidth: 1,
              },
            ],
          };

          return (
            <div
              key={estudiante.id_estudiante}
              className="col-lg-6 col-md-6 mb-4"
            >
              <div className="chart-card card h-100 shadow-sm">
                <div className="card-header bg-transparent">
                  <h5 className="card-title mb-0">
                    {estudiante.nombre} {estudiante.apellido}
                  </h5>
                  <small className="text-muted">{estudiante.grado}</small>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="chart-container">
                        <Bar
                          data={barChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              title: {
                                display: true,
                                text: "Rendimiento",
                                font: { size: 14 },
                              },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: { display: true, text: "Cantidad" },
                                ticks: { stepSize: 5 },
                              },
                            },
                          }}
                          height={200}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="chart-container">
                        <Doughnut
                          data={doughnutData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "bottom",
                                labels: { font: { size: 12 } },
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    const label = context.label || "";
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce(
                                      (a, b) => a + b,
                                      0
                                    );
                                    const percentage = Math.round(
                                      (value / total) * 100
                                    );
                                    return `${label}: ${value} (${percentage}%)`;
                                  },
                                },
                              },
                            },
                            cutout: "60%",
                          }}
                          height={200}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sección de Lista de Estudiantes */}
      <div className="row">
        <div className="col-12">
          <h2 className="section-title mb-4">
            <i className="bi bi-people-fill me-2"></i>
            Mis Estudiantes
          </h2>
        </div>

        {estudiantes.map((estudiante) => {
          const observacionesEstudiante = getObservacionesPorEstudiante(
            estudiante.id_estudiante
          );
          const observacionesCount = estudiante.observaciones || 0;
          const asistenciasCount = estudiante.asistencias || 0;

          return (
            <div
              key={estudiante.id_estudiante}
              className="col-lg-6 col-md-12 mb-4"
            >
              <div className="estudiante-card card h-100 w-100 shadow-sm">
                <div className="card-header estudiante-header">
                  <div className="estudiante-avatar">
                    {estudiante.nombre?.charAt(0)}
                    {estudiante.apellido?.charAt(0)}
                  </div>
                  <div className="estudiante-titles">
                    <h5 className="card-title mb-1">
                      {estudiante.nombre} {estudiante.apellido}
                    </h5>
                    <p className="card-subtitle text-muted mb-0">
                      {estudiante.grado}
                    </p>
                  </div>
                </div>

                <div className="card-body">
                  <ul className="estudiante-info list-unstyled">
                    <li>
                      <i className="bi bi-person-badge"></i>
                      <div className="info-content">
                        <strong>Documento:</strong>
                        <span>
                          {estudiante.numero_documento || "No especificado"}
                        </span>
                      </div>
                    </li>
                    <li>
                      <i className="bi bi-calendar"></i>
                      <div className="info-content">
                        <strong>Edad:</strong>
                        <span>{estudiante.edad || "N/A"} años</span>
                      </div>
                    </li>
                    <li>
                      <i className="bi bi-exclamation-circle"></i>
                      <div className="info-content">
                        <strong>Observaciones:</strong>
                        <span
                          className={
                            observacionesCount > 0
                              ? "text-warning"
                              : "text-success"
                          }
                        >
                          {observacionesCount}
                        </span>
                      </div>
                    </li>
                    <li>
                      <i className="bi bi-check-circle"></i>
                      <div className="info-content">
                        <strong>Asistencias:</strong>
                        <span
                          className={
                            asistenciasCount > 0
                              ? "text-success"
                              : "text-secondary"
                          }
                        >
                          {asistenciasCount}
                        </span>
                      </div>
                    </li>
                  </ul>

                  {/* Indicador de rendimiento */}
                  <div className="rendimiento-indicator mt-3">
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${Math.min(
                            (asistenciasCount /
                              Math.max(
                                asistenciasCount + observacionesCount,
                                1
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <small className="text-muted">
                      Rendimiento:{" "}
                      {Math.round(
                        (asistenciasCount /
                          Math.max(asistenciasCount + observacionesCount, 1)) *
                          100
                      )}
                      %
                    </small>
                  </div>
                </div>

                <div className="card-footer bg-transparent">
                  <div className="d-grid">
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-eye me-1"></i>
                      Ver Detalles
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

export default EstudiantesCards;
