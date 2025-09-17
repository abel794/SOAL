import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "./GraficoEstudiantesPorGrado.css";

const GraficoEstudiantesPorGrado = ({ estudiantes }) => {
  const conteoPorGrado = estudiantes.reduce((acc, est) => {
    acc[est.grado] = (acc[est.grado] || 0) + 1;
    return acc;
  }, {});

  const dataGrafico = Object.entries(conteoPorGrado).map(([grado, cantidad]) => ({
    grado,
    cantidad,
  }));

  return (
    <div className="grafico-container card p-3 mb-3">
      <h3 className="grafico-title text-center">📊 Estudiantes por Grado</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grado" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cantidad" className="bar-azul">
            <LabelList dataKey="cantidad" position="top" className="grafico-label" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoEstudiantesPorGrado;
