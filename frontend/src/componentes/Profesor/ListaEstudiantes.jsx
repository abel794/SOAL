import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListaEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");

  // Obtener grados y estudiantes asignados al profesor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profesorId = localStorage.getItem('profesorId');
        const token = localStorage.getItem('token');

        if (!profesorId) {
          console.error("No se encontró profesorId");
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:3000/api/profesor/estudiantes', {
          params: {
            profesorId,
            nombre: busqueda || undefined,
            apellido: busqueda || undefined,
            numero_documento: busqueda || undefined,
            grado: gradoSeleccionado || undefined
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Extraer estudiantes y grados únicos
        const dataEstudiantes = res.data.data || [];
        setEstudiantes(dataEstudiantes);

        const gradosUnicos = Array.from(new Set(
          dataEstudiantes.map(est => est.grado?.nombre_grado).filter(Boolean)
        ));
        setGrados(gradosUnicos);

      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [busqueda, gradoSeleccionado]);

  if (loading) return <p>Cargando estudiantes...</p>;

  return (
    <div>
      <h2>📚 Mis Estudiantes</h2>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o documento"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      {/* Filtro por grado dinámico */}
      <select
        value={gradoSeleccionado}
        onChange={(e) => setGradoSeleccionado(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="">Todos los grados</option>
        {grados.map((g, idx) => (
          <option key={idx} value={g}>{g}</option>
        ))}
      </select>

      {estudiantes.length === 0 ? (
        <p>⚠️ No se encontraron estudiantes asignados.</p>
      ) : (
        <table border="1" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Grado</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((est, i) => (
              <tr key={i}>
                <td>{est.numero_documento}</td>
                <td>{est.persona?.nombre}</td>
                <td>{est.persona?.apellido}</td>
                <td>{est.grado?.nombre_grado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaEstudiantes;
