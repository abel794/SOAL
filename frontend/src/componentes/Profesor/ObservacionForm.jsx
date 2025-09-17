import React, { useState, useEffect } from "react";
import "./ObservacionForm.css";

const ObservacionForm = ({ estudiante, idProfesor }) => {
  const [categorias, setCategorias] = useState([]);
  const [gravedades, setGravedades] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [gravedad, setGravedad] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categorias");
        const data = await res.json();
        setCategorias(data.categorias || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchGravedades = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/gravedades");
        const data = await res.json();
        setGravedades(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGravedades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoria || !gravedad || !descripcion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/profesor/observaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_estudiante: estudiante.id_estudiante,
          id_categoria: parseInt(categoria),
          id_gravedad: parseInt(gravedad),
          id_funcionario: idProfesor,
          descripcion,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Observación registrada con éxito");
        setDescripcion("");
        setCategoria("");
        setGravedad("");
      } else {
        alert("Error al registrar observación: " + (data.error || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Error al registrar observación");
    }
  };

  return (
    <div className="observacion-form-container p-4 mt-3">
      <h3 className="mb-3">Registrar observación para {estudiante.persona.nombre}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Categoría:</label>
          <select
            className="form-select azul-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Gravedad:</label>
          <select
            className="form-select azul-select"
            value={gravedad}
            onChange={(e) => setGravedad(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {gravedades.map((g) => (
              <option key={g.id_gravedad} value={g.id_gravedad}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción:</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" className="btn btn-azul">
          Registrar Observación
        </button>
      </form>
    </div>
  );
};

export default ObservacionForm;
