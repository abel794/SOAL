import React, { useState, useEffect } from 'react';

function DashboardCards() {
  const [estudiantesAsignados, setEstudiantesAsignados] = useState(null);
  const [observaciones, setObservaciones] = useState(null);
  const [criticos, setCriticos] = useState(null);
  const [citas, setCitas] = useState(null);

  const nombreGrado = 'Segundo';

  useEffect(() => {
    // Total de estudiantes en un grado
    async function fetchEstudiantes() {
      try {
        const res = await fetch(`http://localhost:3001/api/estudiante/count/grado/${encodeURIComponent(nombreGrado)}`);
        const data = await res.json();
        setEstudiantesAsignados(data.total_estudiantes);
      } catch (error) {
        console.error('Error estudiantes:', error);
        setEstudiantesAsignados('Error');
      }
    }

    // Total de observaciones
    async function fetchObservaciones() {
      try {
        const res = await fetch(`http://localhost:3001/api/observaciones/total`);
        const data = await res.json();
        setObservaciones(data.total_observaciones);
      } catch (error) {
        console.error('Error observaciones:', error);
        setObservaciones('Error');
      }
    }

    // Total de casos críticos (disciplina)
    async function fetchCriticos() {
      try {
        const res = await fetch(`http://localhost:3001/api/observaciones/criticos`);
        const data = await res.json();
        setCriticos(data.casos_criticos);
      } catch (error) {
        console.error('Error casos críticos:', error);
        setCriticos('Error');
      }
    }

    // Total de citas
    async function fetchCitas() {
      try {
        const res = await fetch(`http://localhost:3001/api/citas/total`);
        const data = await res.json();
        setCitas(data.total_citas);
      } catch (error) {
        console.error('Error citas:', error);
        setCitas('Error');
      }
    }

    fetchEstudiantes();
    fetchObservaciones();
    fetchCriticos();
    fetchCitas();
  }, [nombreGrado]);

  const cards = [
    {
      title: `Estudiantes asignados a ${nombreGrado}`,
      count:
        estudiantesAsignados === null
          ? 'Cargando...'
          : estudiantesAsignados === 'Error'
          ? 'Error'
          : estudiantesAsignados
    },
    {
      title: 'Observaciones registradas',
      count:
        observaciones === null
          ? 'Cargando...'
          : observaciones === 'Error'
          ? 'Error'
          : observaciones
    },
    {
      title: 'Casos críticos',
      count:
        criticos === null
          ? 'Cargando...'
          : criticos === 'Error'
          ? 'Error'
          : criticos
    },
    {
      title: 'Citas programadas',
      count:
        citas === null
          ? 'Cargando...'
          : citas === 'Error'
          ? 'Error'
          : citas
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

