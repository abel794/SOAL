import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficoTorta({ datos }) {
  const labels = Object.keys(datos);
  const values = Object.values(datos);

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
    }]
  };

  const options = {
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    maintainAspectRatio: false
  };

  return <Doughnut data={data} options={options} />;
}
