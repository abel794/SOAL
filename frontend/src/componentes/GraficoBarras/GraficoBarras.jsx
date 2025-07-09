// src/componentes/GraficoBarras/GraficoBarras.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './GraficoBarras.css'; // Importa el CSS externo

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GraficoBarras({ datos }) {
  const labels = datos.map(item => item.nombre);
  const values = datos.map(item => item.cantidad);

  const data = {
    labels,
    datasets: [
      {
        label: 'Cantidad',
        data: values,
        backgroundColor: ['#6c63ff', '#4CAF50', '#FFC107', '#F44336'],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="grafico-barras-contenedor">
      <h4>Gráfico de barras</h4>
      <Bar data={data} options={options} />
    </div>
  );
}
