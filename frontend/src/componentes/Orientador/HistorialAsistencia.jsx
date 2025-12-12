import React, { useState, useEffect, useCallback } from "react";
import ModalMensaje from "../ui/ModalMensaje.jsx";
import "./HistorialAsistencia.css";

const HistorialAsistenciasProfesor = ({ idProfesor }) => {
  const [asistencias, setAsistencias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    tipo: "info",
    titulo: "",
    mensaje: "",
    onConfirm: null
  });

  const [filtros, setFiltros] = useState({
    nombre: "",
    apellido: "",
    grado: "",
    fecha: "",
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

  // Fetch estados
  const fetchEstados = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/estadoAsistencia`);
      if (!res.ok) throw new Error("Error al cargar estados");
      const data = await res.json();
      setEstados(data);
    } catch (err) {
      console.error("Error cargando estados:", err);
      mostrarModal("error", "Error", "No se pudieron cargar los estados de asistencia");
    }
  }, []);

  // Fetch historial
  const fetchHistorial = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        id_funcionario: idProfesor,
        ...filtros,
      });
      
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/profesor/asistencias/filtros?${queryParams}`
      );
      
      if (!res.ok) throw new Error("Error al cargar historial");
      const data = await res.json();
      setAsistencias(data);
    } catch (err) {
      console.error("Error cargando historial:", err);
      mostrarModal("error", "Error", "No se pudo cargar el historial de asistencias");
      setAsistencias([]);
    } finally {
      setLoading(false);
    }
  }, [idProfesor, filtros]);

  useEffect(() => {
    fetchEstados();
  }, [fetchEstados]);

  useEffect(() => {
    if (idProfesor) {
      fetchHistorial();
    }
  }, [idProfesor, fetchHistorial]);

  // Manejar edición
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm({
      id_estado_asistencia: asistencias[index].estadoAsistencia?.id_estado_asistencia || "",
      observacion: asistencias[index].observacion || "",
    });
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditIndex(null);
    setEditForm({});
  };

  // Guardar cambios
  const handleSave = async (id_asistencia, index) => {
    if (!editForm.id_estado_asistencia) {
      mostrarModal("error", "Campo requerido", "Debes seleccionar un estado de asistencia");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/profesor/asistencias/${id_asistencia}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      const data = await res.json();
      
      if (res.ok) {
        mostrarModal("exito", "¡Éxito!", data.mensaje || "Asistencia actualizada correctamente");
        fetchHistorial();
        setEditIndex(null);
        setEditForm({});
      } else {
        throw new Error(data.mensaje || "Error al actualizar");
      }
    } catch (err) {
      console.error("Error actualizando asistencia:", err);
      mostrarModal("error", "Error", err.message || "Error actualizando la asistencia");
    }
  };

  // Manejar cambio de filtros
  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Buscar con filtros
  const handleBuscar = (e) => {
    e.preventDefault();
    fetchHistorial();
  };

  // Resetear filtros
  const handleReset = () => {
    setFiltros({ nombre: "", apellido: "", grado: "", fecha: "" });
    // El useEffect se encargará de actualizar automáticamente
  };

  // Exportar a CSV
  const exportarCSV = () => {
    if (asistencias.length === 0) {
      mostrarModal("info", "Sin datos", "No hay datos para exportar");
      return;
    }

    const headers = ["Fecha", "Estudiante", "Estado", "Observación", "Grado"];
    const csvData = asistencias.map(a => [
      new Date(a.fecha).toLocaleDateString("es-CO"),
      `${a.estudiante?.persona?.nombre} ${a.estudiante?.persona?.apellido}`,
      a.estadoAsistencia?.nombre,
      a.observacion || "",
      a.gradoAsistencia?.grado?.nombre_grado || "-"
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asistencias_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    mostrarModal("exito", "Exportado", "Datos exportados correctamente en formato CSV");
  };

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h2 className="historial-title">📊 Historial de Asistencias</h2>
        <button 
          className="btn-exportar"
          onClick={exportarCSV}
          disabled={asistencias.length === 0}
        >
          📥 Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <form className="historial-filtros" onSubmit={handleBuscar}>
        <div className="filtros-grid">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del estudiante"
            value={filtros.nombre}
            onChange={handleInputChange}
            className="historial-input"
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido del estudiante"
            value={filtros.apellido}
            onChange={handleInputChange}
            className="historial-input"
          />
          <input
            type="text"
            name="grado"
            placeholder="Grado"
            value={filtros.grado}
            onChange={handleInputChange}
            className="historial-input"
          />
          <input
            type="date"
            name="fecha"
            value={filtros.fecha}
            onChange={handleInputChange}
            className="historial-input"
          />
        </div>
        
        <div className="filtros-acciones">
          <button type="submit" className="btn-azul" disabled={loading}>
            {loading ? "⏳ Buscando..." : "🔍 Buscar"}
          </button>
          <button type="button" onClick={handleReset} className="btn-gris">
            🔄 Limpiar
          </button>
        </div>
      </form>

      {/* Resultados */}
      <div className="historial-resumen">
        <p>Se encontraron <strong>{asistencias.length}</strong> registros</p>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando asistencias...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="historial-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estudiante</th>
                <th>Estado</th>
                <th>Observación</th>
                <th>Grado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.length > 0 ? (
                asistencias.map((a, index) => (
                  <tr key={a.id_asistencia} className={editIndex === index ? "editando" : ""}>
                    <td className="fecha">
                      {new Date(a.fecha).toLocaleDateString("es-CO", {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="estudiante">
                      <strong>{a.estudiante?.persona?.nombre} {a.estudiante?.persona?.apellido}</strong>
                      <br />
                      <small>Doc: {a.estudiante?.persona?.numero_documento}</small>
                    </td>
                    <td className="estado">
                      {editIndex === index ? (
                        <select
                          value={editForm.id_estado_asistencia}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              id_estado_asistencia: e.target.value,
                            })
                          }
                          className="historial-select"
                        >
                          <option value="">Selecciona estado</option>
                          {estados.map((es) => (
                            <option key={es.id_estado_asistencia} value={es.id_estado_asistencia}>
                              {es.nombre}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`estado-badge estado-${a.estadoAsistencia?.nombre?.toLowerCase()}`}>
                          {a.estadoAsistencia?.nombre}
                        </span>
                      )}
                    </td>
                    <td className="observacion">
                      {editIndex === index ? (
                        <textarea
                          value={editForm.observacion}
                          onChange={(e) =>
                            setEditForm({ ...editForm, observacion: e.target.value })
                          }
                          className="historial-textarea"
                          rows="2"
                          placeholder="Observación opcional"
                        />
                      ) : (
                        <span title={a.observacion}>
                          {a.observacion || "-"}
                        </span>
                      )}
                    </td>
                    <td className="grado">
                      {a.gradoAsistencia?.grado?.nombre_grado || "-"}
                    </td>
                    <td className="acciones">
                      {editIndex === index ? (
                        <div className="acciones-grupo">
                          <button 
                            className="btn-guardar" 
                            onClick={() => handleSave(a.id_asistencia, index)}
                          >
                            💾 Guardar
                          </button>
                          <button 
                            className="btn-cancelar" 
                            onClick={cancelarEdicion}
                          >
                            ❌ Cancelar
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="btn-editar" 
                          onClick={() => handleEdit(index)}
                        >
                          ✏️ Editar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="sin-datos">
                    <div className="sin-datos-content">
                      <span>📭</span>
                      <p>No se encontraron registros de asistencia</p>
                      <small>Intenta ajustar los filtros de búsqueda</small>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default HistorialAsistenciasProfesor;