import React, { useState, useEffect } from "react";

const ListaEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Traer estudiantes del backend
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profesor/estudiantes", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error en la petición");
        }

        const data = await response.json();
        setEstudiantes(data.data); // <-- ahora usamos data.data
        setFilteredEstudiantes(data.data);
      } catch (error) {
        console.error("Error al obtener estudiantes:", error);
      }
    };

    fetchEstudiantes();
  }, []);

  // Filtrar por nombre o apellido
  useEffect(() => {
    let resultados = estudiantes;

    if (busqueda) {
      resultados = resultados.filter((e) =>
        `${e.persona.nombre} ${e.persona.apellido}`
          .toLowerCase()
          .includes(busqueda.toLowerCase())
      );
    }

    setFilteredEstudiantes(resultados);
  }, [busqueda, estudiantes]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">👨‍🎓 Estudiantes Asignados</h2>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o apellido"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Tabla */}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Documento</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Apellido</th>
            <th className="border px-4 py-2">Ciudad</th>
          </tr>
        </thead>
        <tbody>
          {filteredEstudiantes.length > 0 ? (
            filteredEstudiantes.map((est) => (
              <tr key={est.id_estudiante}>
                <td className="border px-4 py-2">{est.persona.numero_documento}</td>
                <td className="border px-4 py-2">{est.persona.nombre}</td>
                <td className="border px-4 py-2">{est.persona.apellido}</td>
                <td className="border px-4 py-2">{est.persona.ciudad_residencia}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-2">
                No se encontraron estudiantes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaEstudiantes;
