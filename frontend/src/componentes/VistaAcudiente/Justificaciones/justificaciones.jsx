// src/componentes/EnviarJustificacion.jsx
import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

const EnviarJustificacion = ({ setSeccionActiva, estudianteId: propEstudianteId = null }) => {
  const [fecha, setFecha] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [numero_documento, setNumero_documento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const resetForm = () => {
    setFecha("");
    setArchivo(null);
    setMotivo("");
    setNumero_documento("");
    setError("");
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setShowSuccess(false);

    // validaciones básicas
    if (!fecha) {
      setError("Seleccione la fecha de la ausencia.");
      return;
    }
    if (!motivo || motivo.trim().length < 3) {
      setError("Ingrese un motivo válido (mínimo 3 caracteres).");
      return;
    }
    if (!numero_documento || numero_documento.trim().length < 3) {
      setError("Ingrese un número de documento válido.");
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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/coordinador/justificacion`, formData, {
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
      setMensaje("¡Justificación enviada correctamente!");
      setShowSuccess(true);
      resetForm();
      
      // Auto-ocultar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setMensaje("");
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("❌ Error al enviar justificación:", err);
      // intenta extraer mensaje útil desde la respuesta
      const serverMsg =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        err.response?.data?.detalle ||
        err.message ||
        "Error desconocido al enviar la justificación";
      setError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex align-items-center mb-3">
            <h1 className="h2 fw-bold mb-0">
              <i className="bi bi-send-check me-2"></i>
              Enviar Justificación
            </h1>
            <span className="badge bg-primary ms-3">
              <i className="bi bi-shield-check me-1"></i>
              Seguro
            </span>
          </div>
          <p className="text-muted">
            Completa el formulario para justificar la ausencia de tu estudiante. Todos los campos son obligatorios.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="card-title mb-0">
                <i className="bi bi-clipboard-plus me-2"></i>
                Formulario de Justificación
              </h5>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                
                {/* Fecha de Ausencia */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-calendar-date me-2"></i>
                    Fecha de Ausencia *
                  </label>
                  <input
                    type="date"
                    className={`form-control form-control-lg ${error && !fecha ? 'is-invalid' : ''}`}
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    disabled={submitting}
                  />
                  <div className="form-text">
                    Selecciona la fecha en la que el estudiante estuvo ausente.
                  </div>
                </div>

                {/* Número de Documento */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-person-badge me-2"></i>
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${error && !numero_documento ? 'is-invalid' : ''}`}
                    value={numero_documento}
                    onChange={(e) => setNumero_documento(e.target.value)}
                    required
                    disabled={submitting}
                    placeholder="Ej: 1234567890"
                  />
                  <div className="form-text">
                    Documento de identidad del estudiante.
                  </div>
                </div>

                {/* Motivo */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-chat-text me-2"></i>
                    Motivo de la Ausencia *
                  </label>
                  <textarea
                    className={`form-control ${error && (!motivo || motivo.trim().length < 3) ? 'is-invalid' : ''}`}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    required
                    disabled={submitting}
                    rows="4"
                    placeholder="Describe detalladamente el motivo de la ausencia..."
                  />
                  <div className="form-text">
                    Describe el motivo con claridad. Mínimo 3 caracteres.
                  </div>
                </div>

                {/* Archivo Adjunto */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-paperclip me-2"></i>
                    Adjuntar Comprobante *
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className={`form-control ${error && validateFile(archivo) ? 'is-invalid' : ''}`}
                      onChange={handleFileChange}
                      disabled={submitting}
                      required
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => document.querySelector('input[type="file"]').click()}
                    >
                      <i className="bi bi-folder2-open"></i>
                    </button>
                  </div>
                  
                  {archivo && (
                    <div className="alert alert-success mt-3 d-flex align-items-center">
                      <i className="bi bi-file-earmark-check fs-4 me-3"></i>
                      <div>
                        <strong>Archivo seleccionado:</strong> {archivo.name}
                        <div className="text-muted small">
                          Tamaño: {(archivo.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="btn-close ms-auto"
                        onClick={() => setArchivo(null)}
                        aria-label="Eliminar archivo"
                      ></button>
                    </div>
                  )}
                  
                  <div className="form-text">
                    Formatos permitidos: PDF, PNG, JPG, GIF, WEBP. Tamaño máximo: 5 MB.
                  </div>
                </div>

                {/* Barra de Progreso */}
                {progress > 0 && progress < 100 && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">
                        <i className="bi bi-upload me-1"></i>
                        Subiendo archivo...
                      </span>
                      <span className="fw-bold">{progress}%</span>
                    </div>
                    <div className="progress" style={{ height: "10px" }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                )}

                {/* Mensajes de Error y Éxito */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                      <div>
                        <h6 className="alert-heading mb-1">Error</h6>
                        <p className="mb-0">{error}</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError("")}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                {mensaje && showSuccess && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-3 fs-4"></i>
                      <div>
                        <h6 className="alert-heading mb-1">¡Éxito!</h6>
                        <p className="mb-0">{mensaje}</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setMensaje("")}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                {/* Botones de Acción */}
                <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg flex-fill"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-check me-2"></i>
                        Enviar Justificación
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Limpiar Formulario
                  </button>
                </div>
              </form>
            </div>
            
            {/* Footer de la Card */}
            <div className="card-footer bg-light border-top">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-semibold mb-2">
                    <i className="bi bi-info-circle me-2"></i>
                    Información Importante
                  </h6>
                  <ul className="list-unstyled small text-muted">
                    <li><i className="bi bi-check-circle text-success me-2"></i> Tu justificación será revisada por coordinación</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i> Recibirás una notificación cuando sea procesada</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i> Los archivos se almacenan de forma segura</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-semibold mb-2">
                    <i className="bi bi-clock-history me-2"></i>
                    Tiempo de Respuesta
                  </h6>
                  <p className="small text-muted mb-0">
                    Las justificaciones suelen ser procesadas en un plazo de 24 a 48 horas hábiles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón para ver justificaciones enviadas */}
      {setSeccionActiva && (
        <div className="row mt-4">
          <div className="col">
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-outline-primary"
                onClick={() => setSeccionActiva("Ver Justificaciones")}
              >
                <i className="bi bi-list-check me-2"></i>
                Ver Justificaciones Enviadas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EnviarJustificacion.propTypes = {
  setSeccionActiva: PropTypes.func,
  estudianteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default EnviarJustificacion;