import React, { useState, useEffect, useCallback } from "react";
import ModalMensaje from "../ui/ModalMensaje.jsx";
import "./RegistrarAsistenciaMasiva.css";

const RegistrarAsistenciaMasiva = ({ idProfesor }) => {
  const [grados, setGrados] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    tipo: "info",
    titulo: "",
    mensaje: "",
    onConfirm: null
  });

  const [form, setForm] = useState({
    id_grado: "",
    fecha: new Date().toISOString().split('T')[0],
    asistencias: [],
  });

  // Mostrar modal
  const mostrarModal = (tipo, titulo, mensaje, onConfirm = null) => {
    setModal({
      visible: true,
      tipo,
      titulo,
      mensaje,
      onConfirm
    });
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModal({ ...modal, visible: false });
  };

  // Fetch grados con manejo de errores
  const fetchGrados = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/profesor/${idProfesor}/grados`);
      if (!res.ok) throw new Error("Error al cargar grados");
      const data = await res.json();
      setGrados(data.data || []);
    } catch (err) {
      console.error(err);
      mostrarModal("error", "Error", "No se pudieron cargar los grados");
    }
  }, [idProfesor]);

  // Fetch estados
  const fetchEstados = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/coordinador/estadoAsistencia");
      if (!res.ok) throw new Error("Error al cargar estados");
      const data = await res.json();
      setEstados(data);
    } catch (err) {
      console.error(err);
      mostrarModal("error", "Error", "No se pudieron cargar los estados de asistencia");
    }
  }, []);

  useEffect(() => {
    fetchGrados();
    fetchEstados();
  }, [fetchGrados, fetchEstados]);

  // Manejar cambio de grado
  const handleGradoChange = async (e) => {
    const id_grado = e.target.value;
    setForm({ ...form, id_grado, asistencias: [] });

    if (!id_grado) {
      setEstudiantes([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/profesor/${idProfesor}/estudiantes/${id_grado}`
      );
      if (!res.ok) throw new Error("Error al cargar estudiantes");
      const data = await res.json();
      const estudiantesData = data.data || [];
      setEstudiantes(estudiantesData);

      // Inicializar asistencias con estado por defecto (1 = Presente)
      setForm(prev => ({
        ...prev,
        asistencias: estudiantesData.map((e) => ({
          id_estudiante: e.id_estudiante,
          id_estado_asistencia: "1", // Presente por defecto
          observacion: "",
        })),
      }));
    } catch (err) {
      console.error(err);
      setEstudiantes([]);
      mostrarModal("error", "Error", "No se pudieron cargar los estudiantes del grado seleccionado");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio en asistencia individual
  const handleAsistenciaChange = (index, field, value) => {
    const nuevasAsistencias = [...form.asistencias];
    nuevasAsistencias[index][field] = value;
    setForm({ ...form, asistencias: nuevasAsistencias });
  };

  // Validar formulario antes de enviar
  const validarFormulario = () => {
    if (!form.id_grado || !form.fecha) {
      mostrarModal("error", "Campos requeridos", "Debes seleccionar un grado y una fecha");
      return false;
    }

    if (form.asistencias.length === 0) {
      mostrarModal("error", "Sin estudiantes", "No hay estudiantes para registrar asistencia");
      return false;
    }

    // Verificar que todas las asistencias tengan estado
    const asistenciasIncompletas = form.asistencias.filter(a => !a.id_estado_asistencia);
    if (asistenciasIncompletas.length > 0) {
      mostrarModal("error", "Asistencias incompletas", "Todos los estudiantes deben tener un estado de asistencia");
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    // Mostrar confirmación
    mostrarModal(
      "confirmacion",
      "Confirmar registro",
      `¿Estás seguro de registrar la asistencia para ${estudiantes.length} estudiantes?`,
      confirmarRegistro
    );
  };

  // Confirmar y ejecutar el registro
  const confirmarRegistro = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/profesor/asistencias/registro-masivo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_funcionario: idProfesor,
          id_grado: form.id_grado,
          fecha: form.fecha,
          asistencias: form.asistencias,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        mostrarModal("exito", "¡Éxito!", data.mensaje || "Asistencias registradas correctamente");
        // Limpiar formulario después de éxito
        setForm({
          id_grado: form.id_grado, // Mantener el grado seleccionado
          fecha: new Date().toISOString().split('T')[0],
          asistencias: form.asistencias.map(a => ({ ...a, observacion: "" })) // Limpiar solo observaciones
        });
      } else {
        throw new Error(data.mensaje || "Error en el servidor");
      }
    } catch (err) {
      console.error(err);
      mostrarModal("error", "Error", err.message || "Error registrando asistencias masivas");
    } finally {
      setLoading(false);
      cerrarModal();
    }
  };

  // Aplicar estado a todos los estudiantes
  const aplicarEstadoATodos = (id_estado) => {
    const nuevasAsistencias = form.asistencias.map(a => ({
      ...a,
      id_estado_asistencia: id_estado
    }));
    setForm({ ...form, asistencias: nuevasAsistencias });
  };

  return (
    <div className="registrar-asistencia-container">
      <h2>📋 Registrar Asistencia Masiva</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Grado:</label>
            <select
              className="form-select azul-select"
              value={form.id_grado}
              onChange={handleGradoChange}
              required
              disabled={loading}
            >
              <option value="">Selecciona un grado</option>
              {grados.map((g) => (
                <option key={g.id_grado} value={g.id_grado}>
                  {g.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              className="form-control azul-select"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              required
              disabled={loading}
            />
          </div>
        </div>

        {loading && <div className="loading">Cargando estudiantes...</div>}

        {estudiantes.length > 0 && (
          <>
            <div className="acciones-rapidas">
              <label>Aplicar a todos:</label>
              <div className="botones-rapidos">
                {estados.slice(0, 3).map(estado => (
                  <button
                    key={estado.id_estado_asistencia}
                    type="button"
                    className="btn-rapido"
                    onClick={() => aplicarEstadoATodos(estado.id_estado_asistencia.toString())}
                  >
                    {estado.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-primary">
                  <tr>
                    <th>Estudiante</th>
                    <th>Estado</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((est, index) => (
                    <tr key={est.id_estudiante}>
                      <td>
                        <strong>{est.persona?.nombre} {est.persona?.apellido}</strong>
                        <br />
                        <small>Doc: {est.persona?.numero_documento}</small>
                      </td>
                      <td>
                        <select
                          className="form-select azul-select"
                          value={form.asistencias[index]?.id_estado_asistencia || ""}
                          onChange={(e) =>
                            handleAsistenciaChange(index, "id_estado_asistencia", e.target.value)
                          }
                          required
                          disabled={loading}
                        >
                          <option value="">Selecciona estado</option>
                          {estados.map((es) => (
                            <option key={es.id_estado_asistencia} value={es.id_estado_asistencia}>
                              {es.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Observación opcional"
                          value={form.asistencias[index]?.observacion || ""}
                          onChange={(e) =>
                            handleAsistenciaChange(index, "observacion", e.target.value)
                          }
                          disabled={loading}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="resumen-acciones">
              <p><strong>Total estudiantes:</strong> {estudiantes.length}</p>
              <button 
                type="submit" 
                className="btn-azul btn-grande"
                disabled={loading}
              >
                {loading ? "Guardando..." : "💾 Guardar Asistencias Masivas"}
              </button>
            </div>
          </>
        )}

        {form.id_grado && estudiantes.length === 0 && !loading && (
          <div className="sin-estudiantes">
            No hay estudiantes asignados a este grado
          </div>
        )}
      </form>

      <ModalMensaje
        visible={modal.visible}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensaje={modal.mensaje}
        onClose={cerrarModal}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default RegistrarAsistenciaMasiva;