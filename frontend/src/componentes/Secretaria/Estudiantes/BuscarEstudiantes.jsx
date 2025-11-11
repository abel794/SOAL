import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const BuscarEstudiantes = () => {
  const [filtro, setFiltro] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const [cargando, setCargando] = useState(false);

  const buscarEstudiantes = async () => {
    if (!filtro.trim()) {
      setEstudiantes([]);
      setMensaje("⚠️ Ingresa un nombre o documento para buscar.");
      setTipoMensaje("danger");
      return;
    }

    try {
      setCargando(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setMensaje("No se encontró token de autenticación. Inicia sesión nuevamente.");
        setTipoMensaje("danger");
        setCargando(false);
        return;
      }

      // Petición con filtro y token
      const res = await axios.get(
        `http://localhost:3000/api/coordinador/estudiante/buscar?filtro=${encodeURIComponent(filtro)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEstudiantes(res.data || []);

      if (res.data.length > 0) {
        setMensaje(`✅ Se encontraron ${res.data.length} estudiantes`);
        setTipoMensaje("success");
      } else {
        setMensaje("No se encontraron estudiantes");
        setTipoMensaje("warning");
      }
    } catch (err) {
      console.error("❌ Error al buscar estudiantes:", err);
      setMensaje("Error al buscar estudiantes. Intenta nuevamente.");
      setTipoMensaje("danger");
      setEstudiantes([]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mt-4 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">📚 Buscar Estudiantes</h2>

      {/* Input + botón */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o documento"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={buscarEstudiantes}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>{" "}
              Buscando...
            </>
          ) : (
            "Buscar"
          )}
        </button>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <div className={`alert alert-${tipoMensaje} text-center`} role="alert">
          {mensaje}
        </div>
      )}

      {/* Tabla de resultados */}
      <div className="table-responsive mt-3">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Documento</th>
              <th>EPS</th>
              <th>Estado académico</th>
              <th>Nombre acudiente</th>
              <th>Documento acudiente</th>
              <th>Teléfono acudiente</th>
              <th>Dirección</th>
              <th>Email acudiente</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.length > 0 ? (
              estudiantes.map((est) => {
                const acudiente = est.acudientes?.[0];
                const personaEst = est.persona;
                const personaAcu = acudiente?.persona;

                return (
                  <tr key={est.id_estudiante}>
                    <td>{personaEst?.nombre || "—"}</td>
                    <td>{personaEst?.apellido || "—"}</td>
                    <td>{personaEst?.numero_documento || "—"}</td>
                    <td>{est.eps?.nombre || "—"}</td>
                    <td>{est.estadoAcademico?.nombre || "—"}</td>
                    {acudiente ? (
                      <>
                        <td>
                          {personaAcu?.nombre} {personaAcu?.apellido}
                        </td>
                        <td>{acudiente.numero_documento || "—"}</td>
                        <td>{personaAcu?.telefono || "—"}</td>
                        <td>{personaAcu?.direccion || "—"}</td>
                        <td>{personaAcu?.correo || "—"}</td>
                      </>
                    ) : (
                      <td colSpan={5} className="text-center">
                        Sin acudiente
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No hay estudiantes para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuscarEstudiantes;
