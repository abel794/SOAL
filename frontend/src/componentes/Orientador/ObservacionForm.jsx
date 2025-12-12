import React, { useState, useEffect, useCallback } from "react";
import ModalMensaje from "../ui/ModalMensaje.jsx";
import "./ObservacionForm.css";

const ObservacionForm = ({ estudiante, idProfesor, onVolver }) => {
  const [categorias, setCategorias] = useState([]);
  const [gravedad, setGravedad] = useState("Leve");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    tipo: "info",
    titulo: "",
    mensaje: "",
    onConfirm: null
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

  // Fetch categorías
  const fetchCategorias = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categorias`);
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data = await res.json();
      setCategorias(data.categorias || []);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      mostrarModal("error", "Error", "No se pudieron cargar las categorías de observaciones");
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  // Validar formulario
  const validarFormulario = () => {
    if (!categoria) {
      mostrarModal("error", "Campo requerido", "Debes seleccionar una categoría");
      return false;
    }

    if (!descripcion.trim()) {
      mostrarModal("error", "Campo requerido", "La descripción es obligatoria");
      return false;
    }

    if (descripcion.trim().length < 10) {
      mostrarModal("error", "Descripción muy corta", "La descripción debe tener al menos 10 caracteres");
      return false;
    }

    if (descripcion.trim().length > 500) {
      mostrarModal("error", "Descripción muy larga", "La descripción no puede exceder los 500 caracteres");
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    // Mostrar confirmación
    mostrarModal(
      "confirmacion",
      "Confirmar Observación",
      `¿Estás seguro de registrar esta observación para ${estudiante.persona.nombre} ${estudiante.persona.apellido}?\n\nCategoría: ${categorias.find(c => c.id_categoria === parseInt(categoria))?.nombre}\nGravedad: ${gravedad}`,
      confirmarRegistro
    );
  };

  // Confirmar y ejecutar el registro
  const confirmarRegistro = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/profesor/observaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_estudiante: estudiante.id_estudiante,
          id_categoria: parseInt(categoria),
          id_gravedad: gravedad === "Leve" ? 1 : gravedad === "Moderado" ? 2 : 3,
          id_funcionario: idProfesor,
          descripcion: descripcion.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        mostrarModal(
          "exito", 
          "¡Observación Registrada!", 
          "La observación se ha registrado correctamente en el sistema."
        );
        
        // Limpiar formulario después de éxito
        setCategoria("");
        setDescripcion("");
        setGravedad("Leve");
        
        // Cerrar modal automáticamente después de 3 segundos
        setTimeout(() => {
          cerrarModal();
          if (onVolver) onVolver();
        }, 3000);
      } else {
        throw new Error(data.mensaje || "Error en el servidor");
      }
    } catch (err) {
      console.error("Error registrando observación:", err);
      mostrarModal("error", "Error", err.message || "Error al registrar la observación");
    } finally {
      setLoading(false);
    }
  };

  // Manejar volver
  const handleVolver = () => {
    if (categoria || descripcion) {
      mostrarModal(
        "confirmacion",
        "¿Descartar cambios?",
        "Tienes cambios sin guardar. ¿Estás seguro de que quieres volver?",
        () => onVolver && onVolver()
      );
    } else {
      onVolver && onVolver();
    }
  };

  // Contador de caracteres
  const caracteresRestantes = 500 - descripcion.length;

  return (
    <div className="observaciones-container">
      <div className="observaciones-header">
        <button className="btn-volver" onClick={handleVolver}>
          ← Volver
        </button>
        <h2>📝 Registrar Observación</h2>
      </div>

      <div className="linea"></div>

      {/* Información del estudiante */}
      <div className="estudiante-info-card">
        <h3>Estudiante Seleccionado</h3>
        <div className="estudiante-datos">
          <p><strong>Nombre:</strong> {estudiante.persona.nombre} {estudiante.persona.apellido}</p>
          <p><strong>Documento:</strong> {estudiante.persona.numero_documento}</p>
          <p><strong>Grado:</strong> {estudiante.grado}</p>
          <p><strong>Ciudad:</strong> {estudiante.persona.ciudad_residencia}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="observacion-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoria">Categoría *</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="form-select"
              required
              disabled={loading}
            >
              <option value="">-- Selecciona una categoría --</option>
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gravedad">Nivel de Gravedad *</label>
            <select
              id="gravedad"
              value={gravedad}
              onChange={(e) => setGravedad(e.target.value)}
              className="form-select"
              required
              disabled={loading}
            >
              <option value="Leve">🟢 Leve</option>
              <option value="Moderado">🟡 Moderado</option>
              <option value="Grave">🔴 Grave</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">
            Descripción de la Observación *
            <span className="caracteres-contador">
              {caracteresRestantes} caracteres restantes
            </span>
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={6}
            placeholder="Describe detalladamente la observación del estudiante..."
            className="form-control descripcion-textarea"
            required
            disabled={loading}
            maxLength={500}
          />
          <div className={`contador-advertencia ${caracteresRestantes < 50 ? 'advertencia' : ''} ${caracteresRestantes < 10 ? 'peligro' : ''}`}>
            {caracteresRestantes < 50 && `⚠️ Quedan ${caracteresRestantes} caracteres`}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secundario"
            onClick={handleVolver}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primario"
            disabled={loading || !categoria || !descripcion.trim()}
          >
            {loading ? "⏳ Registrando..." : "📋 Registrar Observación"}
          </button>
        </div>
      </form>

      {/* Información de ayuda */}
      <div className="info-ayuda">
        <h4>📋 Guía para Observaciones</h4>
        <div className="tips-grid">
          <div className="tip-card">
            <strong>🟢 Leve</strong>
            <p>Llamados de atención menores, comportamiento inapropiado ocasional</p>
          </div>
          <div className="tip-card">
            <strong>🟡 Moderado</strong>
            <p>Incumplimiento repetitivo, afectación al grupo, falta de respeto</p>
          </div>
          <div className="tip-card">
            <strong>🔴 Grave</strong>
            <p>Situaciones críticas, agresiones, faltas graves al manual</p>
          </div>
        </div>
      </div>

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

export default ObservacionForm;