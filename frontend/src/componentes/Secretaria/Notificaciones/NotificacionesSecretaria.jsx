import React, { useState, useEffect } from "react";
import "./style/NotificacionesSecretaria.css";

const NotificacionesSecretaria = () => {
  // renombrado: "gradoSeleccionado" es más claro que "tipo"
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [grados, setGrados] = useState([]); // Lista de grados

  const id_acudiente = 1; // ejemplo
  const id_canal = 1;
  const id_estado_notificacion = 1;

  // Helper para extraer array de respuesta (robusto)
  const extractArray = (payload, possibleKeys = []) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    for (const k of possibleKeys) {
      if (Array.isArray(payload[k])) return payload[k];
    }
    // si payload tiene campo data que es array
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  };

  // Cargar historial de notificaciones con paginación
  useEffect(() => {
    const cargarHistorial = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/notificaciones-secretaria?limit=10&offset=${page * 10}`);
        if (!res.ok) throw new Error("Error al cargar el historial");
        const data = await res.json();

        // extraemos posibles arrays: notificaciones, rows, data, o el array directo
        const notifs = extractArray(data, ["notificaciones", "rows", "notificaciones_secretaria"]);
        setHistorial(notifs);
        // intenta extraer totalPages si el backend lo envía
        if (typeof data.totalPages === "number") setTotalPages(data.totalPages);
        else if (typeof data.total === "number") setTotalPages(Math.ceil(data.total / 10));
        else setTotalPages(Math.max(1, Math.ceil((notifs.length || 0) / 10)));
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [page]);

  // enviar notificación
  const enviarNotificacion = async () => {
    if (mensaje.trim() === "") {
      alert("⚠️ Escribe un mensaje antes de enviarlo.");
      return;
    }
    if (!gradoSeleccionado) {
      alert("⚠️ Selecciona un grado.");
      return;
    }

    try {
      const payload = {
        grado: gradoSeleccionado,
        mensaje,
        id_acudiente,
        id_canal,
        id_estado_notificacion
      };

      const res = await fetch("http://localhost:3000/api/notificaciones-secretaria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error al enviar la notificación");
      }

      const nuevaNotificacion = await res.json();
      setHistorial(prev => [nuevaNotificacion, ...prev]);
      setMensaje("");
      alert(`📩 Notificación enviada al grado: ${gradoSeleccionado}`);
    } catch (error) {
      alert(error.message);
    }
  }

  // Obtener los grados al montar (robusto)
  useEffect(() => {
    const obtenerGrados = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/coordinador/grado");
        if (!res.ok) throw new Error("Error al obtener los grados");
        const data = await res.json();

        // intenta distintos formatos
        const gradosArray = extractArray(data, ["grados", "data", "rows"]);
        setGrados(gradosArray);
      } catch (error) {
        console.error("Error al obtener grados:", error.message);
        setGrados([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerGrados();
  }, []);

  return (
    <div className="notificaciones-secretaria container mt-5">
      <br />
      <h2 className="text-center">📢 Notificaciones de Secretaría</h2>
      <p className="text-center">Envía y gestiona notificaciones para estudiantes, acudientes o docentes.</p>

      <div className="form-notificacion row mb-4">
        <div className="col-md-6 col-12 mb-3">
          <label htmlFor="grado" className="form-label">Selecciona un grado</label>
          <select
            id="grado"
            className="form-select"
            value={gradoSeleccionado}
            onChange={(e) => setGradoSeleccionado(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecciona un grado</option>
            {grados.map((grado, index) => {
              // intenta usar campos típicos; si no existen, usa índice como fallback
              const key = grado.id ?? grado.id_grado ?? grado.codigo ?? `${grado.nombre ?? grado.nombre_grado ?? 'grado'}-${index}`;
              const value = grado.id ?? grado.nombre ?? grado.nombre_grado ?? index;
              const label = grado.nombre_grado ?? grado.nombre ?? `${grado.nombre ?? 'Grado'} (${value})`;
              return (
                <option key={key} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="col-md-6 col-12 mb-3">
          <label htmlFor="mensaje" className="form-label">Mensaje</label>
          <textarea
            id="mensaje"
            className="form-control"
            placeholder="Escribe el mensaje de la notificación..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
        </div>

        <div className="col-12 text-center">
          <button className="btn" onClick={enviarNotificacion}>
            Enviar Notificación
          </button>
        </div>
      </div>

      <div className="historial">
        <h3 className="text-center">📜 Historial de Notificaciones</h3>
        {loading ? (
          <div className="text-center">Cargando...</div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Acudiente</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((n, i) => {
                const key = n.id_notificacion ?? n.id ?? `notif-${i}`;
                return (
                  <tr key={key}>
                    <td>{n.id_notificacion ?? n.id ?? i}</td>
                    <td>{n.id_acudiente ?? n.acudiente ?? "-"}</td>
                    <td>{n.mensaje}</td>
                    <td>{n.fecha_envio ? new Date(n.fecha_envio).toLocaleDateString() : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="d-flex flex-column align-items-center">
          <div className="d-flex justify-content-between w-100 mb-2">
            <button
              className="btn btn-secondary"
              onClick={() => setPage(Math.max(page - 1, 0))}
              disabled={page === 0}
            >
              Anterior
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages}
            >
              Siguiente
            </button>
          </div>

          <div className="d-flex justify-content-center">
            <span>Página {page + 1} de {totalPages}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotificacionesSecretaria;
