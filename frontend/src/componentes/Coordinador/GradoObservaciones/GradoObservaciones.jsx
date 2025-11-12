import React, { useState, useEffect } from 'react';
import {
  FaClipboardList,
  FaSchool,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaChartBar,
  FaInfoCircle
} from 'react-icons/fa';
import './GradoObservaciones.css'

const ObservacionesDashboard = () => {
  const [datos, setDatos] = useState({
    total_registros: 0,
    resumenPorGrado: {},
    recomendaciones: {},
  });
  const [observaciones, setObservaciones] = useState([]);
  const [filtroGravedad, setFiltroGravedad] = useState('todos');
  const [filtroGrado, setFiltroGrado] = useState('todos');
  const [recomendacionesLocal, setRecomendacionesLocal] = useState({});
  const [recomendacion, setRecomendacion] = useState(""); // 👈 faltaba este estado

  // 🔹 Cargar datos al montar el componente
  useEffect(() => {
    cargarObservacionesGrado();
  }, []);

  const cargarObservacionesGrado = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/coordinador/dashboard/observacionesGrado");
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

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

        setDatos({
          total_registros: data.total_registros || 0,
          resumenPorGrado: resumen,
          gradoMasObservaciones: maxGrado,
          totalGradoMasObservaciones: maxObservaciones,
          recomendaciones: data.recomendaciones || {}
        });

        setObservaciones(data.detalle || []);

        // 👇 genera las recomendaciones locales
        const generadas = generarRecomendaciones(resumen);
        setRecomendacionesLocal(generadas);

        // 👇 muestra un consejo del día aleatorio
        const frases = Object.values(generadas);
        if (frases.length > 0) {
          const random = frases[Math.floor(Math.random() * frases.length)];
          setRecomendacion(random);
        }
      } else {
        console.warn("⚠️ Estructura de API no reconocida:", data);
      }
    } catch (err) {
      console.error("❌ Error cargando observaciones por grado:", err);
    }
  };
  
  // 🔹 Generar recomendaciones internas según la cantidad de observaciones
  const generarRecomendaciones = (resumen) => {
    const result = {};
    Object.entries(resumen || {}).forEach(([grado, total]) => {
      const n = Number(total) || 0;
      if (n <= 3) {
        result[grado] = "Buen comportamiento general: refuerza con elogios y mantenimiento de normas.";
      } else if (n <= 7) {
        result[grado] = "Alerta leve-moderada: revisa casos puntuales y refuerza seguimiento en clase.";
      } else if (n <= 12) {
        result[grado] = "Nivel alto: coordina reunión con padres y orientador; aplica medidas preventivas.";
      } else {
        result[grado] = "Situación crítica: intervención inmediata recomendada (orientador/coordinación).";
      }
    });
    return result;
  };

  const { total_registros, resumenPorGrado } = datos;

  const coloresGravedad = {
    1: { color: '#10B981', label: 'Leve' },
    2: { color: '#F59E0B', label: 'Moderada' },
    3: { color: '#EF4444', label: 'Grave' },
    4: { color: '#DC2626', label: 'Crítica' },
    5: { color: '#7C2D12', label: 'Muy Crítica' }
  };

  const datosFiltrados = observaciones.filter(item => {
    const cumpleGravedad =
      filtroGravedad === 'todos' || item.id_gravedad?.toString() === filtroGravedad;
    const cumpleGrado = filtroGrado === 'todos' || item.grado === filtroGrado;
    return cumpleGravedad && cumpleGrado;
  });

  const gradosUnicos = [...new Set(observaciones.map(item => item.grado))];

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h2 className="mb-0">
            <FaClipboardList className="me-2 text-primary" />
            Dashboard de Observaciones
          </h2>
        </div>
      </div>

      {/* Cards resumen */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <FaSchool className="text-primary fs-2" />
              <div className="ms-3">
                <h6 className="text-muted mb-1">Grados con Observaciones</h6>
                <h3>{Object.keys(resumenPorGrado || {}).length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <FaUserGraduate className="text-success fs-2" />
              <div className="ms-3">
                <h6 className="text-muted mb-1">Estudiantes Involucrados</h6>
                <h3>{new Set(observaciones.map(d => `${d.nombre_estudiante} ${d.apellido_estudiante}`)).size}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <FaChalkboardTeacher className="text-info fs-2" />
              <div className="ms-3">
                <h6 className="text-muted mb-1">Funcionarios Reportantes</h6>
                <h3>{new Set(observaciones.map(d => `${d.nombre_funcionario} ${d.apellido_funcionario}`)).size}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Filtrar por Gravedad:</label>
          <select className="form-select" value={filtroGravedad} onChange={(e) => setFiltroGravedad(e.target.value)}>
            <option value="todos">Todas</option>
            {Object.entries(coloresGravedad).map(([id, g]) => (
              <option key={id} value={id}>{g.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Filtrar por Grado:</label>
          <select className="form-select" value={filtroGrado} onChange={(e) => setFiltroGrado(e.target.value)}>
            <option value="todos">Todos</option>
            {gradosUnicos.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* Resumen por grado */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <FaChartBar className="me-2 text-primary" /> Resumen por Grado
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            {Object.entries(resumenPorGrado || {}).map(([grado, total]) => (
              <div key={grado} className="col-md-4 mb-3">
                <div className="p-3 border rounded d-flex justify-content-between">
                  <span>{grado}</span>
                  <span className="badge bg-primary">{total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 💡 Recomendaciones locales */}
      {Object.keys(recomendacionesLocal).length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              <FaInfoCircle className="me-2 text-warning" /> Recomendaciones por Grado
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              {Object.entries(recomendacionesLocal).map(([grado, texto]) => {
                const total = resumenPorGrado[grado] || 0;
                const bg = total > 12 ? '#fee2e2' : total > 7 ? '#fff7e6' : '#ecfdf5';
                return (
                  <div key={grado} className="col-md-6 col-lg-4 mb-3">
                    <div className="p-3 border rounded h-100" style={{ backgroundColor: bg }}>
                      <h6 className="text-primary fw-bold">{grado}</h6>
                      <p className="mb-1 text-muted">Total observaciones: <strong>{total}</strong></p>
                      <p className="mb-0">{texto}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tabla detalle */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaClipboardList className="me-2 text-primary" />
            Detalle de Observaciones
          </h5>
          <span className="badge bg-secondary">
            {datosFiltrados.length} / {total_registros}
          </span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Grado</th>
                  <th>Estudiante</th>
                  <th>Funcionario</th>
                  <th>Fecha</th>
                  <th>Gravedad</th>
                  <th>Total Obs.</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.length > 0 ? (
                  datosFiltrados.map((o, i) => (
                    <tr key={i}>
                      <td><strong>{o.grado}</strong></td>
                      <td>{o.nombre_estudiante} {o.apellido_estudiante}</td>
                      <td>{o.nombre_funcionario} {o.apellido_funcionario}</td>
                      <td><FaCalendarAlt className="me-1 text-muted" />{new Date(o.fecha).toLocaleDateString()}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: coloresGravedad[o.id_gravedad]?.color }}>
                          <FaExclamationTriangle className="me-1" />{o.tipo_gravedad}
                        </span>
                      </td>
                      <td><span className="badge bg-secondary">{o.total_observaciones}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      <FaInfoCircle className="me-2" /> No hay observaciones según los filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🧠 Consejo del día */}
      {!recomendacion ? (
        <div className="alert alert-secondary mt-4 d-flex align-items-center">
          <FaInfoCircle className="me-2 fs-5 text-muted" />
          <span>Cargando recomendación del día...</span>
        </div>
      ) : (
        <div className="alert alert-warning mt-4 d-flex align-items-center">
          <FaInfoCircle className="me-2 fs-5 text-dark" />
          <span><strong>Consejo del día:</strong> {recomendacion}</span>
        </div>
      )}
    </div>
  );
};

export default ObservacionesDashboard;
