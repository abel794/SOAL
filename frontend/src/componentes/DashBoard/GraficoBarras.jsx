import React from 'react';
import './style/GraficoBarras.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { mes: 'Ene', inscritos: 30, reportes: 20 },
  { mes: 'Feb', inscritos: 45, reportes: 25 },
  { mes: 'Mar', inscritos: 60, reportes: 30 },
  { mes: 'Abr', inscritos: 50, reportes: 40 },
  { mes: 'May', inscritos: 70, reportes: 45 },
  { mes: 'Jun', inscritos: 55, reportes: 35 },
];

const GraficoBarras = () => {
  return (
    <div className="grafico-barras">
      <h3>Estadísticas Mensuales</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="inscritos" fill="#8884d8" />
          <Bar dataKey="reportes" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoBarras;
