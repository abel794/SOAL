import React, { useState } from 'react';
import './Notificaciones.css';

const dataEjemplo = [
  {
    id: 1,
    estudiante: 'David Martinez',
    categoria: 'Comportamiento',
    grado: '4A',
    fecha: '24 abr. 2024, 10:30',
    titulo: 'Observación importante para los padres',
    descripcion: 'El estudiante ha tenido un comportamiento inapropiado en clase de ciencias. Se solicita agendar una reunión con la institución.',
    clase: '—',
    estado: 'Activo'
  },
  {
    id: 2,
    estudiante: 'Gorge Rodríguez',
    categoria: 'Psicología',
    grado: '6A',
    fecha: '23 abr. 2024, 10:30',
    titulo: 'Observación importante para los padres',
    descripcion: 'El estudiante ha tenido un comportamiento inapropiado en clase de ciencias. Se solicita agendar una reunión con la institución.',
    clase: '—',
    estado: 'Activo'
  }
];

export default function Notificaciones() {
  const [busqueda, setBusqueda] = useState('');
  const [grado, setGrado] = useState('B');
  const [estado, setEstado] = useState('Activo');
  const [detalleId, setDetalleId] = useState(null);

  const toggleDetalles = (id) => {
    setDetalleId(prev => (prev === id ? null : id));
  };

  const filtradas = dataEjemplo.filter(n =>
    n.numero_documento?.includes(busqueda) && n.grado.includes(grado) && n.estado.includes(estado)
  );

  return (
    <div className="noti-principal">
      <header className="noti-encabezado">
        <div>
          <h2>Observador Estudiantil</h2>
          <p>Instituto Renato Descartes</p>
          <h2>Notificaciones</h2>
        </div>
        <span>Profe Pedro.Gomez</span>
      </header>

      <section className="noti-filtros">
        <input
          type="text"
          placeholder="Buscar Número Documento"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={grado} onChange={(e) => setGrado(e.target.value)}>
          <option value="—">—</option>
          <option value="B">B</option>
          <option value="4A">4A</option>
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </section>

      <div className="noti-listado">
        {filtradas.map((n) => (
          <div key={n.id} className="noti-tarjeta">
            <div className="noti-cabecera">
              <p><strong>{n.estudiante}</strong></p>
              <p>{n.fecha}</p>
            </div>
            <h4>{n.titulo}</h4>
            <p><strong>Grado:</strong> {n.grado}</p>
            {detalleId === n.id ? (
              <div className="noti-detalles">
                <p><strong>Descripción:</strong> {n.descripcion}</p>
                <p><strong>Categoría:</strong> {n.categoria}</p>
                <button onClick={() => toggleDetalles(n.id)}>Ocultar</button>
              </div>
            ) : (
              <button className="btn-detalles" onClick={() => toggleDetalles(n.id)}>Ver detalles</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
