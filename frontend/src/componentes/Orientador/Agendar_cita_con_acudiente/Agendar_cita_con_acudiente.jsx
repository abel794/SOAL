import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import "./AgendarCitaAcu.css";
import ModalMensaje from "../../ui/ModalMensaje";

export default function AgendarCitaAcu({ setVista }) {
  const [fechaCita, setFechaCita] = useState("");
  const [motivo, setMotivo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [estudiante, setEstudiante] = useState(null);
  const [idAcudiente, setIdAcudiente] = useState("");
  const [idFuncionario, setIdFuncionario] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  const token = localStorage.getItem("token");

  const ejecutarAccion = useCallback(() => {
    console.log("Acción confirmada");
  }, []);

  // 🔹 Cargar datos del funcionario logueado
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario?.id_funcionario) setIdFuncionario(usuario.id_funcionario);
  }, []);

  // 🔎 Buscar estudiante por nombre
  const buscarEstudiante = useCallback(async () => {
    const filtro = busqueda.trim();
    if (!filtro) {
      Swal.fire("⚠️ Atención", "Ingresa un nombre para buscar.", "warning");
      return;
    }

    try {
      setCargando(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/coordinador/estudiante/buscar?filtro=${encodeURIComponent(filtro)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (res.ok && Array.isArray(data) && data.length > 0) {
        const estudianteEncontrado = data[0];
        setEstudiante(estudianteEncontrado);

        if (estudianteEncontrado.acudientes?.length > 0) {
          setIdAcudiente(estudianteEncontrado.acudientes[0].id_acudiente);
        } else {
          setIdAcudiente("");
          Swal.fire("ℹ️ Sin acudiente", "Este estudiante no tiene acudiente registrado.", "info");
        }
      } else {
        setEstudiante(null);
        setIdAcudiente("");
        Swal.fire("❌ No encontrado", "No se encontró ningún estudiante con ese nombre.", "error");
      }
    } catch (error) {
      console.error("Error al buscar:", error);
      Swal.fire("⚠️ Error", "No se pudo conectar con el servidor.", "error");
    } finally {
      setCargando(false);
    }
  }, [busqueda, token]);

  // 📅 Agendar cita
  const agendarCita = useCallback(async () => {
    if (!estudiante || !idAcudiente || !idFuncionario || !fechaCita || !motivo.trim()) {
      Swal.fire("⚠️ Campos incompletos", "Completa todos los campos antes de continuar.", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Confirmar cita?",
      html: `
        <p><b>Estudiante:</b> ${estudiante.persona?.nombre} ${estudiante.persona?.apellido}</p>
        <p><b>Fecha:</b> ${new Date(fechaCita).toLocaleString()}</p>
        <p><b>Motivo:</b> ${motivo}</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, agendar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    const datos = {
      id_estudiante: estudiante.id_estudiante,
      id_acudiente: parseInt(idAcudiente),
      id_funcionario: parseInt(idFuncionario),
      motivo: motivo.trim(),
      fecha_cita: fechaCita,
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/citas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("✅ Éxito", "La cita fue agendada correctamente.", "success");
        setFechaCita("");
        setMotivo("");
        setBusqueda("");
        setEstudiante(null);
      } else {
        Swal.fire("❌ Error", data.mensaje || "No se pudo crear la cita.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("⚠️ Error", "Hubo un problema con el servidor.", "error");
    }
  }, [estudiante, idAcudiente, idFuncionario, fechaCita, motivo, token]);

  // Manejar tecla Enter en búsqueda
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      buscarEstudiante();
    }
  }, [buscarEstudiante]);

  return (
    <div className="agendar-cita-container">
      <div className="agendar-card">
        <div className="card-header">
          <h2 className="titulo-cita">📅 Agendar Cita con Acudiente</h2>
          <p className="subtitulo-cita">Busca un estudiante y agenda una cita con su acudiente</p>
        </div>

        {/* 🔍 Buscar Estudiante */}
        <div className="seccion-busqueda">
          <div className="busqueda-container">
            <input
              type="text"
              placeholder="🔍 Buscar estudiante por nombre completo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={cargando}
              className="input-busqueda w-100"
            />
            <button 
              onClick={buscarEstudiante} 
              className="btn-buscar" 
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span className="spinner"></span>
                  Buscando...
                </>
              ) : (
                "Buscar Estudiante"
              )}
            </button>
          </div>
        </div>

        {/* 🧾 Información del Estudiante */}
        {estudiante && (
          <div className="info-estudiante">
            <h3 className="info-titulo">👤 Estudiante Encontrado</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{estudiante.persona?.nombre} {estudiante.persona?.apellido}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Documento:</span>
                <span className="info-value">{estudiante.persona?.numero_documento || "No registrado"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Teléfono:</span>
                <span className="info-value">{estudiante.persona?.telefono || "Sin registro"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Acudiente ID:</span>
                <span className="info-value">{idAcudiente || "No encontrado"}</span>
              </div>
            </div>
          </div>
        )}

        {/* 📅 Formulario de Cita */}
        {estudiante && idAcudiente && (
          <div className="formulario-cita">
            <h3 className="form-titulo">📝 Detalles de la Cita</h3>
            
            <div className="form-group">
              <label className="form-label">Fecha y Hora de la Cita *</label>
              <input
                type="datetime-local"
                value={fechaCita}
                onChange={(e) => setFechaCita(e.target.value)}
                className="form-input"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Motivo de la Cita *</label>
              <textarea
                placeholder="Describe brevemente el motivo de la cita, temas a tratar, observaciones importantes..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="form-textarea"
                rows="4"
              />
              <div className="contador-caracteres">
                {motivo.length}/500 caracteres
              </div>
            </div>

            <button 
              className="btn-agendar" 
              onClick={agendarCita}
              disabled={!fechaCita || !motivo.trim()}
            >
              ✅ Agendar Cita
            </button>
          </div>
        )}

        {/* 📋 Navegación */}
        <div className="navegacion-citas">
          <button 
            className="btn-ver-citas" 
            onClick={() => setVista("Ver citas")}
          >
            📋 Ver Todas las Citas
          </button>
        </div>

        {/* Modales */}
        <ModalMensaje
          visible={showConfirm}
          tipo="confirmacion"
          titulo="Confirmación"
          mensaje={confirmMessage}
          onClose={() => setShowConfirm(false)}
          onConfirm={ejecutarAccion}
        />

        <ModalMensaje
          visible={!!mensaje}
          tipo={mensaje.startsWith("❌") ? "error" : mensaje.startsWith("⚠️") ? "advertencia" : "exito"}
          titulo="Notificación"
          mensaje={mensaje}
          onClose={() => { setMensaje(''); setUsuarioGenerado(null); }}
        />
      </div>
    </div>
  );
}