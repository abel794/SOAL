import React, { useState, useEffect } from "react";
import "./RegistrarAsistenciaMasiva.css"; // CSS propio

const RegistrarAsistenciaMasiva = ({ idProfesor }) => {
  const [grados, setGrados] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({
    id_grado: "",
    fecha: "",
    asistencias: [],
  });

  // Fetch grados
  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profesor/${idProfesor}/grados`);
        const data = await res.json();
        setGrados(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGrados();
  }, [idProfesor]);

  // Fetch estados
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/estado_asistencia");
        const data = await res.json();
        setEstados(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEstados();
  }, []);

  // Handle grado change
  const handleGradoChange = async (e) => {
    const id_grado = e.target.value;
    setForm({ ...form, id_grado, asistencias: [] });

    if (!id_grado) {
      setEstudiantes([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/profesor/${idProfesor}/estudiantes/${id_grado}`
      );
      const data = await res.json();
      const estudiantesData = data.data || [];
      setEstudiantes(estudiantesData);

      setForm((prev) => ({
        ...prev,
        asistencias: estudiantesData.map((e) => ({
          id_estudiante: e.id_estudiante,
          id_estado_asistencia: "",
          observacion: "",
        })),
      }));
    } catch (err) {
      console.error(err);
      setEstudiantes([]);
    }
  };

  const handleAsistenciaChange = (index, field, value) => {
    const nuevasAsistencias = [...form.asistencias];
    nuevasAsistencias[index][field] = value;
    setForm({ ...form, asistencias: nuevasAsistencias });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_grado || !form.fecha) {
      alert("Debes seleccionar un grado y una fecha");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/profesor/asistencias/registro-masivo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_funcionario: idProfesor,
          id_grado: form.id_grado,
          fecha: form.fecha,
          asistencias: form.asistencias,
        }),
      });

      const data = await res.json();
      alert(data.mensaje || "Asistencias registradas");
    } catch (err) {
      console.error(err);
      alert("Error registrando asistencias masivas");
    }
  };

  return (
    <div className="registrar-asistencia-container p-4">
      <h2 className="mb-4">📋 Registrar Asistencia Masiva</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Grado:</label>
          <select
            className="form-select azul-select"
            value={form.id_grado}
            onChange={handleGradoChange}
            required
          >
            <option value="">Selecciona un grado</option>
            {grados.map((g) => (
              <option key={g.id_grado} value={g.id_grado}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha:</label>
          <input
            type="date"
            className="form-control azul-select"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            required
          />
        </div>

        {estudiantes.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>Estudiante</th>
                  <th>Estado</th>
                  <th>Observación</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est, index) => (
                  <tr key={est.id_estudiante}>
                    <td>
                      {est.persona?.nombre} {est.persona?.apellido}
                    </td>
                    <td>
                      <select
                        className="form-select azul-select"
                        value={form.asistencias[index]?.id_estado_asistencia || ""}
                        onChange={(e) =>
                          handleAsistenciaChange(index, "id_estado_asistencia", e.target.value)
                        }
                        required
                      >
                        <option value="">Selecciona estado</option>
                        {estados.map((es) => (
                          <option key={es.id_estado_asistencia} value={es.id_estado_asistencia}>
                            {es.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={form.asistencias[index]?.observacion || ""}
                        onChange={(e) =>
                          handleAsistenciaChange(index, "observacion", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {estudiantes.length > 0 && (
          <button type="submit" className="btn btn-azul mt-3">
            Guardar asistencias masivas
          </button>
        )}
      </form>
    </div>
  );
};

export default RegistrarAsistenciaMasiva;
