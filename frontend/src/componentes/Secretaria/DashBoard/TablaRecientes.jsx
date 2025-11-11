import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style/TablaRecientes.css';

const TablaRecientes = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/dashboard-secretaria/recientes")
      .then((res) => {
        setDatos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error al obtener movimientos recientes:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="tabla-recientes">
      <h3>Movimientos recientes</h3>
      <table>
        <thead>
          <tr>
            <th>Observacion</th>
            <th>Fecha</th>
            <th>Estudiante</th>
            <th>Funcionario</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4">⏳ Cargando...</td>
            </tr>
          ) : datos.length > 0 ? (
            datos.map((d, i) => (
              <tr key={i}>
                <td>{d.descripcion}</td>
                <td>{d.fecha}</td>
                <td>{d.estudiante?.numero_documento || "N/A"}</td>
                <td>{d.funcionario?.id_funcionario || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">⚠️ No hay datos recientes</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaRecientes;
