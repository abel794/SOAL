import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import "./GraficoTorta.css"; // ✅ Estilos externos

const PorcentajePorGravedad = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colores institucionales (verde, azul, rosa)
  const COLORS = ["#127c32", "#00509e", "#E91E63"];

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "http://localhost:3000/api/coordinador/observaciones/contar/gravedad"
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const resumen = json.resumen || {};
        const order = ["Leve", "Moderada", "Grave"];

        const entries = order
          .filter((k) => resumen[k])
          .map((k) => [k, resumen[k]]);

        const finalEntries =
          entries.length > 0
            ? entries
            : Object.entries(resumen).filter(([k]) => k !== "Otros");

        const transformed = finalEntries.map(([key, value]) => ({
          name: key,
          value: Number(value.cantidad || 0),
          porcentaje: value.porcentaje || "0.0%",
        }));

        if (mounted) setData(transformed);
      } catch (err) {
        if (mounted) setError(err.message || "Error desconocido");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="porcentaje-wrapper">
        <h2>Gravedad</h2>
        <div className="porcentaje-estado">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="porcentaje-wrapper">
        <h2>Gravedad</h2>
        <div className="porcentaje-error">Error al cargar datos: {error}</div>
      </div>
    );
  }

  const totalSlices = data.reduce((s, d) => s + (d.value || 0), 0);
  if (!data.length || totalSlices === 0) {
    return (
      <div className="porcentaje-wrapper">
        <h2>Gravedad</h2>
        <div className="porcentaje-estado">No hay datos para mostrar</div>
      </div>
    );
  }

  return (
    <div className="porcentaje-wrapper">
      <h2>Gravedad</h2>
      <div className="porcentaje-chart-box">
        <ResponsiveContainer width="100%" height="70%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="65%"
              paddingAngle={4}
              dataKey="value"
              labelLine={false}
              label={({ percent, name }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => {
                const item = data.find((d) => d.name === name);
                return [`${value}`, item?.porcentaje ?? ""];
              }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="square"
              formatter={(value) => {
                const item = data.find((d) => d.name === value);
                return `${value} (${item?.porcentaje ?? "0.0%"})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PorcentajePorGravedad;
