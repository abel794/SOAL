// src/componentes/EnviarPQR.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

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

  // URLs del backend
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

  // Traer estudiantes asignados al acudiente logueado
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

        console.log("Estudiantes raw:", res.data);

        // Tomamos directamente res.data.estudiantes
        const estudiantesRaw = Array.isArray(res.data.estudiantes) ? res.data.estudiantes : [];

        const estudiantesMapeados = estudiantesRaw.map((e) => ({
          id: e.id_estudiante,
          nombre: `${e.nombre} ${e.apellido}`,
          observaciones: e.observaciones,
          asistencias: e.asistencias,
          fechasAsistencias: e.fechasAsistencias,
          raw: e,
        }));

        if (!mounted) return;

        setEstudiantes(estudiantesMapeados);
        if (estudiantesMapeados.length === 0) setError("No se encontraron estudiantes asignados.");
        else setError("");
      } catch (err) {
        console.error("Error al obtener estudiantes:", err.response?.data ?? err.message);
        if (!mounted) return;
        setError("No se pudieron cargar los estudiantes.");
        setEstudiantes([]);
      } finally {
        if (mounted) setLoadingEstudiantes(false);
      }
    };

    fetchEstudiantes();
    return () => { mounted = false; };
  }, []);

  // Envío con confirmación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (!validarFormulario()) return;

    const estudianteSeleccionado = estudiantes.find(
      (s) => String(s.id) === String(form.id_estudiante)
    );

    const resumenHtml = `
      <p><strong>Estudiante:</strong> ${estudianteSeleccionado ? estudianteSeleccionado.nombre : form.id_estudiante}</p>
      <p><strong>Tipo:</strong> ${tiposPQR.find(t => String(t.id) === String(form.id_tipo_pqr))?.nombre ?? form.id_tipo_pqr}</p>
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
    });

    if (!conf.isConfirmed) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró token. Inicia sesión nuevamente.");

      const nuevaPQR = {
        id_estudiante: Number(form.id_estudiante),
        id_tipo_pqr: Number(form.id_tipo_pqr),
        descripcion: form.descripcion,
        fecha: form.fecha,
        id_estado_pqr,
      };

      console.log("Enviando PQR payload:", nuevaPQR);

      const res = await axios.post(PQR_POST_URL, nuevaPQR, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("PQR creada:", res.data);
      setMensaje("PQR enviada correctamente");
      setForm({ id_estudiante: "", id_tipo_pqr: "", descripcion: "", fecha: "" });
      setError("");

      Swal.fire({
        icon: "success",
        title: "✅ Enviada",
        text: "La PQR fue enviada correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al crear PQR:", err.response?.data ?? err.message);
      const serverMsg =
        err.response?.data?.mensaje ||
        err.response?.data?.error ||
        err.response?.data?.detalle ||
        err.message;
      setError(serverMsg || "Error al enviar la PQR");
      Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: serverMsg || "No se pudo enviar la PQR",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h3>Enviar PQR</h3>

      {loadingEstudiantes && <div>Cargando estudiantes...</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="id_estudiante" className="form-label">Estudiante</label>
          <select
            id="id_estudiante"
            name="id_estudiante"
            value={form.id_estudiante}
            onChange={handleChange}
            className="form-select"
            disabled={loadingEstudiantes || estudiantes.length === 0}
          >
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map((est) => (
              <option key={est.id} value={est.id}>
                {est.nombre} - {est.fechasAsistencias.length} asistencias - {est.observaciones} observaciones
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="id_tipo_pqr" className="form-label">Tipo de PQR</label>
          <select
            id="id_tipo_pqr"
            name="id_tipo_pqr"
            value={form.id_tipo_pqr}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Seleccione tipo de PQR</option>
            {tiposPQR.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="form-control"
            rows="4"
            placeholder="Describe tu petición, queja o reclamo"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">Fecha</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {mensaje && <div className="alert alert-success">{mensaje}</div>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar PQR"}
        </button>
      </form>
    </div>
  );
};

export default EnviarPQR;
