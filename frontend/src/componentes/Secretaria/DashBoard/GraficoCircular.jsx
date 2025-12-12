import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style/GraficoCircular.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const colores = ['#00C49F', '#FFBB28', '#FF8042'];

const etiquetasMap = {
  Completados: 'Activado',
  Pendientes: 'En Proceso',
  Observados: 'Inactivo',
};

const GraficoCircular = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard-secretaria/estado_formularios`)
      .then(res => {
        // Cambiamos los nombres
        const dataConNombresNuevos = res.data.map(item => ({
          ...item,
          name: etiquetasMap[item.name] || item.name
        }));
        setData(dataConNombresNuevos);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grafico-circular">
      <h3>Estado de Usuarios</h3>
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
