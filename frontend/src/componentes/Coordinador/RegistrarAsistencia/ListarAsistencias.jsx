// ListarAsistencias.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListarAsistencias.css";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ListarAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensajeAuth, setMensajeAuth] = useState("");
  const [filtros, setFiltros] = useState({
    nombre_estudiante: "",
    nombre_funcionario: "",
    nombre_grado: "",
    fecha: "",
    id_estado_asistencia: "",
  });

  const debounceRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const limpiarFiltros = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );

  const fetchAsistencias = async (signal) => {
    try {
      setCargando(true);
      setError("");
      setMensajeAuth("");

      const params = limpiarFiltros(filtros);
      const tieneFiltros = Object.keys(params).length > 0;

      // Logs para debug
      console.log("🚀 Filtros a enviar:", params, "tieneFiltros:", tieneFiltros);

      // Elegir endpoint según si hay filtros o no
      const endpoint = tieneFiltros ? "/api/asistencias/filter" : "/api/asistencias";
      console.log("🔗 Endpoint elegido:", endpoint);

      const res = await api.get(endpoint, { params: tieneFiltros ? params : undefined, signal });

      if (!isMounted.current) return;

      // Normalizar respuesta del backend:
      // - puede devolver array directamente
      // - o { mensaje, total, datos: [] }
      // - o otras variantes
      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
        console.log("✅ Backend devolvió un array con", data.length, "registros");
      } else if (res.data && Array.isArray(res.data.datos)) {
        data = res.data.datos;
        console.log("✅ Backend devolvió objeto {datos:...} con", data.length, "registros");
      } else if (res.data && Array.isArray(res.data.data)) {
        // por si usas 'data' como key
        data = res.data.data;
        console.log("✅ Backend devolvió objeto {data:...} con", data.length, "registros");
      } else if (res.data && Array.isArray(res.data.asistencias)) {
        data = res.data.asistencias;
        console.log("✅ Backend devolvió objeto {asistencias:...} con", data.length, "registros");
      } else {
        // posible que backend devuelva { total:..., datos:[] } u otro objeto sin array
        if (res.data && res.data.datos && res.data.datos.length === 0) {
          data = [];
          console.log("ℹ️ Backend devolvió {datos: []}");
        } else {
          // intentar interpretar como vacío
          console.log("⚠️ Respuesta inesperada del backend:", res.data);
          data = [];
        }
      }

      if (data.length > 0) {
        // si tu backend devuelve objetos complejos y tú esperas campos específicos
        // normalizamos al formato que usa tu tabla (estudiante_nombre, etc.)
        const normalizadas = data.map((a) => {
          // si ya vienen normalizadas desde backend (estudiante_nombre...), las usamos
          if (a.estudiante_nombre || a.funcionario_nombre) return a;

          // intentar rellenar a partir de asociaciones (caso que el backend devuelva objetos sequelize)
          const estudianteNombre =
            (a.estudiante && a.estudiante.persona && `${a.estudiante.persona.nombre} ${a.estudiante.persona.apellido}`) ||
            a.estudiante_nombre ||
            "-";
          const funcionarioNombre =
            (a.funcionario && a.funcionario.persona && `${a.funcionario.persona.nombre} ${a.funcionario.persona.apellido}`) ||
            a.funcionario_nombre ||
            "-";
          const gradoNombre =
            (a.gradoAsistencia && a.gradoAsistencia.grado && a.gradoAsistencia.grado.nombre_grado) ||
            a.grado_nombre ||
            "-";
          const estadoNombre =
            (a.estadoAsistencia && a.estadoAsistencia.nombre) || a.estado_nombre || "-";

          return {
            id_asistencia: a.id_asistencia,
            fecha: a.fecha,
            observacion: a.observacion,
            estudiante_nombre: estudianteNombre,
            funcionario_nombre: funcionarioNombre,
            grado_nombre: gradoNombre,
            estado_nombre: estadoNombre,
          };
        });

        setAsistencias(normalizadas);
        setError("");
      } else {
        setAsistencias([]);
        if (tieneFiltros) {
          setError("No se encontraron asistencias con los filtros seleccionados 😅");
        } else {
          setError("No hay asistencias registradas todavía.");
        }
      }
    } catch (err) {
      if (!isMounted.current) return;
      if (axios.isCancel(err)) return;

      console.error("❌ Error cargando asistencias:", err);
      // Mensajes amigables según status
      if (err.response) {
        const code = err.response.status;
        console.log("📡 Status backend:", code, "body:", err.response.data);
        if (code === 400) {
          setError(
            "Solicitud inválida. Revisa los filtros. Si no cambiaste nada, intenta refrescar la página."
          );
        } else if (code === 401) {
          setMensajeAuth("No autorizado. Por favor inicia sesión nuevamente.");
          setAsistencias([]);
        } else if (code === 404) {
          setError("No se encontraron registros. Verifica los nombres o el grado ingresado 🙏");
          setAsistencias([]);
        } else {
          setError("Ocurrió un error al obtener las asistencias. Intenta más tarde.");
        }
      } else {
        // sin respuesta (network)
        setError("No se pudo conectar al servidor. ¿Está encendido el backend?");
      }
      setAsistencias([]);
    } finally {
      if (isMounted.current) setCargando(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const controller = new AbortController();
    debounceRef.current = setTimeout(() => {
      fetchAsistencias(controller.signal);
    }, 600);

    return () => {
      clearTimeout(debounceRef.current);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="asistencias-container container-fluid px-3 px-md-5 mt-4">
      <h1 className="titulo-lista text-center mb-4">📋 Registro de Asistencias</h1>

      {mensajeAuth && (
        <div className="alert alert-warning text-center">
          {mensajeAuth} —{" "}
          <button className="btn btn-link p-0" onClick={() => (window.location.href = "/login")}>
            Ir al login
          </button>
        </div>
      )}

      <div className="alert alert-info text-center mb-4">
        <strong>💡 Consejo:</strong> Busca por <em>nombre del estudiante</em>, <em>profesor</em> o{" "}
        <em>grado</em>. También puedes filtrar por fecha o estado. Si no pones filtros, se mostrarán
        todos los registros.
      </div>

      {/* filtros */}
      <div className="row mb-3 g-2">
        <div className="col-md-3">
          <input
            type="text"
            name="nombre_estudiante"
            placeholder="👩‍🎓 Nombre del estudiante"
            className="form-control"
            value={filtros.nombre_estudiante}
            onChange={handleFiltroChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="nombre_funcionario"
            placeholder="👨‍🏫 Nombre del profesor"
            className="form-control"
            value={filtros.nombre_funcionario}
            onChange={handleFiltroChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="nombre_grado"
            placeholder="🏫 Nombre del grado"
            className="form-control"
            value={filtros.nombre_grado}
            onChange={handleFiltroChange}
          />
        </div>
        <div className="col-md-3">
          <input type="date" name="fecha" className="form-control" value={filtros.fecha} onChange={handleFiltroChange} />
        </div>
      </div>

      <div className="row mb-4 g-2">
        <div className="col-md-3 mx-auto">
          <select name="id_estado_asistencia" className="form-select" value={filtros.id_estado_asistencia} onChange={handleFiltroChange}>
            <option value="">Todos los estados</option>
            <option value="1">Presente</option>
            <option value="2">Justificada</option>
            <option value="3">Inasistencia</option>
          </select>
        </div>
      </div>

      {cargando && <p className="text-center text-primary">Cargando asistencias...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!cargando && asistencias.length > 0 ? (
        <div className="table-responsive tabla-asistencias">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="tabla_asistencia">
              <tr>
                <th>📅 Fecha</th>
                <th>👩‍🎓 Estudiante</th>
                <th>👨‍🏫 Profesor</th>
                <th>🏫 Grado</th>
                <th>📋 Estado</th>
                <th>📝 Observación</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((a) => (
                <tr key={a.id_asistencia || `${a.id_estudiante}-${a.fecha}`}>
                  <td>{String(a.fecha || "-")}</td>
                  <td>{String(a.estudiante_nombre || "-")}</td>
                  <td>{String(a.funcionario_nombre || "-")}</td>
                  <td>{String(a.grado_nombre || "-")}</td>
                  <td>{String(a.estado_nombre || "-")}</td>
                  <td>{String(a.observacion || "-")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !cargando && <p className="text-center text-muted">No hay asistencias para mostrar 🙃</p>
      )}
    </div>
  );
};

export default ListarAsistencias;
