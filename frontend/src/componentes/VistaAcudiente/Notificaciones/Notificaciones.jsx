import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ObservacionCard from "../AcudienteObservacionCard/AcudienteObservacionCard";
import "./AcudienteCitas.css";

const AcudienteCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const startedRef = useRef(false); // evita doble fetch en StrictMode

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

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Mis Citas</h2>

      {citas.length === 0 ? (
        <p>No tienes citas registradas.</p>
      ) : (
        <ul className="space-y-3">
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
              <li key={cita.id_cita} className="p-3 border rounded-md bg-gray-50">
                <p><strong>Fecha:</strong> {fecha}</p>
                <p><strong>Profesor:</strong> {profesor}</p>
                <p><strong>Estudiante:</strong> {estudianteNombre}</p>
                <p><strong>Acudiente:</strong> {acudienteNombre}</p>
                <p><strong>Motivo:</strong> {cita.motivo || "(sin motivo)"}</p>
                <p><strong>Estado:</strong> {cita.estado || "Pendiente"}</p>
              </li>
            );
          })}
        </ul>
      )}

      <ObservacionCard />
    </div>
  );
};

export default AcudienteCitas;
