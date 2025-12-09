import React, { useState, useEffect } from 'react';
import {
  FaUserGraduate,
  FaFilter,
  FaInfoCircle,
  FaHistory,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaComments,
  FaChartBar
} from 'react-icons/fa';
import './PromoverEstudiantes.css';

const AnalisisOrientador = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [informe, setInforme] = useState('');
  const [mensaje, setMensaje] = useState('');

  const datos = [
    { id: 1, nombre: "Andrea", riesgo: "Alto", observaciones: 5, asistencia: 70 },
    { id: 2, nombre: "Sara", riesgo: "Bajo", observaciones: 1, asistencia: 95 },
    { id: 3, nombre: "Camilo", riesgo: "Medio", observaciones: 3, asistencia: 80 }
  ];

  useEffect(() => {
    cargar();
  }, []);

  const cargar = () => {
    setLoading(true);
    setTimeout(() => {
      setEstudiantes(datos);
      setLoading(false);
    }, 900);
  };

  const enviarInforme = () => {
    setMensaje(`✔ Informe enviado para ${estudianteSeleccionado.nombre}`);
    setInforme('');
  };

  const filtrados = estudiantes.filter(e =>
    e.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="promover-estudiantes-container">

      <div className="promover-header">
        <h1><FaChartBar /> Análisis Integral del Estudiante (Orientador)</h1>
      </div>

      {mensaje && <div className="mensaje-alerta success">{mensaje}</div>}

      <div className="promover-content">

        {/* Lista de estudiantes */}
        <div className="panel-estudiantes">
          <div className="panel-header">
            <h3><FaUserGraduate /> Estudiantes</h3>

            <div className="filtro-busqueda">
              <FaFilter />
              <input 
                placeholder="Buscar..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>

          {!loading ? (
            filtrados.map(e => (
              <div
                key={e.id}
                className={`estudiante-item ${
                  estudianteSeleccionado?.id === e.id ? "seleccionado" : ""
                }`}
                onClick={() => setEstudianteSeleccionado(e)}
              >
                <div>
                  <span className="estudiante-nombre">{e.nombre}</span>
                  <span className={`riesgo-tag riesgo-${e.riesgo.toLowerCase()}`}>
                    {e.riesgo}
                  </span>
                </div>

                <button
                  className="btn-accion btn-detalles"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setEstudianteSeleccionado(e);
                  }}
                >
                  <FaInfoCircle /> Ver
                </button>
              </div>
            ))
          ) : (
            <p>Cargando estudiantes...</p>
          )}
        </div>

        {/* Panel derecho */}
        <div className="panel-acciones">
          {!estudianteSeleccionado ? (
            <p className="texto-guia">Selecciona un estudiante para analizarlo.</p>
          ) : (
            <>
              <h2><FaUserGraduate /> {estudianteSeleccionado.nombre}</h2>

              <div className="historial-comprensivo">
                <h4><FaHistory /> Historial</h4>
                <p>Observaciones: {estudianteSeleccionado.observaciones}</p>
                <p>Asistencia: {estudianteSeleccionado.asistencia}%</p>
              </div>

              <div className="historial-comprensivo">
                <h4><FaClipboardList /> PQR</h4>
                <p>Asociadas: 2</p>
              </div>

              <div className="historial-comprensivo">
                <h4><FaComments /> Citas con acudiente</h4>
                <p>Realizadas: 1</p>
              </div>

              <textarea
                placeholder="Informe o recomendación..."
                value={informe}
                onChange={(e) => setInforme(e.target.value)}
              />

              <button 
                className="btn-accion-principal"
                onClick={enviarInforme}
              >
                <FaCheckCircle /> Enviar Informe
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AnalisisOrientador;
