import { FaGraduationCap, FaClipboardList, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';

function DashboardCards() {
  const [estudiantesAsignados, setEstudiantesAsignados] = useState(null);
  const [observaciones, setObservaciones] = useState(null);
  const [criticos, setCriticos] = useState(null);
  const [citas, setCitas] = useState(null);

  const nombreGrado = 'Tercero';

  useEffect(() => {
    // 🎓 Total de estudiantes asignados al grado
    async function fetchEstudiantes() {
      try {
        const res = await fetch('http://localhost:3000/api/grados/3/contar');
        const data = await res.json();
        setEstudiantesAsignados(data.totalEstudiantes ?? 'Error'); // <- usa fallback si total no existe
      } catch (error) {
        console.error('❌ Error estudiantes:', error);
        setEstudiantesAsignados('Error');
      }
    }

    // 📋 Total de observaciones registradas
    async function fetchObservaciones() {
      try {
        const res = await fetch('http://localhost:3000/api/observacion/total');
        const data = await res.json();
        setObservaciones(data.totalObservaciones ?? 'Error');
      } catch (error) {
        console.error('❌ Error observaciones:', error);
        setObservaciones('Error');
      }
    }

    // 🚨 Total de casos críticos
    async function fetchCriticos() {
      try {
        const res = await fetch('http://localhost:3000/api/observacion/criticos');
        const data = await res.json();
        setCriticos(data.observacionesCriticas ?? 'Error'); // ✅ nombre correcto
      } catch (error) {
        console.error('❌ Error críticos:', error);
        setCriticos('Error');
      }
    }

    // 📅 Total de citas
    async function fetchCitas() {
      try {
        const res = await fetch('http://localhost:3000/api/citas/total');
        const data = await res.json();
        setCitas(data.totalCitas ?? 'Error');
      } catch (error) {
        console.error('❌ Error citas:', error);
        setCitas('Error');
      }
    }

    fetchEstudiantes();
    fetchObservaciones();
    fetchCriticos();
    fetchCitas();
  }, [nombreGrado]);

  // 🧱 Lista de tarjetas
  

const cards = [
  {
    title: (
      <>
        Estudiantes asignados a <br />
        <span className="text-primary"><FaGraduationCap /> {nombreGrado}</span>
      </>
    ),
    count: estudiantesAsignados ?? 'Cargando...'
  },
  {
    title: (
      <>
        Observaciones registradas <br />
        <FaClipboardList />
      </>
    ),
    count: observaciones ?? 'Cargando...'
  },
  {
    title: (
      <>
        Casos críticos <br />
        <FaExclamationTriangle className="text-danger" />
      </>
    ),
    count: criticos ?? 'Cargando...'
  },
  {
    title: (
      <>
        Citas programadas <br />
        <FaCalendarAlt className="text-info" />
      </>
    ),
    count: citas ?? 'Cargando...'
  }
];


  return (
    <div className="cards text-center d-flex gap-4 flex-wrap justify-content-center">
      {cards.map((item, i) => (
        <div className="card shadow p-3 rounded" style={{ width: '18rem' }} key={i}>
          <div className="card-body">
            <h4 className="card-title">{item.title}</h4>
            <h3 className="card-text">{item.count}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;



