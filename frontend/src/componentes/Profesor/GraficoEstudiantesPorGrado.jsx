// frontend/src/Profesor/GraficoEstudiantesPorGrado.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";

const GraficoEstudiantesPorGrado = ({ estudiantes }) => {
  // Contar estudiantes por grado
  const conteoPorGrado = estudiantes.reduce((acc, est) => {
    acc[est.grado] = (acc[est.grado] || 0) + 1;
    return acc;
  }, {});

  // Convertir en array para el gráfico
  const dataGrafico = Object.entries(conteoPorGrado).map(([grado, cantidad]) => ({
    grado,
    cantidad,
  }));

  return (
    <div style={{ width: "100%", height: 300, marginBottom: "20px" }}>
      <h3>📊 Estudiantes por Grado</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dataGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grado" label={{ value: "Grado", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Cantidad", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#4f46e5">
            <LabelList dataKey="cantidad" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoEstudiantesPorGrado;
