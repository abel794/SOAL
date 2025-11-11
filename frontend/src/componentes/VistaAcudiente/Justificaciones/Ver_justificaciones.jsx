import React, { useEffect, useState } from "react";

const VerJustificaciones = ({ idEstudiante }) => {
  const [justificaciones, setJustificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idEstudiante) return;

    const obtenerJustificaciones = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/coordinador/justificaciones/estudiante/${idEstudiante}`
        );

        if (!response.ok) throw new Error("Error al obtener las justificaciones");

        const data = await response.json();
        console.log("✅ Justificaciones recibidas:", data);
        setJustificaciones(data);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerJustificaciones();
  }, [idEstudiante]);

  return (
    <div>
      <h5>Justificaciones Enviadas</h5>
      {cargando ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : justificaciones.length === 0 ? (
        <p>No hay justificaciones registradas.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Archivo</th>
            </tr>
          </thead>
          <tbody>
            {justificaciones.map((j) => (
              <tr key={j.id}>
                <td>{j.fecha}</td>
                <td>
                  <a
                    href={`http://localhost:3000/api/coordinador/justificaciones/descargar/${j.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    Descargar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerJustificaciones;
