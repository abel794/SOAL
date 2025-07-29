import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ListarAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Filtros
  const [filtros, setFiltros] = useState({
    estudiante: "",
    estado: "",
    grado: "",
    fecha: "",
  });

  // Obtener asistencias desde la API
  const fetchAsistencias = async () => {
    try {
      setCargando(true);
      const query = new URLSearchParams(filtros).toString();

      // Agregar await y capturar la respuesta
      const res = await axios.get(`http://localhost:3000/api/asistencias?${query}`);

      setAsistencias(res.data);
    } catch (err) {
      console.error("❌ Error cargando asistencias:", err);
      setError("No se pudieron cargar las asistencias");
    } finally {
      setCargando(false);
    }
  };

  // Cargar asistencias al montar o cuando cambien filtros
  useEffect(() => {
    fetchAsistencias();
  }, [filtros]);

  // Manejador de cambios de filtros
  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-fluid px-2 px-md-5 mt-3">
      <h1 className="text-center text-primary mb-4" style={{ fontSize: "2.5rem" }}>
        📋 Listado de Asistencias
      </h1>

      {/* Filtros */}
      <div className="row mb-3 g-2">
        <div className="col-md-3">
          <input
            type="text"
            name="estudiante"
            placeholder="Buscar estudiante..."
            className="form-control"
            value={filtros.estudiante}
            onChange={handleFiltroChange}
          />
        </div>
        <div className="col-md-3">
          <select
            name="estado"
            className="form-select"
            value={filtros.estado}
            onChange={handleFiltroChange}
          >
            <option value="">Todos los estados</option>
            <option value="Presente">Presente</option>
            <option value="Justificada">Justificada</option>
            <option value="Inasistencia">Inasistencia</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="grado"
            placeholder="Grado..."
            className="form-control"
            value={filtros.grado}
            onChange={handleFiltroChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            name="fecha"
            className="form-control"
            value={filtros.fecha}
            onChange={handleFiltroChange}
          />
        </div>
      </div>

      {/* Estado de carga */}
      {cargando && (
        <p className="text-center" style={{ fontSize: "1.3rem", fontWeight: "500" }}>
          Cargando asistencias...
        </p>
      )}

      {/* Error */}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Tabla de asistencias */}
      {!cargando && asistencias.length > 0 ? (
        <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <table
            className="table table-bordered table-hover align-middle text-center"
            style={{ fontSize: "1.1rem", minWidth: "800px" }}
          >
            <thead className="table-dark">
              <tr style={{ fontSize: "1.2rem" }}>
                <th>ID</th>
                <th>Estudiante</th>
                <th>Grado</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((a) => (
                <tr key={a.id_asistencia}>
                  <td>{a.id_asistencia}</td>
                  <td>
                    {a.estudiante && a.estudiante.persona
                      ? `${a.estudiante.persona.nombre || ""} ${a.estudiante.persona.apellido || ""}`
                      : `ID: ${a.id_estudiante}`}
                  </td>
                  <td>{a.gradoAsistencia?.grado?.nombre_grado || "-"}</td>
                  <td>{a.estadoAsistencia?.nombre || "-"}</td>
                  <td>{a.fecha}</td>
                  <td>{a.observacion || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !cargando && (
          <p
            className="text-muted text-center"
            style={{ fontSize: "1.4rem", fontWeight: "500" }}
          >
            No hay asistencias registradas.
          </p>
        )
      )}
    </div>
  );
};

export default ListarAsistencias;
