import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style/GraficoBarras.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficoBarras = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard-secretaria/mensual`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grafico-barras">
      <h3>Inscripciones y Reportes por Mes</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="inscritos" fill="#8884d8" name="Inscritos" />
          <Bar dataKey="reportes" fill="#82ca9d" name="Reportes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoBarras;
