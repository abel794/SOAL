import React, { useEffect, useState, useRef } from "react";
import "./style/ObservacionCard.css";

export default function ObservacionCard() {
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const yaEjecutado = useRef(false);

  useEffect(() => {
    if (yaEjecutado.current) return;
    yaEjecutado.current = true;

    const obtenerObservaciones = async () => {
      const token = localStorage.getItem("token");
      console.log("🧩 Token actual:", token);

      if (!token) {
        console.error("❌ No hay token guardado en localStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/estudiantes/observaciones", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("📦 Respuesta del backend:", data);

        if (!res.ok) throw new Error(data.error || "Error al obtener observaciones");

        // ✅ Ajuste clave: usar data.observaciones si es un objeto
        const lista = Array.isArray(data.observaciones)
          ? data.observaciones.filter(
              (obs, i, arr) => i === arr.findIndex(t => (t.id || t._id) === (obs.id || obs._id))
            )
          : Array.isArray(data)
          ? data
          : [];

        setObservaciones(lista);
      } catch (error) {
        console.error("⚠️ Error al obtener observaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerObservaciones();
  }, []);

  // 🔄 Estado de carga
  if (loading)
    return (
      <div className="estado-mensaje">
        <div className="spinner" />
        <p>⏳ Cargando observaciones...</p>
      </div>
    );

  // 🚫 Si no hay observaciones
  if (!observaciones.length)
    return (
      <div className="estado-mensaje">
        <p>No tienes observaciones registradas.</p>
      </div>
    );

  // ✅ Renderización normal
  return (
    <div className="observaciones-container">
      {observaciones.map((obs) => (
        <div className="observacion-card" key={obs.id || obs._id}>
          <div className="card-title">{obs.titulo || "Observación"}</div>
          <div className="card-text">{obs.descripcion || "Sin descripción"}</div>
          <div className="card-footer">
            {obs.fecha
              ? new Date(obs.fecha).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Fecha no disponible"}
          </div>
        </div>
      ))}
    </div>
  );
}
