import React, { useEffect, useState } from "react";
import "./HistorialAsistencia.css"; // CSS aparte

const HistorialAsistenciasProfesor = ({ idProfesor }) => {
  const [asistencias, setAsistencias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filtros, setFiltros] = useState({
    nombre: "",
    apellido: "",
    grado: "",
    fecha: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/estado_asistencia");
        const data = await res.json();
        setEstados(data);
      } catch (err) {
        console.error("Error cargando estados:", err);
      }
    };
    fetchEstados();
  }, []);

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        id_funcionario: idProfesor,
        ...filtros,
      });
      const res = await fetch(
        `http://localhost:5000/api/profesor/asistencias/filtros?${queryParams}`
      );
      const data = await res.json();
      setAsistencias(data);
    } catch (err) {
      console.error("Error cargando historial:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, [idProfesor]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm({
      id_estado_asistencia:
        asistencias[index].estadoAsistencia?.id_estado_asistencia || "",
      observacion: asistencias[index].observacion || "",
    });
  };

  const handleSave = async (id_asistencia) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/profesor/asistencias/${id_asistencia}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      const data = await res.json();
      alert(data.mensaje || "Asistencia actualizada");
      fetchHistorial();
      setEditIndex(null);
    } catch (err) {
      console.error("Error actualizando asistencia:", err);
      alert("Error actualizando asistencia");
    }
  };

  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    fetchHistorial();
  };

  const handleReset = () => {
    setFiltros({ nombre: "", apellido: "", grado: "", fecha: "" });
    fetchHistorial();
  };

  return (
    <div className="historial-container">
      <h2 className="historial-title">📊 Historial de Asistencias</h2>

      <form className="historial-filtros" onSubmit={handleBuscar}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={filtros.nombre}
          onChange={handleInputChange}
          className="historial-input"
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
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
        <button type="submit" className="btn-azul">🔍 Buscar</button>
        <button type="button" onClick={handleReset} className="btn-gris">🔄 Limpiar</button>
      </form>

      {loading ? (
        <p>⏳ Cargando asistencias...</p>
      ) : (
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
                <tr key={a.id_asistencia}>
                  <td>{new Date(a.fecha).toLocaleDateString("es-CO")}</td>
                  <td>{a.estudiante?.persona?.nombre} {a.estudiante?.persona?.apellido}</td>
                  <td>
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
                      a.estadoAsistencia?.nombre
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editForm.observacion}
                        onChange={(e) =>
                          setEditForm({ ...editForm, observacion: e.target.value })
                        }
                        className="historial-input"
                      />
                    ) : (
                      a.observacion
                    )}
                  </td>
                  <td>{a.gradoAsistencia?.grado?.nombre_grado || "-"}</td>
                  <td>
                    {editIndex === index ? (
                      <button className="btn-guardar" onClick={() => handleSave(a.id_asistencia)}>
                        💾 Guardar
                      </button>
                    ) : (
                      <button className="btn-editar" onClick={() => handleEdit(index)}>
                        ✏️ Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No se encontraron registros</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistorialAsistenciasProfesor;
