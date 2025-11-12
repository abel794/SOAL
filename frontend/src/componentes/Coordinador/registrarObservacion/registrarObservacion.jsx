import React, { useState, useEffect } from "react";
import "./RegistrarObservacion.css";
import ModalMensaje from "../../ui/ModalMensaje";

function RegistrarObservacion() {
  const [nombreBuscado, setNombreBuscado] = useState("");
  const [estudiante, setEstudiante] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [observacion, setObservacion] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [idCategoria, setIdCategoria] = useState("");
  const [gravedadesOptions, setGravedadesOptions] = useState([]);
  const [gravedad, setGravedad] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);

  const token = localStorage.getItem("token");

  const ejecutarAccion = () => {
  console.log("Acción confirmada desde RegistrarObservacion");
  // Aquí va lo que realmente quieres hacer cuando se confirme
};


  // 📂 Cargar categorías al montar (soporta response array o { categorias: [...] })
  useEffect(() => {
    const fetchCategorias = async () => {
      if (!token) return setMensaje({ tipo: "error", texto: "No hay token. Inicia sesión nuevamente." });

      try {
        const res = await fetch("http://localhost:3000/api/coordinador/categoria_observacion", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) throw new Error("Token inválido o expirado.");
        const data = await res.json();
        const lista = Array.isArray(data) ? data : (data.categorias || []);
        setCategorias(lista);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setMensaje({ tipo: "error", texto: "⚠️ No se pudieron cargar las categorías." });
      }
    };

    fetchCategorias();
  }, [token]);

  // 📂 Cargar gravedades al montar (soporta response array o { gravedades: [...] })
  useEffect(() => {
    const fetchGravedades = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/coordinador/gravedadObservacion", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const lista = Array.isArray(data) ? data : (data.gravedades || []);
        setGravedadesOptions(lista);

        if (lista.length > 0) {
          // Aseguramos que el estado gravedad sea numérico (id_gravedad)
          setGravedad(Number(lista[0].id_gravedad));
        }

        console.log("Gravedades cargadas:", lista);
      } catch (err) {
        console.error("Error al cargar gravedades:", err);
        setMensaje({ tipo: "error", texto: "⚠️ No se pudieron cargar las gravedades." });
      }
    };

    fetchGravedades();
  }, [token]);

  // 🔍 Buscar estudiante
  const manejarBusqueda = async () => {
    if (!token) return setMensaje({ tipo: "error", texto: "❌ No hay token. Inicia sesión nuevamente." });
    if (!nombreBuscado.trim()) return setMensaje({ tipo: "error", texto: "Escribe algo para buscar." });

    setCargando(true);
    try {
      const url = `http://localhost:3000/api/coordinador/estudiante/buscar?filtro=${encodeURIComponent(nombreBuscado)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

      if (res.status === 401) throw new Error("Token inválido o expirado.");
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setEstudiante(data[0]);
        setMensaje({ tipo: "exito", texto: `✅ Estudiante encontrado: ${data[0].persona?.nombre || data[0].nombre}` });
      } else {
        setEstudiante(null);
        setMensaje({ tipo: "error", texto: "Estudiante no encontrado." });
      }
    } catch (error) {
      console.error("Error buscar estudiante:", error);
      setMensaje({ tipo: "error", texto: "⚠️ Error al conectar con el servidor." });
    } finally {
      setCargando(false);
    }
  };

  // ⏳ Ocultar mensaje automático
  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(() => setMensaje(null), 3500);
    return () => clearTimeout(timer);
  }, [mensaje]);

  // 🧾 Mostrar modal de confirmación
  const manejarRegistro = (e) => {
    e.preventDefault();
    if (!estudiante || !idCategoria || !gravedad || observacion.trim() === "")
      return setMensaje({ tipo: "error", texto: "⚠️ Completa todos los campos." });

    setShowConfirmModal(true);
  };

  // ✅ Confirmar registro real
  const confirmarRegistro = async () => {
    setShowConfirmModal(false);
    setCargando(true);

    try {
      const payload = {
        id_estudiante: estudiante.id_estudiante,
        id_categoria: idCategoria,
        descripcion: observacion,
        id_gravedad: Number(gravedad),
        fecha: new Date().toISOString().slice(0, 10),
      };

      const res = await fetch("http://localhost:3000/api/coordinador/observaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ tipo: "exito", texto: `✅ Observación registrada para ${estudiante.persona?.nombre || estudiante.nombre}` });
        setObservacion("");
        setIdCategoria("");
        if (gravedadesOptions.length > 0) setGravedad(Number(gravedadesOptions[0].id_gravedad));
      } else {
        console.error("Error registrar observación:", data);
        setMensaje({ tipo: "error", texto: `❌ ${data.error || "Error al registrar."}` });
      }
    } catch (error) {
      console.error("Error de conexión al registrar:", error);
      setMensaje({ tipo: "error", texto: "❌ Error de conexión al servidor." });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-observacion-container">
      <h1>Registro de Observaciones</h1>
      <h3>Instituto Renato Descartes</h3>
      <div className="linea"></div>

      {/* 🔍 Buscador */}
      <div className="busqueda-estudiante">
        <input
          type="text"
          placeholder="Buscar estudiante por nombre o documento"
          value={nombreBuscado}
          onChange={(e) => setNombreBuscado(e.target.value)}
        />
        <button onClick={manejarBusqueda} disabled={cargando}>
          {cargando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* 💬 Mensaje de estado */}
      {mensaje && (
        <div className={`mensaje-card mensaje-${mensaje.tipo}`}>
          <p className="mensaje-texto">{mensaje.texto}</p>
        </div>
      )}

      {/* 🧾 Formulario */}
      {estudiante && (
        <form onSubmit={manejarRegistro} className="formulario-observacion">
          <p><strong>Estudiante:</strong> {estudiante.persona?.nombre ?? estudiante.nombre}</p>

          <label>Categoría:</label>
          <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)}>
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <label>Gravedad:</label>
          <select value={gravedad} onChange={(e) => setGravedad(Number(e.target.value))}>
            <option value="">Seleccione una gravedad</option>
            {gravedadesOptions.map(g => (
              <option key={g.id_gravedad} value={g.id_gravedad}>
                {g.nombre}
              </option>
            ))}
          </select>

          <label>Observación:</label>
          <div className="textarea-container">
            <textarea
              placeholder="Escribe la observación..."
              value={observacion}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setObservacion(e.target.value);
                }
              }}
              required
            />
            <small
              style={{
                display: "block",
                textAlign: "right",
                color: observacion.length >= 100 ? "red" : "#555",
              }}
            >
              {observacion.length}/100 caracteres
            </small>
          </div>
          <button type="submit" className="btn-principal" disabled={cargando}>
            {cargando ? "Registrando..." : "Registrar observación"}
          </button>
        </form>
      )}

      {/* ⚙️ Modal de confirmación */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>¿Registrar observación?</h4>
            <p>Una vez registrada, quedará guardada en el historial del estudiante.</p>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
              <button className="btn-confirmar" onClick={confirmarRegistro}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
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
        tipo={mensaje?.tipo || "info"}
        titulo="Notificación"
        mensaje={mensaje?.texto || ""}
        onClose={() => {
          setMensaje(null);
          setUsuarioGenerado(null);
        }}
      />
          </div>
  );
}

export default RegistrarObservacion;
