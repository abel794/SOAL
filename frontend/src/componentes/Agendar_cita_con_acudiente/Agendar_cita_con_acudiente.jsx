import React, { useState, useEffect } from 'react';
import './AgendarCitaAcu.css';

function AgendarCitaAcu() {
  const [fechaCita, setFechaCita] = useState('');
  const [motivo, setMotivo] = useState('');
  const [nombreBuscado, setNombreBuscado] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [idAcudiente, setIdAcudiente] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [mensaje, setMensaje] = useState('');

  // 🔐 Obtener el ID del funcionario logueado al iniciar
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    console.log('👤 Usuario desde localStorage:', usuario);
    if (usuario?.id_funcionario) {
      setIdFuncionario(usuario.id_funcionario);
    } else {
      console.warn("No se encontró id_funcionario en localStorage:", usuario);
    }
  }, []);

  // 🔎 Buscar estudiante
  const manejarBusqueda = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/estudiantes/buscar?filtro=${nombreBuscado}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data) && data.length > 0) {
        const estudianteEncontrado = data[0];
        setEstudiante(estudianteEncontrado);
        setMensaje(`✅ Estudiante encontrado: ${estudianteEncontrado.persona?.nombre || 'Sin nombre'}`);

        // Obtener el ID del acudiente
        if (estudianteEncontrado.acudiente) {
          setIdAcudiente(estudianteEncontrado.acudiente.id_acudiente);
        } else {
          setIdAcudiente('');
        }
      } else {
        setEstudiante(null);
        setIdAcudiente('');
        setMensaje('❌ Estudiante no encontrado.');
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setMensaje('⚠️ Error de conexión con el servidor.');
    }
  };

  // 📅 Agendar cita
  const agendarCita = async () => {
    if (!estudiante || !idAcudiente || !idFuncionario || !fechaCita || !motivo.trim()) {
      setMensaje('❗ Faltan datos para agendar la cita');
      return;
    }

    const datosCita = {
      id_estudiante: estudiante.id_estudiante,
      id_acudiente: parseInt(idAcudiente),
      id_funcionario: parseInt(idFuncionario),
      fecha_cita: fechaCita,
      motivo: motivo.trim()
    };

    try {
      const respuesta = await fetch('http://localhost:3000/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCita)
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensaje('✅ Cita creada con éxito');
        setFechaCita('');
        setMotivo('');
      } else {
        setMensaje('❌ Error al crear la cita');
        console.error(datos);
      }
    } catch (error) {
      console.error('Error al crear la cita: ', error);
      setMensaje('⚠️ Problemas de conexión');
    }
  };

  return (
    <div className="p-3">
      <h2>📅 Agendar cita con acudiente</h2>
      <div className="linea mb-3"></div>

      {/* Buscar estudiante */}
      <input
        type="text"
        placeholder="Buscar estudiante por nombre"
        value={nombreBuscado}
        onChange={(e) => setNombreBuscado(e.target.value)}
        style={{ padding: '8px', width: '60%', marginRight: '10px' }}
      />
      <button onClick={manejarBusqueda} style={{ padding: '8px 15px' }}>
        Buscar estudiante
      </button>

      {mensaje && <p className="mt-3 fw-bold">{mensaje}</p>}

      {/* Datos y formulario */}
      {estudiante && (
        <div className="mt-4">
          <p><strong>Nombre del estudiante:</strong> {estudiante.persona?.nombre} {estudiante.persona?.apellido}</p>
          <p><strong>Teléfono:</strong> {estudiante.persona?.telefono}</p>
          <p><strong>ID del acudiente:</strong> {idAcudiente || 'No encontrado'}</p>
          <p><strong>ID del funcionario (logueado):</strong> {idFuncionario || 'No encontrado'}</p>

          <div className="formulario-cita">
            <input
              type="datetime-local"
              value={fechaCita}
              onChange={(e) => setFechaCita(e.target.value)}
              style={{ padding: '8px', marginBottom: '10px' }}
            />
            <textarea
              placeholder="Motivo de la cita"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              style={{ padding: '8px', width: '100%', height: '80px' }}
            />
            <button onClick={agendarCita} className="btn btn-success mt-2">
              Agendar cita
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgendarCitaAcu;
