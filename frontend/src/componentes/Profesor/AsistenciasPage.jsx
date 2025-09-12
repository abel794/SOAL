import React, { useState, useEffect } from "react";
import AsistenciasList from "./AsistenciasList";
import AsistenciaForm from "./AsistenciaForm";
import AsistenciasMasivas from "./AsistenciasMasivas";

const AsistenciasPage = ({ idProfesor }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [vista, setVista] = useState("listado"); // 👈 control de vista

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profesor/${idProfesor}/estudiantes`);
        const json = await res.json();
        setEstudiantes(json.data || []);
      } catch (error) {
        console.error("Error cargando estudiantes:", error);
      }
    };
    fetchEstudiantes();
  }, [idProfesor]);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/estadoAsistencia"); // corregida ruta
        const data = await res.json();
        setEstados(data || []);
      } catch (error) {
        console.error("Error cargando estados:", error);
      }
    };
    fetchEstados();
  }, []);

  return (
    <div>
      <h2>📋 Gestión de Asistencias</h2>

      {/* Selector de vista */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setVista("form")}>➕ Individual</button>
        <button onClick={() => setVista("listado")}>📑 Tabla Masiva</button>
        <button onClick={() => setVista("manual")}>✍ Manual Masivo</button>
      </div>

      {vista === "form" && (
        <AsistenciaForm idProfesor={idProfesor} onNuevoRegistro={() => alert("Asistencia registrada")} />
      )}

      {vista === "listado" && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <label>Fecha: </label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <AsistenciasList
            estudiantes={estudiantes}
            estados={estados}
            idProfesor={idProfesor}
            fecha={fecha}
          />
        </>
      )}

      {vista === "manual" && <AsistenciasMasivas />}
    </div>
  );
};

export default AsistenciasPage;
