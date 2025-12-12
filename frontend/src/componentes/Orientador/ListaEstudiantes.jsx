import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import ModalMensaje from "../ui/ModalMensaje.jsx";
import "./ListaEstudiantes.css";

const ListaEstudiantes = ({ idProfesor }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [gradosAbiertos, setGradosAbiertos] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    tipo: "info",
    titulo: "",
    mensaje: "",
    onConfirm: null
  });

  // Mostrar modal
  const mostrarModal = (tipo, titulo, mensaje, onConfirm = null) => {
    setModal({
      visible: true,
      tipo,
      titulo,
      mensaje,
      onConfirm
    });
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModal({ ...modal, visible: false });
  };

  // Fetch estudiantes
  const fetchEstudiantes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profesor/${idProfesor}/estudiantes`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
      
      if (!response.ok) throw new Error("Error en la petición");
      
      const data = await response.json();
      setEstudiantes(data.data || []);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      mostrarModal("error", "Error", "No se pudieron cargar los estudiantes");
      setEstudiantes([]);
    } finally {
      setLoading(false);
    }
  }, [idProfesor]);

  useEffect(() => {
    if (idProfesor) {
      fetchEstudiantes();
    }
  }, [idProfesor, fetchEstudiantes]);

  // Preparar datos para gráfico
  const datosGrafico = useMemo(() => {
    return Object.values(
      estudiantes.reduce((acc, est) => {
        if (!acc[est.grado]) {
          acc[est.grado] = { grado: `Grado ${est.grado}`, cantidad: 0 };
        }
        acc[est.grado].cantidad += 1;
        return acc;
      }, {})
    );
  }, [estudiantes]);

  // Agrupar estudiantes por grado
  const estudiantesPorGrado = useMemo(() => {
    return estudiantes.reduce((acc, est) => {
      if (!acc[est.grado]) acc[est.grado] = [];
      acc[est.grado].push(est);
      return acc;
    }, {});
  }, [estudiantes]);

  // Filtrar estudiantes
  const estudiantesFiltrados = useMemo(() => {
    const busquedaLower = busqueda.toLowerCase();
    return Object.keys(estudiantesPorGrado).reduce((acc, grado) => {
      const filtrados = estudiantesPorGrado[grado].filter((e) =>
        `${e.persona.nombre} ${e.persona.apellido} ${e.grado}`
          .toLowerCase()
          .includes(busquedaLower)
      );
      if (filtrados.length > 0) {
        acc[grado] = filtrados;
      }
      return acc;
    }, {});
  }, [estudiantesPorGrado, busqueda]);

  // Toggle grado
  const toggleGrado = (grado) => {
    setGradosAbiertos((prev) => ({ ...prev, [grado]: !prev[grado] }));
  };

  // Abrir/Cerrar todos los grados
  const toggleTodosGrados = () => {
    const todosAbiertos = Object.keys(estudiantesFiltrados).every(grado => gradosAbiertos[grado]);
    const nuevosEstados = {};
    
    Object.keys(estudiantesFiltrados).forEach(grado => {
      nuevosEstados[grado] = !todosAbiertos;
    });
    
    setGradosAbiertos(nuevosEstados);
  };

  // Exportar lista a CSV
  const exportarLista = () => {
    if (estudiantes.length === 0) {
      mostrarModal("info", "Sin datos", "No hay estudiantes para exportar");
      return;
    }

    const headers = ["Nombre", "Apellido", "Documento", "Grado", "Ciudad", "Teléfono"];
    const csvData = estudiantes.map(est => [
      est.persona.nombre,
      est.persona.apellido,
      est.persona.numero_documento,
      est.grado,
      est.persona.ciudad_residencia,
      est.persona.telefono || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `estudiantes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    mostrarModal("exito", "Exportado", "Lista de estudiantes exportada correctamente");
  };

  // Refrescar datos
  const handleRefrescar = () => {
    mostrarModal(
      "confirmacion",
      "Actualizar datos",
      "¿Estás seguro de actualizar la lista de estudiantes?",
      fetchEstudiantes
    );
  };

  // Total estudiantes
  const totalEstudiantes = estudiantes.length;
  const totalGrados = Object.keys(estudiantesPorGrado).length;

  return (
    <div className="lista-estudiantes-container">
      <div className="lista-header">
        <h2>👨‍🎓 Estudiantes Asignados</h2>
        <div className="header-acciones">
          <button className="btn-secundario" onClick={handleRefrescar} disabled={loading}>
            🔄 {loading ? "Actualizando..." : "Actualizar"}
          </button>
          <button className="btn-exportar" onClick={exportarLista} disabled={estudiantes.length === 0}>
            📥 Exportar CSV
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="resumen-estadisticas">
        <div className="estadistica-card">
          <div className="estadistica-icono">👥</div>
          <div className="estadistica-info">
            <h3>{totalEstudiantes}</h3>
            <p>Total Estudiantes</p>
          </div>
        </div>
        <div className="estadistica-card">
          <div className="estadistica-icono">🏫</div>
          <div className="estadistica-info">
            <h3>{totalGrados}</h3>
            <p>Grados</p>
          </div>
        </div>
        <div className="estadistica-card">
          <div className="estadistica-icono">📊</div>
          <div className="estadistica-info">
            <h3>{Object.keys(estudiantesFiltrados).length}</h3>
            <p>Grados con resultados</p>
          </div>
        </div>
      </div>

      {/* Gráfico de estudiantes por grado */}
      {datosGrafico.length > 0 && (
        <div className="grafico-section">
          <h3>📊 Distribución por Grados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grado" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                formatter={(value) => [`${value} estudiantes`, 'Cantidad']}
                labelFormatter={(label) => `Grado: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="cantidad" 
                fill="#00bfff" 
                name="Estudiantes"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Buscador y controles */}
      <div className="controles-busqueda">
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, apellido o grado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscar-input"
          />
          {busqueda && (
            <button 
              className="btn-limpiar"
              onClick={() => setBusqueda("")}
            >
              ✕
            </button>
          )}
        </div>
        
        {Object.keys(estudiantesFiltrados).length > 0 && (
          <button className="btn-todos" onClick={toggleTodosGrados}>
            {Object.keys(estudiantesFiltrados).every(grado => gradosAbiertos[grado]) 
              ? "🙈 Cerrar todos" 
              : "👁️ Abrir todos"
            }
          </button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {busqueda && (
        <div className="resultados-busqueda">
          <p>
            {Object.values(estudiantesFiltrados).reduce((total, arr) => total + arr.length, 0)} 
            estudiantes encontrados en {Object.keys(estudiantesFiltrados).length} grados
          </p>
        </div>
      )}

      {/* Lista de estudiantes por grado */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando estudiantes...</p>
        </div>
      ) : Object.keys(estudiantesFiltrados).length > 0 ? (
        <div className="grados-lista">
          {Object.keys(estudiantesFiltrados).map((grado) => {
            const estudiantesGrado = estudiantesFiltrados[grado];
            const estaAbierto = gradosAbiertos[grado];

            return (
              <div key={grado} className="grado-section">
                <button 
                  className={`grado-btn ${estaAbierto ? 'abierto' : ''}`} 
                  onClick={() => toggleGrado(grado)}
                >
                  <span className="grado-info">
                    <span className="grado-nombre">Grado {grado}</span>
                    <span className="grado-contador">({estudiantesGrado.length})</span>
                  </span>
                  <span className="grado-icono">
                    {estaAbierto ? '▼' : '►'}
                  </span>
                </button>

                {estaAbierto && (
                  <div className="estudiantes-list">
                    {estudiantesGrado.map((est) => (
                      <div key={est.id_estudiante} className="card-estudiante">
                        <div className="estudiante-header">
                          <h3>{est.persona.nombre} {est.persona.apellido}</h3>
                          <span className="estudiante-grado">Grado {est.grado}</span>
                        </div>
                        <div className="estudiante-info">
                          <p>
                            <strong>📝 Documento:</strong> {est.persona.numero_documento}
                          </p>
                          <p>
                            <strong>🏙️ Ciudad:</strong> {est.persona.ciudad_residencia}
                          </p>
                          {est.persona.telefono && (
                            <p>
                              <strong>📞 Teléfono:</strong> {est.persona.telefono}
                            </p>
                          )}
                          {est.persona.correo && (
                            <p>
                              <strong>📧 Correo:</strong> {est.persona.correo}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="sin-resultados">
          <div className="sin-resultados-content">
            <span>🎓</span>
            <h3>No se encontraron estudiantes</h3>
            <p>
              {busqueda 
                ? "No hay estudiantes que coincidan con tu búsqueda."
                : "No hay estudiantes asignados a tu perfil."
              }
            </p>
            {busqueda && (
              <button 
                className="btn-limpiar-busqueda"
                onClick={() => setBusqueda("")}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        </div>
      )}

      <ModalMensaje
        visible={modal.visible}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensaje={modal.mensaje}
        onClose={cerrarModal}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default ListaEstudiantes;