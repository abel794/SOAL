import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GraficoBarras({ datos }) {
  const labels = Object.keys(datos);
  const values = Object.values(datos);

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: '#6c63ff',
      borderRadius: 5
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return <Bar data={data} options={options} />;
}
