import React, { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaClipboardList,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaEnvelopeOpenText,
  FaChartLine,
  FaChartBar,
  FaSchool,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie
} from "recharts";
import "./DashboardCards.css";

function DashboardCards({ setVista }) {
  const [datos, setDatos] = useState({
    estudiantesAsignados: 0,
    observaciones: 0,
    criticos: 0,
    citas: 0,
    profesoresActivos: 0,
    pqrsPendientes: 0,
    notificacionesEnviadas: 0,
    asistenciasRegistradas: 0,
    faltasRegistradas: 0,
    totalObservaciones: 0,
    resumenPorGrado: {},
    gradoMasObservaciones: "",
    totalGradoMasObservaciones: 0
  });
  
  const [observaciones, setObservaciones] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const nombreGrado = "Tercero";
  const token = localStorage.getItem("token");

  // Paleta de colores profesional
  const colors = {
    primary: "#3B82F6",
    secondary: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#06B6D4",
    purple: "#8B5CF6",
    pink: "#EC4899",
    indigo: "#6366F1",
    teal: "#14B8A6"
  };

  // ------------------- FUNCIÓN ÚNICA PARA CARGAR OBSERVACIONES POR GRADO -------------------
  const cargarObservacionesGrado = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/coordinador/dashboard/observacionesGrado");
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      
      console.log("📊 Datos de API observacionesGrado:", data);
      
      if (data.total_registros !== undefined) {
        const resumen = data.resumenPorGrado || {};
        let maxGrado = "";
        let maxObservaciones = 0;
        
        Object.entries(resumen).forEach(([grado, total]) => {
          if (total > maxObservaciones) {
            maxObservaciones = total;
            maxGrado = grado;
          }
        });

        setDatos(prev => ({ 
          ...prev, 
          totalObservaciones: data.total_registros || 0,
          resumenPorGrado: resumen,
          gradoMasObservaciones: maxGrado,
          totalGradoMasObservaciones: maxObservaciones
        }));
        
        setObservaciones(data.detalle || []);
        
      } else if (data.grado && data.total_observaciones_graves !== undefined) {
        setDatos(prev => ({ 
          ...prev, 
          gradoMasObservaciones: data.grado,
          totalGradoMasObservaciones: data.total_observaciones_graves || 0
        }));
      } else {
        console.warn("⚠️ Estructura de API no reconocida:", data);
      }
      
    } catch (err) {
      console.error("❌ Error cargando observaciones por grado:", err);
    }
  };

  const getNested = (obj, path) => path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);

  const agruparPorSemana = (datosArray = [], fechaKey) => {
    const semanas = {};
    datosArray.forEach((item) => {
      const fechaRaw = getNested(item, fechaKey) ?? item[fechaKey] ?? item.fecha;
      if (!fechaRaw) return;
      const fecha = new Date(fechaRaw);
      if (isNaN(fecha.getTime())) return;
      const semanaNum = Math.ceil(fecha.getDate() / 7);
      const semana = `Sem ${semanaNum}`;
      semanas[semana] = (semanas[semana] || 0) + 1;
    });
    return Object.keys(semanas)
      .map((sem) => ({ semana: sem, cantidad: semanas[sem] }))
      .sort((a, b) => parseInt(a.semana.replace(/\D/g, ""), 10) - parseInt(b.semana.replace(/\D/g, ""), 10));
  };

  const normalizeArray = (resp) => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    if (Array.isArray(resp.asistencias)) return resp.asistencias;
    if (Array.isArray(resp.faltas)) return resp.faltas;
    if (Array.isArray(resp.data)) return resp.data;
    return [];
  };

  // ------------------- FUNCIONES DE CARGA -------------------
  const cargarEstudiantes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/coordinador/grado/contar/todos");
      const data = await res.json();
      setDatos((prev) => ({ ...prev, estudiantesAsignados: Number(data.total_estudiantes_colegio) || 0 }));
      return data.estudiantes || [];
    } catch (err) {
      console.error("❌ Error estudiantes:", err);
      return [];
    }
  };

  const cargarObservaciones = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/coordinador/observaciones/contar");
      const data = await res.json();
      setDatos((prev) => ({ ...prev, observaciones: Number(data.totalObservaciones) || 0 }));
      return data.observaciones || [];
    } catch (err) {
      console.error("❌ Error observaciones:", err);
      return [];
    }
  };

  const cargarCriticos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/observaciones/serias/contar");
      const data = await res.json();
      setDatos((prev) => ({ ...prev, criticos: Number(data.observacionesSerias) || 0 }));
    } catch (err) {
      console.error("❌ Error observaciones serias:", err);
    }
  };

  const cargarCitas = async () => {
    try {
      if (!token) return;
      const res = await fetch("http://localhost:3000/api/coordinador/citas/contar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDatos((prev) => ({ ...prev, citas: Number(data.totalCitas) || 0 }));
    } catch (err) {
      console.error("❌ Error citas:", err);
    }
  };

  const cargarProfesoresActivos = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/coordinador/dashboard/profesores/activos",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setDatos(prev => ({ ...prev, profesoresActivos: Number(data.total) || 0 }));
    } catch (err) {
      console.error("❌ Error profesores activos:", err);
    }
  };

  const cargarPqrsPendientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/coordinador/dashboard/pqrs/SinResponder");
      const data = await res.json();
      setDatos((prev) => ({ ...prev, pqrsPendientes: Number(data.total) || 0 }));
    } catch (err) {
      console.error("❌ Error PQR pendientes:", err);
    }
  };

  const cargarNotificacionesEnviadas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/coordinador/dashboard/notificaciones/enviadas");
      const data = await res.json();
      setDatos((prev) => ({ ...prev, notificacionesEnviadas: Number(data.total) || 0 }));
    } catch (err) {
      console.error("❌ Error notificaciones enviadas:", err);
    }
  };

  const cargarAsistencias = async () => {
    try {
      const resAll = await fetch("http://localhost:3000/api/coordinador/dashboard/asistencias/registradas");
      const dataAll = await resAll.json();
      const allAsist = normalizeArray(dataAll);

      const resF = await fetch("http://localhost:3000/api/coordinador/dashboard/asistencias/registradasfaltas");
      const dataF = await resF.json();
      const faltasArr = normalizeArray(dataF);

      const presentes = allAsist.filter((a) => (a.estadoAsistencia?.nombre ?? "").toLowerCase() !== "ausente");

      setDatos((prev) => ({
        ...prev,
        asistenciasRegistradas: presentes.length || allAsist.length || 0,
        faltasRegistradas: faltasArr.length || 0,
      }));

      return { asistencias: allAsist, faltas: faltasArr };
    } catch (err) {
      console.error("❌ Error asistencias:", err);
      return { asistencias: [], faltas: [] };
    }
  };

  // ------------------- CARGAR TODO -------------------
  const cargarDatosDashboard = async () => {
    setLoading(true);
    try {
      await Promise.all([
        cargarEstudiantes(),
        cargarObservaciones(),
        cargarObservacionesGrado(),
        cargarAsistencias(),
        cargarCriticos(),
        cargarCitas(),
        cargarProfesoresActivos(),
        cargarPqrsPendientes(),
        cargarNotificacionesEnviadas()
      ]);

      const estudiantesData = await cargarEstudiantes();
      const observacionesData = await cargarObservaciones();
      const { asistencias, faltas } = await cargarAsistencias();

      const semanasEst = agruparPorSemana(estudiantesData, "usuario.fecha_creacion");
      const semanasObs = agruparPorSemana(observacionesData, "fecha");
      const semanasAsis = agruparPorSemana(asistencias, "fecha");
      const semanasFaltas = agruparPorSemana(faltas, "fecha");

      const todasSemanas = Array.from(
        new Set([...semanasEst.map((s) => s.semana), ...semanasObs.map((s) => s.semana), ...semanasAsis.map((s) => s.semana), ...semanasFaltas.map((s) => s.semana)])
      )
        .map((s) => ({ semana: s, n: parseInt(s.replace(/\D/g, ""), 10) || 0 }))
        .sort((a, b) => a.n - b.n)
        .map((x) => x.semana);

      let acumuladoEst = 0,
        acumuladoObs = 0,
        acumuladoAsis = 0,
        acumuladoFaltas = 0;

      const lineDataFinal = todasSemanas.map((sem) => {
        const estudiantesSemana = semanasEst.find((s) => s.semana === sem)?.cantidad || 0;
        const observacionesSemana = semanasObs.find((s) => s.semana === sem)?.cantidad || 0;
        const asistenciasSemana = semanasAsis.find((s) => s.semana === sem)?.cantidad || 0;
        const faltasSemana = semanasFaltas.find((s) => s.semana === sem)?.cantidad || 0;

        acumuladoEst += estudiantesSemana;
        acumuladoObs += observacionesSemana;
        acumuladoAsis += asistenciasSemana;
        acumuladoFaltas += faltasSemana;

        return {
          semana: sem,
          estudiantes: acumuladoEst,
          observaciones: acumuladoObs,
          asistencias: acumuladoAsis,
          faltas: acumuladoFaltas,
        };
      });

      setLineData(lineDataFinal);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombreGrado]);

  // ------------------- DATOS PARA GRÁFICOS -------------------
  const resumenGradoData = Object.entries(datos.resumenPorGrado || {}).map(([grado, total]) => ({
    name: grado,
    value: total,
    color: colors.primary
  }));

  const barData = [
    { name: "Estudiantes", cantidad: datos.estudiantesAsignados, color: colors.primary },
    { name: "Observaciones", cantidad: datos.observaciones, color: colors.info },
    { name: "Total Observaciones", cantidad: datos.totalObservaciones, color: colors.purple },
    { name: "Casos Críticos", cantidad: datos.criticos, color: colors.danger },
    { name: "Citas", cantidad: datos.citas, color: colors.secondary },
    { name: "Profesores Activos", cantidad: datos.profesoresActivos, color: colors.teal },
    { name: "PQR Pendientes", cantidad: datos.pqrsPendientes, color: colors.warning },
    { name: "Notificaciones", cantidad: datos.notificacionesEnviadas, color: colors.indigo },
    { name: "Asistencias", cantidad: datos.asistenciasRegistradas, color: colors.secondary },
    { name: "Faltas", cantidad: datos.faltasRegistradas, color: colors.pink },
  ];

  const pieData = [
    { name: "Asistencias", value: datos.asistenciasRegistradas, color: colors.secondary },
    { name: "Faltas", value: datos.faltasRegistradas, color: colors.danger },
  ];

  const cards = [
    { 
      key: "totalObservaciones", 
      title: "Total Observaciones", 
      count: datos.totalObservaciones, 
      vista: "Total Observaciones",
      color: colors.purple,
      icon: <FaClipboardList />
    },
    {
      key: "gradoMasObservaciones",
      title: "Grado Más Obs.",
      count: datos.totalGradoMasObservaciones,
      vista: "Grado Mas Observaciones", 
      color: colors.pink,
      icon: <FaSchool />
    },
    { 
      key: "criticos", 
      title: "Casos Críticos", 
      count: datos.criticos, 
      vista: "Casos críticos",
      color: colors.danger,
      icon: <FaExclamationTriangle />
    },
    { 
      key: "estudiantes", 
      title: "Estudiantes", 
      count: datos.estudiantesAsignados, 
      vista: "Grados y estudiantes",
      color: colors.primary,
      icon: <FaGraduationCap />
    },
    { 
      key: "observaciones", 
      title: "Observaciones Reg.", 
      count: datos.observaciones, 
      vista: "Registrar observación",
      color: colors.info,
      icon: <FaClipboardList />
    },
    { 
      key: "citas", 
      title: "Citas", 
      count: datos.citas, 
      vista: "Ver citas",
      color: colors.secondary,
      icon: <FaCalendarAlt />
    },
    { 
      key: "profesoresActivos", 
      title: "Profesores", 
      count: datos.profesoresActivos, 
      vista: "Profesores Activos",
      color: colors.teal,
      icon: <FaChalkboardTeacher />
    },
    { 
      key: "pqrs", 
      title: "PQR Pendientes", 
      count: datos.pqrsPendientes, 
      vista: "Responder PQR",
      color: colors.warning,
      icon: <FaEnvelopeOpenText />
    },
  ];

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-white fw-bold">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container-fluid">
        {/* Header del Dashboard */}
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="text-white fw-bold mb-1" style={{ fontSize: '2rem' }}>📊 Observador Estudiantil</h2>
            <p className="text-white" style={{ opacity: 0.9, fontSize: '1.1rem' }}>Instituto Renato Descartes</p>
          </div>
        </div>

        {/* ======================= 📊 CARDS SUPERIORES ======================= */}
        <div className="cards-grid">
          {cards.map((item, index) => (
            <div key={item.key} style={{ animationDelay: `${index * 0.1}s` }}>
              <div
                className="dashboard-card elegant-card"
                style={{ 
                  borderLeft: `4px solid ${item.color}`,
                  color: item.color 
                }}
              >
                <div className="card-body">
                  <div className="card-content">
                    <h6 className="card-subtitle">
                      {item.title}
                    </h6>
                    <h2 className="card-count" style={{ color: item.color }}>
                      {item.count}
                    </h2>
                    {item.key === "gradoMasObservaciones" && datos.gradoMasObservaciones && (
                      <span className="card-grado">
                        {datos.gradoMasObservaciones}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-sm card-btn"
                    onClick={() => setVista(item.vista)}
                    style={{ 
                      backgroundColor: item.color, 
                      color: "white",
                      border: 'none'
                    }}
                  >
                    Ver detalles
                  </button>
                </div>
                
                <div className="card-icon" style={{ color: item.color }}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ======================= 📈 GRÁFICOS ======================= */}
        <div className="row">
          {/* Gráfico de Evolución */}
          <div className="col-12 mb-4">
            <div className="elegant-card chart-container">
              <div className="chart-header">
                <div className="chart-icon">
                  <FaChartLine />
                </div>
                <h5>Evolución Semanal Acumulada</h5>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorEstudiantes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorObservaciones" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.info} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.info} stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorAsistencias" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.secondary} stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorFaltas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.danger} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.danger} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="semana" tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} />
                  <YAxis tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="estudiantes" stroke={colors.primary} fill="url(#colorEstudiantes)" name="Estudiantes" strokeWidth={2} />
                  <Area type="monotone" dataKey="observaciones" stroke={colors.info} fill="url(#colorObservaciones)" name="Observaciones" strokeWidth={2} />
                  <Area type="monotone" dataKey="asistencias" stroke={colors.secondary} fill="url(#colorAsistencias)" name="Asistencias" strokeWidth={2} />
                  <Area type="monotone" dataKey="faltas" stroke={colors.danger} fill="url(#colorFaltas)" name="Faltas" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asistencias vs Faltas */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="elegant-card chart-container">
              <div className="chart-header">
                <div className="chart-icon">
                  <FaChartBar />
                </div>
                <h5>Asistencia vs Faltas</h5>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Observaciones por Grado */}
          {resumenGradoData.length > 0 && (
            <div className="col-12 col-lg-6 mb-4">
              <div className="elegant-card chart-container">
                <div className="chart-header">
                  <div className="chart-icon">
                    <FaSchool />
                  </div>
                  <h5>Observaciones por Grado</h5>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={resumenGradoData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      tick={{ fill: "#6B7280", fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" name="Observaciones" radius={[8, 8, 0, 0]} barSize={40} fill={colors.primary}>
                      {resumenGradoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Comparativo General */}
          <div className="col-12 mb-4">
            <div className="elegant-card chart-container">
              <div className="chart-header">
                <div className="chart-icon">
                  <FaChartBar />
                </div>
                <h5>Comparativo General</h5>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fill: "#6B7280", fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis tick={{ fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="cantidad" name="Cantidad" radius={[8, 8, 0, 0]} barSize={40}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;