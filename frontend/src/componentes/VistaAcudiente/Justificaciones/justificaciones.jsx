// src/componentes/EnviarJustificacion.jsx
import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

const EnviarJustificacion = ({ setSeccionActiva, estudianteId: propEstudianteId = null }) => {
  const [fecha, setFecha] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [numero_documento, setNumero_documento]=useState("")
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (file) => {
    if (!file) return "No se seleccionó archivo.";
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) return "Formato no válido. Solo PDF o imágenes permitidas.";
    if (file.size > MAX_FILE_BYTES) return `El archivo excede el tamaño máximo de ${MAX_FILE_BYTES / (1024 * 1024)} MB`;
    return null;
  };

  const handleFileChange = (e) => {
    setMensaje("");
    setError("");
    const f = e.target.files[0];
    const validationError = validateFile(f);
    if (validationError) {
      setArchivo(null);
      setError(validationError);
      console.warn("Archivo inválido:", validationError);
      return;
    }
    setArchivo(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    // validaciones básicas
    if (!fecha) {
      setError("Seleccione la fecha de la ausencia.");
      return;
    }
    if (!motivo || motivo.trim().length < 3) {
      setError("Ingrese un motivo válido (mínimo 3 caracteres).");
      return;
    }
    const fileError = validateFile(archivo);
    if (fileError) {
      setError(fileError);
      return;
    }

    // Preparar FormData
    const formData = new FormData();
    formData.append("fecha", fecha);
    formData.append("motivo", motivo);
    formData.append("numero_documento", numero_documento);


    if (archivo) formData.append("archivo", archivo);
    // Si tienes el id de estudiante en props, lo añadimos; si no, el backend puede inferirlo por token
    if (propEstudianteId) formData.append("id_estudiante", propEstudianteId);
    

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró token. Inicia sesión nuevamente.");
      return;
    }

    setSubmitting(true);
    setProgress(0);

    try {
      console.log("📤 Enviando justificación - payload FormData (oculto archivo en logs)...");
      const res = await axios.post("http://localhost:3000/api/coordinador/justificacion", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const p = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(p);
          }
        },
        timeout: 60_000, // opcional: timeout 60s
      });

      console.log("✅ Respuesta servidor justificación:", res.data);
      setMensaje("Justificación enviada correctamente.");
      setFecha("");
      setArchivo(null);
      setMotivo("");
      setError("");
      setProgress(0);
    } catch (err) {
      console.error("❌ Error al enviar justificación:", err);
      // intenta extraer mensaje útil desde la respuesta
      const serverMsg =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        err.response?.data?.detalle ||
        err.message ||
        "Error desconocido";
      setError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h5>Enviar Justificación</h5>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Fecha de ausencia:</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-3">
          <label>Motivo:</label>
          <textarea
            className="form-control"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        <div className="mb-3">
  <label>Número de documento:</label>
  <input
    type="text"
    className="form-control"
    value={numero_documento}
    onChange={(e) => setNumero_documento(e.target.value)}
    required
    disabled={submitting}
  />
</div>


        <div className="mb-3">
          <label>Adjuntar archivo (PDF o Imagen, máx 5MB):</label>
          <input
            type="file"
            accept=".pdf,image/*"
            className="form-control"
            onChange={handleFileChange}
            disabled={submitting}
            required
          />
          {archivo && (
            <small className="text-muted">
              Seleccionado: {archivo.name} ({(archivo.size / 1024).toFixed(0)} KB)
            </small>
          )}
        </div>


        {progress > 0 && (
          <div className="mb-2">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progress}%
              </div>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {mensaje && <div className="alert alert-success">{mensaje}</div>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar Justificación"}
        </button>
      </form>

      <button
        className="btn btn-secondary mt-3"
        onClick={() => setSeccionActiva && setSeccionActiva("Ver Justificaciones")}
      >
        Ver Justificaciones Enviadas
      </button>
    </div>
  );
};

EnviarJustificacion.propTypes = {
  setSeccionActiva: PropTypes.func,
  estudianteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default EnviarJustificacion;
