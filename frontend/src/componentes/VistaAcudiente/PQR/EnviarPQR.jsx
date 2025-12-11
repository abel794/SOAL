// EnviarPQR.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";
import "./EnviarPQR.css";

const EnviarPQR = () => {
  const [form, setForm] = useState({
    id_estudiante: "",
    id_tipo_pqr: "",
    descripcion: "",
    fecha: "",
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const tiposPQR = [
    { id: 1, nombre: "Petición" },
    { id: 2, nombre: "Queja" },
    { id: 3, nombre: "Reclamo" },
  ];

  const id_estado_pqr = 1;

  const STUDENTS_URL = "http://localhost:3000/api/acudientes/informacion/estudiantes";
  const PQR_POST_URL = "http://localhost:3000/api/acudientes/pqr";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.id_estudiante || !form.id_tipo_pqr || !form.descripcion || !form.fecha) {
      setError("Todos los campos son obligatorios");
      return false;
    }
    setError("");
    return true;
  };

  useEffect(() => {
    let mounted = true;

    const fetchEstudiantes = async () => {
      setLoadingEstudiantes(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No se encontró token. Inicia sesión nuevamente.");

        const res = await axios.get(STUDENTS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = Array.isArray(res.data.estudiantes) ? res.data.estudiantes : [];

        const estudiantesFormateados = raw.map((e) => ({
          id: e.id_estudiante,
          nombre: `${e.nombre} ${e.apellido}`,
          observaciones: e.observaciones,
          asistencias: e.asistencias,
          fechasAsistencias: e.fechasAsistencias || [],
        }));

        if (!mounted) return;

        setEstudiantes(estudiantesFormateados);
        if (estudiantesFormateados.length === 0) {
          setError("No se encontraron estudiantes asignados.");
        } else {
          setError("");
        }
      } catch (err) {
        console.error("Error al obtener estudiantes:", err);
        if (mounted) {
          setError("No se pudieron cargar los estudiantes.");
          setEstudiantes([]);
        }
      } finally {
        if (mounted) setLoadingEstudiantes(false);
      }
    };

    fetchEstudiantes();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!validarFormulario()) return;

    const estudiante = estudiantes.find(
      (s) => String(s.id) === String(form.id_estudiante)
    );

    const resumenHtml = `
      <p><strong>Estudiante:</strong> ${estudiante?.nombre || "-"}</p>
      <p><strong>Tipo:</strong> ${tiposPQR.find(t => t.id == form.id_tipo_pqr)?.nombre || "-"}</p>
      <p><strong>Fecha:</strong> ${form.fecha}</p>
      <p><strong>Descripción:</strong> ${form.descripcion}</p>
    `;

    const conf = await Swal.fire({
      title: "Confirmar envío",
      html: resumenHtml,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Enviar PQR",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#d33",
      customClass: {
        popup: "pqr-swal-popup",
        confirmButton: "pqr-swal-confirm",
        cancelButton: "pqr-swal-cancel",
        title: "pqr-swal-title",
      },
    });

    if (!conf.isConfirmed) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const payload = {
        id_estudiante: Number(form.id_estudiante),
        id_tipo_pqr: Number(form.id_tipo_pqr),
        descripcion: form.descripcion,
        fecha: form.fecha,
        id_estado_pqr,
      };

      await axios.post(PQR_POST_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensaje("PQR enviada correctamente");
      setForm({ id_estudiante: "", id_tipo_pqr: "", descripcion: "", fecha: "" });
      setError("");

      Swal.fire({
        icon: "success",
        title: "Enviada",
        text: "La PQR fue enviada correctamente.",
        timer: 1800,
        showConfirmButton: false,
        customClass: { popup: "pqr-swal-popup" },
      });
    } catch (err) {
      console.error("Error al enviar PQR:", err);
      const mensajeServidor =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        err.response?.data?.detalle ||
        "Ocurrió un error al enviar la PQR";

      setError(mensajeServidor);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensajeServidor,
        customClass: { popup: "pqr-swal-popup" },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="pqr-wrapper">
        <div className="card pqr-card shadow-lg border-0 rounded-4 animate__animated animate__fadeIn">
          <div className="card-header pqr-header bg-primary text-white d-flex align-items-center gap-2">
            <i className="bi bi-envelope-paper-fill fs-5"></i>
            <h4 className="mb-0">Enviar PQR</h4>
          </div>

          <div className="card-body">
            {loadingEstudiantes && (
              <div className="d-flex justify-content-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="row g-4">
              {/* Columna izquierda */}
              <div className="col-12 col-md-6">
                {/* Estudiante */}
                <div className="mb-3">
                  <label className="form-label">Estudiante</label>
                  <select
                    name="id_estudiante"
                    value={form.id_estudiante}
                    onChange={handleChange}
                    className={`form-select pqr-input ${error && !form.id_estudiante ? "is-invalid" : ""}`}
                    disabled={loadingEstudiantes || estudiantes.length === 0}
                  >
                    <option value="">Seleccione un estudiante</option>
                    {estudiantes.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.nombre} — {est.fechasAsistencias.length} asistencias — {est.observaciones} observaciones
                      </option>
                    ))}
                  </select>
                  {error && !form.id_estudiante && (
                    <div className="invalid-feedback">Seleccione un estudiante</div>
                  )}
                </div>

                {/* Tipo PQR */}
                <div className="mb-3">
                  <label className="form-label">Tipo de PQR</label>
                  <select
                    name="id_tipo_pqr"
                    value={form.id_tipo_pqr}
                    onChange={handleChange}
                    className={`form-select pqr-input ${error && !form.id_tipo_pqr ? "is-invalid" : ""}`}
                  >
                    <option value="">Seleccione tipo de PQR</option>
                    {tiposPQR.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  {error && !form.id_tipo_pqr && (
                    <div className="invalid-feedback">Seleccione un tipo de PQR</div>
                  )}
                </div>

                {/* Fecha */}
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    className={`form-control pqr-input ${error && !form.fecha ? "is-invalid" : ""}`}
                    id="fechaInput"
                  />
                  <label htmlFor="fechaInput">Fecha</label>
                  {error && !form.fecha && (
                    <div className="invalid-feedback">Seleccione una fecha</div>
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="col-12 col-md-6">
                {/* Descripción */}
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className={`form-control pqr-input pqr-textarea ${error && !form.descripcion ? "is-invalid" : ""}`}
                    rows="6"
                    placeholder="Describe tu petición, queja o reclamo con claridad y respeto"
                  ></textarea>
                  {error && !form.descripcion && (
                    <div className="invalid-feedback">La descripción es obligatoria</div>
                  )}
                </div>
              </div>

              {/* Mensajes globales */}
              <div className="col-12">
                {error && <div className="alert alert-danger pqr-alert animate__animated animate__fadeIn">{error}</div>}
                {mensaje && (
                  <div className="alert alert-success pqr-alert animate__animated animate__fadeIn">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {mensaje}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary pqr-btn"
                  onClick={() => {
                    setForm({ id_estudiante: "", id_tipo_pqr: "", descripcion: "", fecha: "" });
                    setError("");
                    setMensaje("");
                  }}
                  disabled={submitting}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Limpiar
                </button>

                <button className="btn btn-primary pqr-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-1"></i>
                      Enviar PQR
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="card-footer pqr-footer d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Gracias por comunicarte. Tu voz ayuda a mejorar el proceso.
            </small>
            <span className="badge bg-light text-dark pqr-badge">
              <i className="bi bi-shield-check me-1"></i> Envío seguro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnviarPQR;
