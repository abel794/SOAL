// src/componentes/GradosYEstudiantes/GradosYEstudiantes.jsx
import React, { useEffect, useState } from "react";

function GradosYEstudiantes() {
  const [grados, setGrados] = useState([]);
  const [estudiantesPorGrado, setEstudiantesPorGrado] = useState({});
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(null); // Acordeón abierto

  // Cargar todos los grados
  useEffect(() => {
    fetch("http://localhost:3000/api/grados")
      .then((res) => res.json())
      .then((data) => {
        setGrados(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("❌ Error cargando grados:", err);
        setCargando(false);
      });
  }, []);

  // Cargar estudiantes de un grado cuando se abre
  const cargarEstudiantes = (idGrado) => {
    if (estudiantesPorGrado[idGrado]) {
      // Ya cargados, solo cambiar acordeón abierto
      setAbierto(abierto === idGrado ? null : idGrado);
      return;
    }

    fetch(`http://localhost:3000/api/grados/${idGrado}/estudiantes`)
      .then((res) => res.json())
      .then((data) => {
        setEstudiantesPorGrado((prev) => ({
          ...prev,
          [idGrado]: data,
        }));
        setAbierto(idGrado);
      })
      .catch((err) => console.error("❌ Error cargando estudiantes:", err));
  };

  if (cargando) return <p className="mt-4 text-center">⏳ Cargando grados...</p>;

  return (
    <div className="container mt-4">
      <h2>📚 Lista de grados y estudiantes</h2>
      <div className="accordion mt-3" id="accordionGrados">
        {grados.map((grado) => (
          <div className="accordion-item" key={grado.id_grado}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${abierto === grado.id_grado ? "" : "collapsed"}`}
                type="button"
                onClick={() => cargarEstudiantes(grado.id_grado)}
              >
                {grado.nombre}
              </button>
            </h2>
            <div
              className={`accordion-collapse collapse ${
                abierto === grado.id_grado ? "show" : ""
              }`}
            >
              <div className="accordion-body">
                {estudiantesPorGrado[grado.id_grado] ? (
                  estudiantesPorGrado[grado.id_grado].length > 0 ? (
                    <ul className="list-group">
                      {estudiantesPorGrado[grado.id_grado].map((est) => (
                        <li
                          key={est.id_estudiante}
                          className="list-group-item d-flex justify-content-between"
                        >
                          {est.nombre} {est.apellido}
                          <span className="badge bg-primary">{est.documento}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No hay estudiantes en este grado.</p>
                  )
                ) : (
                  <p>Cargando estudiantes...</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GradosYEstudiantes;
