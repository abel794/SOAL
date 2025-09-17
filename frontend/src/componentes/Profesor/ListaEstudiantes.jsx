// frontend/src/Profesor/ListaEstudiantes.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./ListaEstudiantes.css";

const ListaEstudiantes = ({ idProfesor }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [gradosAbiertos, setGradosAbiertos] = useState({});

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profesor/${idProfesor}/estudiantes`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Error en la petición");
        const data = await response.json();
        setEstudiantes(data.data);
      } catch (error) {
        console.error("Error al obtener estudiantes:", error);
      }
    };

    if (idProfesor) fetchEstudiantes();
  }, [idProfesor]);

  // Preparar datos para gráfico: contar estudiantes por grado
  const datosGrafico = Object.values(
    estudiantes.reduce((acc, est) => {
      if (!acc[est.grado]) acc[est.grado] = { grado: est.grado, cantidad: 0 };
      acc[est.grado].cantidad += 1;
      return acc;
    }, {})
  );

  // Agrupar estudiantes por grado para la lista
  const estudiantesPorGrado = estudiantes.reduce((acc, est) => {
    if (!acc[est.grado]) acc[est.grado] = [];
    acc[est.grado].push(est);
    return acc;
  }, {});

  const toggleGrado = (grado) => {
    setGradosAbiertos((prev) => ({ ...prev, [grado]: !prev[grado] }));
  };

  return (
    <div className="lista-estudiantes-container">
      <h2>👨‍🎓 Estudiantes Asignados</h2>

      {/* Gráfico de estudiantes por grado */}
      <h3>📊 Estudiantes por grado</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grado" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#00bfff" />
        </BarChart>
      </ResponsiveContainer>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o grado"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="buscar-input"
      />

      {/* Lista de estudiantes por grado */}
      {Object.keys(estudiantesPorGrado).map((grado) => {
        const estudiantesFiltrados = estudiantesPorGrado[grado].filter((e) =>
          `${e.persona.nombre} ${e.persona.apellido} ${e.grado}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
        );

        return (
          <div key={grado} className="grado-section">
            <button className="grado-btn" onClick={() => toggleGrado(grado)}>
              Grado {grado} ({estudiantesFiltrados.length})
            </button>

            {gradosAbiertos[grado] && (
              <div className="estudiantes-list">
                {estudiantesFiltrados.length > 0 ? (
                  estudiantesFiltrados.map((est) => (
                    <div key={est.id_estudiante} className="card-estudiante">
                      <h3>{est.persona.nombre} {est.persona.apellido}</h3>
                      <p>Documento: {est.persona.numero_documento}</p>
                      <p>Ciudad: {est.persona.ciudad_residencia}</p>
                      <p>Grado: {est.grado}</p>
                    </div>
                  ))
                ) : (
                  <p>No se encontraron estudiantes en este grado</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListaEstudiantes;
