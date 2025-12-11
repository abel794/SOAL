import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ObservacionCard from "../AcudienteObservacionCard/AcudienteObservacionCard";

const AcudienteCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const fetchCitas = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No hay sesión activa. Inicia sesión.");
          return;
        }

        const res = await axios.get("http://localhost:3000/api/acudientes/citas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCitas(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        const status = err.response?.status;

        if (status === 401) {
          setError("Sesión inválida o expirada.");
          localStorage.removeItem("token");
        } else {
          setError("No se pudieron cargar las citas. Revisa la consola.");
        }

        console.error("Error fetch citas:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  if (loading) return <p className="mt-3">Cargando citas...</p>;
  if (error) return <p className="text-danger fw-semibold mt-3">{error}</p>;

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h2 className="fs-4 fw-bold mb-4">Mis Citas</h2>

      {citas.length === 0 ? (
        <p className="text-muted">No tienes citas registradas.</p>
      ) : (
        <ul className="list-group">
          {citas.map((cita) => {
            const fecha = cita.fecha_cita
              ? new Date(cita.fecha_cita).toLocaleString()
              : "Sin fecha";

            const profesor =
              cita.funcionario?.usuario?.username || "No asignado";

            const estudianteNombre = cita.estudiante?.persona
              ? `${cita.estudiante.persona.nombre} ${cita.estudiante.persona.apellido}`
              : "No disponible";

            const acudienteNombre = cita.acudiente?.persona
              ? `${cita.acudiente.persona.nombre} ${cita.acudiente.persona.apellido}`
              : "No disponible";

            return (
              <li
                key={cita.id_cita}
                className="list-group-item rounded mb-3 shadow-sm border"
              >
                <p className="mb-1"><strong>Fecha:</strong> {fecha}</p>
                <p className="mb-1"><strong>Profesor:</strong> {profesor}</p>
                <p className="mb-1"><strong>Estudiante:</strong> {estudianteNombre}</p>
                <p className="mb-1"><strong>Acudiente:</strong> {acudienteNombre}</p>
                <p className="mb-1"><strong>Motivo:</strong> {cita.motivo || "(sin motivo)"}</p>
                <p className="mb-1"><strong>Estado:</strong> {cita.estado || "Pendiente"}</p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4">
        <ObservacionCard />
      </div>
    </div>
  );
};

export default AcudienteCitas;
