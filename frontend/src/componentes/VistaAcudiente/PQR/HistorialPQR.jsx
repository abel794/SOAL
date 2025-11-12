import React, { useEffect, useState } from "react";
import axios from "axios";

const HistorialPQR = () => {
  const [misPqrs, setMisPqrs] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const [selectedPqr, setSelectedPqr] = useState(null);
  const [error, setError] = useState("");
  const [mensajeRespuesta, setMensajeRespuesta] = useState("");
  const [tipoRespuesta, setTipoRespuesta] = useState("");

  const getToken = () => localStorage.getItem("token");

  const formatDate = (fecha) => {
    if (!fecha) return "-";
    const d = new Date(fecha);
    if (isNaN(d)) return "-";
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const getBadgeClass = (estado) => {
    switch ((estado || "").toString()) {
      case "Pendiente":
        return "badge bg-warning text-dark";
      case "Respondido":
        return "badge bg-success";
      case "Cerrado":
        return "badge bg-secondary";
      default:
        return "badge bg-info text-dark";
    }
  };

  const normalizarTexto = (campo) => {
    if (!campo) return "-";
    if (typeof campo === "object")
      return campo.nombre || campo.descripcion || campo.asunto || "-";
    return String(campo);
  };

  const getAsunto = (item) =>
    item.asunto || item.descripcion || "Sin asunto";

  // Cargar todas las PQR del usuario
  useEffect(() => {
    const fetchPqrs = async () => {
      setLoadingList(true);
      setError("");
      try {
        const token = getToken();
        if (!token) {
          setError("No hay sesión activa. Inicia sesión.");
          return;
        }

        const res = await axios.get(
          "http://localhost:3000/api/acudientes/pqr/mis-pqrs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("📦 PQRs recibidas:", res.data);

        let data = [];
        if (Array.isArray(res.data)) data = res.data;
        else data =
          Object.values(res.data || {}).find((v) => Array.isArray(v)) || [];

        setMisPqrs(data);
      } catch (err) {
        console.error("Error cargando PQRs:", err);
        setError("No se pudo cargar tus PQRs.");
      } finally {
        setLoadingList(false);
      }
    };

    fetchPqrs();
  }, []);

  // Ver historial de una PQR
  const verHistorial = async (idPqr) => {
    if (!idPqr) {
      setMensajeRespuesta("ID de PQR inválido.");
      setTipoRespuesta("error");
      return;
    }

    setSelectedPqr(idPqr);
    setMensajeRespuesta("");
    setTipoRespuesta("");
    setHistorial([]);
    setLoadingHistorial(true);

    try {
      const token = getToken();
      const url = `http://localhost:3000/api/acudientes/pqr/${idPqr}/historial`;

      console.log("📄 Consultando historial:", url);

      const res = await axios.get(url, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("📜 Historial recibido:", res.data);

      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else
        data =
          Object.values(res.data || {}).find((v) => Array.isArray(v)) || [];

      setHistorial(data);

      if (data.length === 0) {
        setMensajeRespuesta("No hay historial para esta PQR.");
        setTipoRespuesta("info");
      }
    } catch (err) {
      console.error("Error al cargar historial:", err);
      const status = err.response?.status;
      if (status === 401)
        setMensajeRespuesta("No autorizado. Inicia sesión de nuevo.");
      else if (status === 404)
        setMensajeRespuesta("Historial no encontrado.");
      else setMensajeRespuesta("Error al cargar historial.");
      setTipoRespuesta("error");
    } finally {
      setLoadingHistorial(false);
    }
  };

  const cerrarHistorial = () => {
    setSelectedPqr(null);
    setHistorial([]);
    setMensajeRespuesta("");
    setTipoRespuesta("");
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h5 className="mb-3">📋 Mis PQRs</h5>

      {loadingList ? (
        <p>Cargando tus PQRs...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : misPqrs.length === 0 ? (
        <p>No tienes solicitudes registradas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Asunto</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {misPqrs.map((item, idx) => {
                const idPqr = item.id_pqr || item.id || idx;
                return (
                  <tr key={idPqr}>
                    <td>{idx + 1}</td>
                    <td>{getAsunto(item)}</td>
                    <td>{normalizarTexto(item.tipo)}</td>
                    <td>
                      <span className={getBadgeClass(item.estado?.nombre)}>
                        {normalizarTexto(item.estado)}
                      </span>
                    </td>
                    <td>{formatDate(item.fecha || item.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => verHistorial(idPqr)}
                      >
                        Ver historial
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedPqr && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6>📜 Historial de la PQR #{selectedPqr}</h6>
            <div>
              <button
                className="btn btn-sm btn-outline-danger me-2"
                onClick={cerrarHistorial}
              >
                Cerrar
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => verHistorial(selectedPqr)}
                disabled={loadingHistorial}
              >
                {loadingHistorial ? "Recargando..." : "Recargar"}
              </button>
            </div>
          </div>

          {loadingHistorial ? (
            <p>Cargando historial...</p>
          ) : mensajeRespuesta ? (
            <div
              className={`alert ${
                tipoRespuesta === "error" ? "alert-danger" : "alert-info"
              }`}
            >
              {mensajeRespuesta}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Usuario / Respuesta</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((h, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <strong>
                          {h.usuario?.username ||
                            h.usuario?.numero_documento ||
                            "Sistema"}
                        </strong>
                        <div style={{ whiteSpace: "pre-wrap" }}>
                          {h.respuesta || h.descripcion || h.mensaje || "-"}
                        </div>
                      </td>
                      <td>
                        <span
                          className={getBadgeClass(
                            h.estado_historial?.nombre || h.estado
                          )}
                        >
                          {normalizarTexto(h.estado_historial || h.estado)}
                        </span>
                      </td>
                      <td>
                        {formatDate(
                          h.fecha || h.createdAt || h.fecha_respuesta
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistorialPQR;
