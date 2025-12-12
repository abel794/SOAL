import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const NotificacionesEstudiante = () => {
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

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/estudiantes/citas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Asegurarse que sea un array
        setCitas(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          setError("Sesión inválida o expirada.");
          localStorage.removeItem("token");
        } else if (status === 403) {
          setError("No tienes permisos para acceder a esta información.");
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

  if (loading)
    return (
      <div className="estado-mensaje">
        <div className="spinner" />
        <p>⏳ Cargando citas...</p>
      </div>
    );

  if (error)
    return (
      <div className="estado-mensaje">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Mis Citas</h2>
      {citas.length === 0 ? (
        <p>No tienes citas registradas.</p>
      ) : (
        <ul className="space-y-2">
          {citas.map((cita) => {
            const fecha = cita.fecha_cita
              ? new Date(cita.fecha_cita).toLocaleString()
              : "Sin fecha";

            const profesor =
              cita.funcionario?.usuario?.username ||
              cita.funcionario?.usuario?.email ||
              "Funcionario";

            const estudianteNombre =
              cita.estudiante?.persona?.nombre ||
              cita.estudiante?.persona?.primer_nombre ||
              "Estudiante";

            return (
              <li
                key={cita.id_cita || cita._id}
                className="p-3 border rounded-md bg-gray-50"
              >
                <p><strong>Fecha:</strong> {fecha}</p>
                <p><strong>Profesor:</strong> {profesor}</p>
                <p><strong>Estudiante:</strong> {estudianteNombre}</p>
                <p><strong>Motivo:</strong> {cita.motivo || "(sin motivo)"}</p>
                <p><strong>Estado:</strong> {cita.estado || "Pendiente"}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NotificacionesEstudiante;
