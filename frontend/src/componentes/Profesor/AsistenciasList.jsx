import React, { useState, useEffect } from "react";

const AsistenciasList = ({ estudiantes, estados, idProfesor, fecha }) => {
  const [asistencias, setAsistencias] = useState({});

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/profesor/asistencias?fecha=${fecha}&id_funcionario=${idProfesor}`
        );
        const data = await res.json();
        const mapped = {};
        data.forEach((a) => {
          mapped[a.id_estudiante] = a.id_estado_asistencia;
        });
        setAsistencias(mapped);
      } catch (error) {
        console.error("Error cargando asistencias:", error);
      }
    };
    fetchAsistencias();
  }, [fecha, idProfesor]);

  const handleChange = (idEstudiante, idEstado) => {
    setAsistencias((prev) => ({ ...prev, [idEstudiante]: idEstado }));
  };

  const handleGuardar = async () => {
    const payload = Object.entries(asistencias).map(
      ([id_estudiante, id_estado_asistencia]) => ({
        id_estudiante: parseInt(id_estudiante),
        id_estado_asistencia: parseInt(id_estado_asistencia),
      })
    );

    try {
      const res = await fetch(
        `http://localhost:5000/api/profesor/asistencias/registro-masivo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_funcionario: idProfesor,
            id_grado_asistencia: 1,
            fecha,
            asistencias: payload,
          }),
        }
      );
      const data = await res.json();
      alert(data.mensaje || "Asistencias guardadas correctamente");
    } catch (error) {
      console.error("Error al guardar asistencias:", error);
      alert("Error al guardar asistencias");
    }
  };

  return (
    <div>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nombre completo</th>
            <th>Grado</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((est) => (
            <tr key={est.id_estudiante}>
              <td>{est.numero_documento}</td>
              <td>{`${est.persona.nombre} ${est.persona.apellido}`}</td>
              <td>{est.grado}</td>
              <td>
                <select
                  value={asistencias[est.id_estudiante] || ""}
                  onChange={(e) =>
                    handleChange(est.id_estudiante, e.target.value)
                  }
                >
                  <option value="">Seleccione</option>
                  {estados.map((e) => (
                    <option
                      key={e.id_estado_asistencia}
                      value={e.id_estado_asistencia}
                    >
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleGuardar}
        style={{ marginTop: "20px", padding: "5px 10px" }}
      >
        Guardar Asistencias
      </button>
    </div>
  );
};

export default AsistenciasList;
