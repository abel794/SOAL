import React from 'react';
import './style/GraficoCircular.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Completados', value: 60 },
  { name: 'Pendientes', value: 30 },
  { name: 'Observados', value: 10 },
];

const colores = ['#00C49F', '#FFBB28', '#FF8042'];

const GraficoCircular = () => {
  return (
    <div className="grafico-circular">
      <h3>Estado de Formularios</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCircular;
