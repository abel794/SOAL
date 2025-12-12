import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./GraficoBarras.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Plugin para mostrar valor y % encima de cada barra
const barLabelsPlugin = {
  id: "barLabelsPlugin",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const dataset = chart.data.datasets[0] || {};
    const dataArr = dataset.data || [];
    const total = dataArr.reduce((a, b) => a + (Number(b) || 0), 0) || 1;

    ctx.save();
    ctx.font = "600 12px sans-serif";
    ctx.fillStyle = "#111";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    const meta = chart.getDatasetMeta(0);
    meta.data.forEach((bar, index) => {
      const value = Number(dataArr[index]) || 0;
      if (value === 0) return;
      const pct = ((value / total) * 100).toFixed(1);
      const x = bar.x;
      const y = bar.y - 6;
      ctx.fillText(`${value} (${pct}%)`, x, y);
    });

    ctx.restore();
  },
};
ChartJS.register(barLabelsPlugin);

export default function GraficoBarras() {
  const [conteoPorCategoria, setConteoPorCategoria] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/coordinador/observaciones/contar/categoria`,
          { headers }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("🔍 respuesta /contar/categoria:", data);

        // Convertir porcentajes a valores absolutos
        const totalGlobal = Number(data.total) || 1;
        const conteo = {};
        if (data.porcentajes && typeof data.porcentajes === "object") {
          Object.entries(data.porcentajes).forEach(([categoria, pctStr]) => {
            const pct = parseFloat(pctStr.replace("%", "")) || 0;
            conteo[categoria] = Math.round((pct / 100) * totalGlobal);
          });
        }

        setConteoPorCategoria(conteo);
      } catch (err) {
        console.error("❌ Error cargando categorías:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Tomar las categorías dinámicamente según lo que devolvió la API
  const orderedLabels = Object.keys(conteoPorCategoria);
  const values = orderedLabels.map(lbl => conteoPorCategoria[lbl] || 0);
  const total = values.reduce((a, b) => a + b, 0) || 1;

  const colorMap = {
    Académico: "#048609",
    Asistencia: "#023967",
    Comportamiento: "#b06c06",
    Convivencia: "#9006a9",
    Disciplina: "#ff0000",
    Otros: "#6366F1",
    "Psicológica": "#FFA500",
    Salud: "#00BFFF",
    Tecnología: "#8B008B",
    Uniforme: "#808080",
  };
  const backgroundColors = orderedLabels.map(lbl => colorMap[lbl] || "#6366F1");

  const chartData = {
    labels: orderedLabels,
    datasets: [
      {
        label: "Cantidad de observaciones",
        data: values,
        backgroundColor: backgroundColors,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "📊 Observaciones por categoría", font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: function (context) {
            const v = context.parsed.y ?? 0;
            const pct = ((v / total) * 100).toFixed(1);
            return `${v} (${pct}%)`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { maxRotation: 0, autoSkip: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <div className="grafico-barras-wrapper">
      <div className="grafico-barras-header">
        <h5>📊 Gráfico de observaciones</h5>
      </div>

      <div className="grafico-barras-caja">
        {cargando ? <p>Cargando datos...</p> : <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
}
