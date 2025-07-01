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
  // ✅ Extrae etiquetas y valores del array de objetos
  const labels = datos.map(item => item.nombre);
  const values = datos.map(item => item.cantidad);

  const data = {
    labels,
    datasets: [{
      label: 'Cantidad',
      data: values,
      backgroundColor: '#6c63ff',
      borderRadius: 5,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0 // Solo enteros
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
}
