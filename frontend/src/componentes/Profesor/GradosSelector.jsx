import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Importa Bootstrap (si aún no lo haces en App.jsx)

const GradosSelector = ({ grados, gradoSeleccionado, setGradoSeleccionado }) => {
  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body text-center">
          <h4 className="text-primary fw-bold mb-3">Seleccionar grado</h4>
          <hr className="mx-auto mb-4" style={{ width: "60px", borderTop: "3px solid #0d6efd" }} />

          <div className="d-flex justify-content-center">
            <select
              className="form-select form-select-lg w-50"
              value={gradoSeleccionado || ""}
              onChange={(e) => setGradoSeleccionado(e.target.value)}
            >
              <option value="">-- Selecciona un grado --</option>
              {grados.map((g) => (
                <option key={g.id_grado} value={g.id_grado}>
                  {g.nombre}
                </option>
              ))}
            </select>
          </div>

          {gradoSeleccionado && (
            <div className="alert alert-info mt-4 w-50 mx-auto">
              Has seleccionado el grado{" "}
              <strong>
                {grados.find((gr) => gr.id_grado === parseInt(gradoSeleccionado))?.nombre}
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradosSelector;
