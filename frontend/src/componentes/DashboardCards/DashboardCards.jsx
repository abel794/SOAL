// src/componentes/DashboardCards/DashboardCards.jsx
import { FaGraduationCap, FaClipboardList, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import './DashboardCards.css';

function DashboardCards({ setVista }) {  // ✅ Recibe setVista bien
  const [estudiantesAsignados, setEstudiantesAsignados] = useState(null);
  const [observaciones, setObservaciones] = useState(null);
  const [criticos, setCriticos] = useState(null);
  const [citas, setCitas] = useState(null);

  const nombreGrado = 'Tercero';

  useEffect(() => {
    async function fetchData() {
      try {
        const resEst = await fetch('http://localhost:3000/api/grados/3/contar');
        const dataEst = await resEst.json();
        setEstudiantesAsignados(dataEst.total_estudiantes ?? 'Error');

        const resObs = await fetch('http://localhost:3000/api/observaciones/contar');
        const dataObs = await resObs.json();
        setObservaciones(dataObs.totalObservaciones ?? 'Error');

        const resCrit = await fetch('http://localhost:3000/api/observaciones/contar/criticas');
        const dataCrit = await resCrit.json();
        setCriticos(dataCrit.observacionesCriticas ?? 'Error');

        const resCitas = await fetch('http://localhost:3000/api/citas/contar');
        const dataCitas = await resCitas.json();
        setCitas(dataCitas.totalCitas ?? 'Error');
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      }
    }
    fetchData();
  }, [nombreGrado]);

  const cards = [
    {
      key: 'criticos',
      title: (
        <>
          Casos críticos <br />
          <FaExclamationTriangle className="text-danger" />
        </>
      ),
      count: criticos ?? 'Cargando...',
      vista: 'Casos críticos'
    },
    {
  key: 'estudiantes',
  title: (
    <>
      Estudiantes asignados <br />
      <span className="text-primary">
        <FaGraduationCap /> por grados
      </span>
    </>
  ),
  count: estudiantesAsignados ?? 'Cargando...',
  vista: 'Grados y estudiantes'
}
,
    {
      key: 'observaciones',
      title: (
        <>
          Observaciones registradas <br />
          <FaClipboardList />
        </>
      ),
      count: observaciones ?? 'Cargando...',
      vista: 'Registrar observación'
    },
    {
      key: 'citas',
      title: (
        <>
          Citas programadas <br />
          <FaCalendarAlt className="text-info" />
        </>
      ),
      count: citas ?? 'Cargando...',
      vista: 'Agendar cita con acudiente'
    }
  ];

  return (
    <div className="cards text-center d-flex gap-4 flex-wrap justify-content-center">
      {cards.map((item, i) => (
        <div className="card shadow p-3 rounded" style={{ width: '18rem' }} key={i}>
          <div className="card-body">
            <h4 className="card-title">{item.title}</h4>
            <h3 className="card-text">{item.count}</h3>
            <button 
              className="btn btn-primary mt-2" 
              onClick={() => setVista(item.vista)}> {/* ✅ Esto ahora funciona */}
              Ver más
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;




