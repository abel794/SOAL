import React, { useState, useEffect, useCallback } from "react";
import "./VerCitas.css";

function VerCitas({ setVista = () => {}, setCitaSeleccionada = () => {} }) {
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("nombre");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // Obtener todas las citas
  const obtenerTodasCitas = useCallback(async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMensaje("⚠️ No tienes sesión activa. Inicia sesión.");
        return;
      }

      const res = await fetch("http://localhost:3000/api/coordinador/citas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setCitas(Array.isArray(data) ? data : []);
        setMensaje("");
      } else {
        setCitas([]);
        setMensaje(data.mensaje || "❌ No se pudieron obtener las citas");
      }
    } catch (error) {
      console.error("Error al obtener citas:", error);
      setCitas([]);
      setMensaje("⚠️ Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  }, []);

  // Filtrar citas
  const filtrarCitas = useCallback(async () => {
    if (!filtro.trim()) {
      setMensaje("⚠️ Ingresa un valor para filtrar");
      return;
    }

    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMensaje("⚠️ No tienes sesión activa. Inicia sesión.");
        return;
      }

      const url =
        tipoFiltro === "nombre"
          ? `http://localhost:3000/api/coordinador/citas/buscar/nombre?nombre=${encodeURIComponent(filtro)}`
          : `http://localhost:3000/api/coordinador/citas/buscar/documento?documento=${encodeURIComponent(filtro)}`;

      const res = await fetch(url, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();

      if (res.ok) {
        setCitas(Array.isArray(data.citas) ? data.citas : Array.isArray(data) ? data : []);
        setMensaje("");
      } else {
        setCitas([]);
        setMensaje(data.mensaje || "❌ No se encontraron citas");
      }
    } catch (error) {
      console.error("Error al filtrar citas:", error);
      setCitas([]);
      setMensaje("⚠️ Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  }, [filtro, tipoFiltro]);

  // Cargar citas al montar
  useEffect(() => {
    obtenerTodasCitas();
  }, [obtenerTodasCitas]);

  // Manejar tecla Enter
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      filtrarCitas();
    }
  }, [filtrarCitas]);

  return (
    <div className="ver-citas-container">
      <div className="citas-header">
        <h2 className="titulo">📋 Gestión de Citas</h2>
        <p className="subtitulo">Visualiza y gestiona todas las citas programadas</p>
      </div>

      {/* 🔎 Filtros de Búsqueda */}
      <div className="filtros-section">
        <div className="filtros-container">
          <select
            className="filtro-select"
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
          >
            <option value="nombre">Por nombre</option>
            <option value="documento">Por documento</option>
          </select>

          <input
            type="text"
            className="filtro-input"
            placeholder={`🔍 Ingrese ${tipoFiltro === 'nombre' ? 'nombre del estudiante' : 'número de documento'}`}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <div className="botones-filtro">
            <button className="btn-filtrar" onClick={filtrarCitas}>
              Buscar
            </button>
            <button className="btn-todas" onClick={obtenerTodasCitas}>
              Ver Todas
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Estado y Mensajes */}
      <div className="estado-section">
        {mensaje && (
          <div className={`mensaje-alerta ${mensaje.includes('❌') ? 'error' : mensaje.includes('⚠️') ? 'advertencia' : 'info'}`}>
            {mensaje}
          </div>
        )}
        
        {cargando && (
          <div className="cargando-container">
            <div className="spinner"></div>
            <span>Cargando citas...</span>
          </div>
        )}

        {!cargando && citas.length > 0 && (
          <div className="contador-citas">
            Se encontraron {citas.length} cita{citas.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* 📑 Tabla de Citas */}
      {!cargando && (
        <div className="tabla-section">
          <div className="tabla-container">
            <table className="tabla-citas">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Acudiente</th>
                  <th>Funcionario</th>
                  <th>Fecha y Hora</th>
                  <th>Motivo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.length > 0 ? (
                  citas.map((cita) => (
                    <tr key={cita.id_cita} className="fila-cita">
                      <td data-label="Estudiante">
                        {`${cita.estudiante?.persona?.nombre || ''} ${cita.estudiante?.persona?.apellido || ''}`}
                      </td>
                      <td data-label="Acudiente">
                        {`${cita.acudiente?.persona?.nombre || ''} ${cita.acudiente?.persona?.apellido || ''}`}
                      </td>
                      <td data-label="Funcionario">
                        {cita.funcionario?.usuario?.usuario || 'Funcionario'}
                      </td>
                      <td data-label="Fecha y Hora">
                        {new Date(cita.fecha_cita).toLocaleString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td data-label="Motivo" className="motivo-cell">
                        <span title={cita.motivo}>
                          {cita.motivo.length > 50 
                            ? `${cita.motivo.substring(0, 50)}...` 
                            : cita.motivo
                          }
                        </span>
                      </td>
                      <td data-label="Acciones">
                        <button
                          className="btn-detalle"
                          onClick={() => {
                            setCitaSeleccionada(cita);
                            setVista("Detalle de Cita");
                          }}
                          title="Ver detalles completos"
                        >
                          👁️ Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="sin-citas">
                      <div className="estado-vacio">
                        <span>📭</span>
                        <p>No se encontraron citas</p>
                        <small>Intenta con otros criterios de búsqueda</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerCitas;