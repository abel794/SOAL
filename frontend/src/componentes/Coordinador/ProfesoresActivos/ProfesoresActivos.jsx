import React, { useEffect, useState } from "react";


export default function ProfesoresActivos() {
  const [profesores, setProfesores] = useState([]);
  const token = localStorage.getItem("token");

  const cargarProfesores = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/coordinador/dashboard/profesores/activos",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setProfesores(data.profesores || []);
    } catch (err) {
      console.error("Error cargando profesores activos:", err);
    }
  };

  useEffect(() => {
    cargarProfesores();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Profesores Activos</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Grados asignados</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((prof, idx) => (
            <tr key={prof.id_funcionario}>
              <td>{idx + 1}</td>
              <td>{prof.persona?.nombre} {prof.persona?.apellido}</td>
              <td>{prof.usuario?.username}</td>
              <td>
                {prof.gradosAsignados && prof.gradosAsignados.length > 0
                  ? prof.gradosAsignados
                      .map(g => g.grado?.nombre_grado)
                      .filter((v, i, a) => a.indexOf(v) === i) // elimina duplicados
                      .join(", ")
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
