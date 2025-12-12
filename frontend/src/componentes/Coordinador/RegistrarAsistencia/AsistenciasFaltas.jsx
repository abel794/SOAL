// src/componentes/Coordinador/AsistenciasFaltas/AsistenciasFaltas.jsx
import React, { useEffect, useState } from "react";
import "./ListarAsistencias.css"; // Opcional para estilos
import { FaUserTimes, FaCalendarAlt } from "react-icons/fa";

export default function AsistenciasFaltas() {
  const [faltas, setFaltas] = useState([]);
  const token = localStorage.getItem("token");

  // Cargar asistencias faltas desde la API
  const cargarFaltas = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/coordinador/dashboard/asistencias/registradasfaltas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setFaltas(data.asistencias || []);
    } catch (err) {
      console.error("❌ Error al cargar faltas:", err);
    }
  };

  useEffect(() => {
    cargarFaltas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">
        <FaUserTimes className="me-2" /> Faltas registradas ({faltas.length})
      </h2>
      {faltas.length === 0 ? (
        <p>No se han registrado faltas.</p>
      ) : (
        <div className="row g-3">
          {faltas.map((falta) => (
            <div className="col-12 col-md-6 col-lg-4" key={falta.id_asistencia}>
              <div className="card shadow-sm p-3 h-100">
                <h5>
                  <FaUserTimes className="text-danger me-2" />
                  {falta.estudiante?.persona?.nombre}
                </h5>
                <p>
                  <strong>Estado:</strong>{" "}
                  {falta.estadoAsistencia?.nombre || "Desconocido"}
                </p>
                <p>
                  <FaCalendarAlt className="me-1" />
                  <strong>Fecha:</strong>{" "}
                  {new Date(falta.fecha).toLocaleDateString()}
                </p>
                {falta.observacion && (
                  <p>
                    <strong>Observación:</strong> {falta.observacion}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
