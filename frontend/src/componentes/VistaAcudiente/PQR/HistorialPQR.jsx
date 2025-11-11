import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * HistorialPQR
 * - Muestra la lista de PQRs del usuario (GET /api/pqr/mis-pqrs)
 * - Permite ver el historial de una PQR concreta (GET /api/pqr/:id/historial)
 *
 * Requisitos: bootstrap (o classes similares) para estilos rápidos.
 */

const HistorialPQR = () => {
  // Lista de PQRs del usuario
  const [misPqrs, setMisPqrs] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Historial de la PQR seleccionada
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  // UI / estado
  const [selectedPqr, setSelectedPqr] = useState(null);
  const [error, setError] = useState("");
  const [mensajeRespuesta, setMensajeRespuesta] = useState("");
  const [tipoRespuesta, setTipoRespuesta] = useState(""); // 'success' | 'error' | ''

  // Helper: obtiene token y lo devuelve (o null)
  const getToken = () => localStorage.getItem("token");

  // Función para formatear fecha (DD/MM/YYYY)
  const formatDate = (fecha) => {
    if (!fecha) return "-";
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return "-";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Badge class simple (usa clases bootstrap)
  const getBadgeClass = (estadoNombre) => {
    switch ((estadoNombre || "").toString()) {
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

  // Normalizadores para campos que puedan venir anidados u objetos
  const normalizarTextoAnidado = (campo) => {
    if (campo == null) return null;
    if (typeof campo === "object") return campo.nombre ?? campo.descripcion ?? campo.asunto ?? null;
    return String(campo);
  };

  const normalizarEstado = (estado) => normalizarTextoAnidado(estado) ?? "-";
  const normalizarTipo = (tipo) => normalizarTextoAnidado(tipo) ?? "-";

  // Obtener asunto/descripcion con fallback
  const getAsunto = (item) => {
    const cand =
      item.descripcion ??
      item.asunto ??
      item.description ??
      (item.raw && (item.raw.descripcion ?? item.raw.asunto)) ??
      "";
    return String(cand).trim() || "Sin asunto";
  };

  // Cargar lista de PQRs del usuario
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

        const res = await axios.get('http://localhost:3000/api/acudientes/pqr/mis-pqrs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // LOG para depurar la forma de la respuesta
        console.log("listarMisPQR -> res.data:", res.data);

        // Normalizar payload a array
        let payload = [];
        if (Array.isArray(res.data)) {
          payload = res.data;
        } else if (res.data && Array.isArray(res.data.mapped)) {
          payload = res.data.mapped;
        } else if (res.data && Array.isArray(res.data.raw)) {
          payload = res.data.raw;
        } else if (res.data && Array.isArray(res.data.result)) {
          payload = res.data.result;
        } else {
          // intentar extraer primer array del objeto
          const maybeArray = Object.values(res.data || {}).find((v) => Array.isArray(v));
          payload = maybeArray || [];
        }

        setMisPqrs(payload || []);
      } catch (err) {
        console.error("Error cargando mis PQRs:", err);
        setError("No se pudo cargar tus PQRs. Revisa la consola.");
      } finally {
        setLoadingList(false);
      }
    };

    fetchPqrs();
  }, []);

  // Ver historial de una PQR concreta
  // Ver historial de una PQR concreta (reemplaza la función actual)
const verHistorial = async (idPqr) => {
  // validación rápida
  if (!idPqr) {
    console.warn('verHistorial: idPqr inválido', idPqr);
    setMensajeRespuesta('ID de PQR inválido.');
    setTipoRespuesta('error');
    return;
  }

  setSelectedPqr(idPqr);
  setMensajeRespuesta('');
  setTipoRespuesta('');
  setHistorial([]);
  setLoadingHistorial(true);

  try {
    const token = getToken(); // tu helper que lee localStorage

    // URL CORRECTA: monta según server.js -> app.use('/api/acudientes/pqr', ...)
    const url = `http://localhost:3000/api/acudientes/pqr/${idPqr}/historial`;
    console.log('verHistorial -> solicitando URL:', url);

    const res = await axios.get(url, {
      // Si usas cookies de sesión activa: mantiene withCredentials: true
      withCredentials: true,
      // Y si además usas JWT en localStorage, envía header (no hace daño)
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    console.log('verHistorial -> res.data:', res.data);

    // Normalizar respuesta a array (igual que en fetchPqrs)
    let payload = [];
    if (Array.isArray(res.data)) {
      payload = res.data;
    } else if (res.data && Array.isArray(res.data.mapped)) {
      payload = res.data.mapped;
    } else if (res.data && Array.isArray(res.data.raw)) {
      payload = res.data.raw;
    } else {
      const maybeArray = Object.values(res.data || {}).find((v) => Array.isArray(v));
      payload = maybeArray || [];
    }

    setHistorial(payload);

    if (!payload || payload.length === 0) {
      setMensajeRespuesta('No hay historial para esta PQR.');
      setTipoRespuesta('info');
    } else {
      setMensajeRespuesta('');
      setTipoRespuesta('');
    }
  } catch (err) {
    console.error('Error al cargar historial:', err);
    if (err.response) {
      // Mensajes útiles según status
      if (err.response.status === 401) {
        setMensajeRespuesta('No autorizado. Inicia sesión de nuevo.');
        setTipoRespuesta('error');
      } else if (err.response.status === 404) {
        setMensajeRespuesta('Historial no encontrado para esta PQR.');
        setTipoRespuesta('error');
      } else {
        setMensajeRespuesta('Error al cargar el historial de la PQR.');
        setTipoRespuesta('error');
      }
    } else {
      setMensajeRespuesta('Error de conexión al servidor.');
      setTipoRespuesta('error');
    }
    setHistorial([]);
  } finally {
    setLoadingHistorial(false);
  }
};


  // Cerrar vista de historial
  const cerrarHistorial = () => {
    setSelectedPqr(null);
    setHistorial([]);
    setMensajeRespuesta("");
    setTipoRespuesta("");
  };

  // Render
  return (
    <div className="p-4 bg-white rounded shadow">
      <h5 className="mb-3">Mis PQRs</h5>

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
                const asunto = getAsunto(item);
                const tipoNombre = normalizarTipo(item.tipo);
                const estadoNombre = normalizarEstado(item.estado);
                const fecha = formatDate(item.fecha ?? item.createdAt ?? item.fecha_creacion);
                const idPqr = item.id_pqr ?? item.id ?? item.idPqr ?? item.pqrId;
                const key = idPqr ?? idx;

                return (
                  <tr key={key}>
                    <td>{idx + 1}</td>
                    <td>{asunto}</td>
                    <td>{tipoNombre}</td>
                    <td>
                      <span className={getBadgeClass(estadoNombre)}>{estadoNombre}</span>
                    </td>
                    <td>{fecha}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2 "
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

      {/* Sección de historial (solo si hay PQR seleccionada) */}
      {selectedPqr && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center ">
            <h6>Historial de la PQR #{selectedPqr}</h6>
            <div>
              <button className="btn btn-sm btn-outline-danger  me-2 w-100" onClick={cerrarHistorial}>
                Cerrar
              </button>
              <button
                className="btn btn-sm btn-secondary mt-2 me-2 w-100"
                onClick={() => verHistorial(selectedPqr)}
                disabled={loadingHistorial}
              >
                {loadingHistorial ? "Recargando..." : "Recargar historial"}
              </button>
            </div>
          </div>

          {loadingHistorial ? (
            <p>Cargando historial...</p>
          ) : mensajeRespuesta ? (
            <div className={`alert ${tipoRespuesta === "error" ? "alert-danger" : "alert-info"}`}>
              {mensajeRespuesta}
            </div>
          ) : historial.length === 0 ? (
            <p>No hay entradas en el historial.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Usuario / Respuesta</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((h, i) => {
                    const usuario = h.usuario_respuesta ?? h.usuario ?? h.user ?? null;
                    const usuarioLabel =
                      (usuario && (usuario.username ?? usuario.numero_documento ?? usuario.id_usuario)) ||
                      "Sistema";
                    const textoRespuesta = h.respuesta ?? h.descripcion ?? h.mensaje ?? "-";
                    const estadoNombre = normalizarEstado(h.estado_historial ?? h.estado);
                    const fecha = formatDate(h.fecha ?? h.createdAt ?? h.fecha_respuesta);
                    const key = h.id_historial ?? h.id ?? i;

                    return (
                      <tr key={key}>
                        <td>{i + 1}</td>
                        <td>
                          <strong>{usuarioLabel}</strong>
                          <div style={{ whiteSpace: "pre-wrap" }}>{String(textoRespuesta)}</div>
                        </td>
                        <td>
                          <span className={getBadgeClass(estadoNombre)}>{estadoNombre}</span>
                        </td>
                        <td>{fecha}</td>
                      </tr>
                    );
                  })}
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
