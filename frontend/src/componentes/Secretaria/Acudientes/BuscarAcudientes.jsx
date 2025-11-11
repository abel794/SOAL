import React, { useState } from "react";
import "./style/BuscarAcudientes.css";

const BuscarAcudientes = () => {
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [grado, setGrado] = useState("");
  const [acudientes, setAcudientes] = useState([]);

  const buscarAcudientes = () => {
    const dataEjemplo = [
      { id: 1, nombre: "María Pérez", estudiante: "Juan Pérez", grado: "5" },
      { id: 2, nombre: "José Torres", estudiante: "Ana Torres", grado: "6" },
      { id: 3, nombre: "Lucía Gómez", estudiante: "Pedro Gómez", grado: "5" },
      { id: 4, nombre: "Luis Martínez", estudiante: "Laura Martínez", grado: "6" },
    ];

    const filtrados = dataEjemplo.filter(
      (a) =>
        (nombreEstudiante
          ? a.estudiante.toLowerCase().includes(nombreEstudiante.toLowerCase())
          : true) &&
        (grado ? a.grado === grado : true)
    );

    setAcudientes(filtrados);
  };

  return (
    <div className="buscar-acudientes-panel">
      <h2>👨‍👩‍👧 Buscar Acudientes</h2>

      <div className="filtros-panel">
        <input
          type="text"
          placeholder="Nombre del estudiante"
          value={nombreEstudiante}
          onChange={(e) => setNombreEstudiante(e.target.value)}
        />

        <select value={grado} onChange={(e) => setGrado(e.target.value)}>
          <option value="">Seleccionar grado</option>
          <option value="5">5°</option>
          <option value="6">6°</option>
        </select>

        <button onClick={buscarAcudientes}>Buscar</button>
      </div>

      <div className="tabla-contenedor">
        <table className="tabla-panel">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Acudiente</th>
              <th>Estudiante</th>
              <th>Grado</th>
            </tr>
          </thead>
          <tbody>
            {acudientes.length > 0 ? (
              acudientes.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.nombre}</td>
                  <td>{a.estudiante}</td>
                  <td>{a.grado}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No se encontraron acudientes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuscarAcudientes;
