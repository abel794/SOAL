import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./RegistroProfesor.css";
import { FaShieldAlt } from "react-icons/fa";

export default function RegistroProfesorMultistep() {
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [aceptaTratamiento, setAceptaTratamiento] = useState(false);
  const [loading, setLoading] = useState(false);

  const [catalogos, setCatalogos] = useState({
    sexos: [],
    tiposDocumento: [],
    tiposUsuario: [],
  });

  const [persona, setPersona] = useState({
    numero_documento: "",
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad_residencia: "",
    tipo_sangre: "",
    discapacidad: "No",
    ocupacion: "",
    id_sexo: "",
    id_tipo_documento: "",
    fecha_nacimiento: "",
    foto: null,
  });

  const [usuario, setUsuario] = useState({
    username: "",
    contrasena: "",
    id_tipo_usuario: 3, // Profesor
  });

  const [funcionario, setFuncionario] = useState({
    cargo: "",
    arl: "",
  });

  const [archivos, setArchivos] = useState({
    eps: null,
    arl: null,
    hoja_vida: null,
    acta_grado: null,
    rut: null,
  });

  const fotoRef = useRef(null);

  // fetch catálogos básicos
  useEffect(() => {
    let mounted = true;
    const fetchCatalogos = async () => {
      try {
        const [sexosRes, tiposRes, tiposUsuarioRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/sexo`),
          fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/tipoDocumento`),
          fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/TipoUsuario`),
        ]);

        const sexos = sexosRes.ok ? await sexosRes.json() : [];
        const tiposDocumento = tiposRes.ok ? await tiposRes.json() : [];
        const tiposUsuario = tiposUsuarioRes.ok ? await tiposUsuarioRes.json() : [];

        if (mounted) setCatalogos({ sexos, tiposDocumento, tiposUsuario });
      } catch (err) {
        console.error("Error cargando catálogos:", err);
        // no romper la UI, mostrar mensaje leve
        if (mounted) setMensaje("⚠️ Error cargando catálogos — revisa la consola");
        setTimeout(() => setMensaje(""), 5000);
      }
    };
    fetchCatalogos();
    return () => { mounted = false; };
  }, []);

  // Handler robusto para persona (text/select/file)
  const handlePersona = (e) => {
    const name = e.target.name;
    const type = e.target.type;

    if (type === "file") {
      setPersona((prev) => ({ ...prev, [name]: e.target.files?.[0] || null }));
      return;
    }

    const raw = e.target.value;
    const valor = ["id_sexo", "id_tipo_documento"].includes(name)
      ? (raw === "" ? "" : Number(raw))
      : raw;
    setPersona((prev) => ({ ...prev, [name]: valor }));
  };

  const handleUsuario = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleFuncionario = (e) => {
    const { name, value } = e.target;
    setFuncionario((prev) => ({ ...prev, [name]: value }));
  };

  const handleArchivos = (e) => {
    const { name, files } = e.target;
    setArchivos((prev) => ({ ...prev, [name]: files?.[0] || null }));
  };

  // Validación con lista de faltantes explícita
  const validarPaso = () => {
    if (step === 1) {
      const required = [
        "numero_documento",
        "nombre",
        "apellido",
        "correo",
        "telefono",
        "direccion",
        "ciudad_residencia",
        "tipo_sangre",
        "ocupacion",
        "fecha_nacimiento",
        "id_sexo",
        "id_tipo_documento",
        "foto",
      ];
      const missing = required.filter((k) => {
        const v = persona[k];
        // consideramos file válido si no es null
        if (k === "foto") return !v;
        return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
      });

      if (missing.length > 0) {
        setMensaje(`❌ Faltan campos: ${missing.join(", ")}`);
        // focus al primer campo si existe
        const first = document.querySelector(`[name="${missing[0]}"]`);
        if (first) first.focus();
        return false;
      }

      if (!aceptaTratamiento) {
        setMensaje("❌ Debes aceptar el tratamiento de datos personales");
        return false;
      }
    }

    if (step === 2) {
      const missing = [];
      if (!usuario.username) missing.push("username");
      if (!usuario.contrasena) missing.push("contrasena");
      if (!funcionario.cargo) missing.push("cargo");
      if (!funcionario.arl) missing.push("arl");
      if (missing.length) {
        setMensaje(`❌ Faltan campos académicos: ${missing.join(", ")}`);
        const first = document.querySelector(`[name="${missing[0]}"]`);
        if (first) first.focus();
        return false;
      }
    }

    setMensaje("");
    return true;
  };

  const avanzar = () => {
    if (validarPaso()) {
      if (step < 3) setStep((s) => s + 1);
    }
  };

  const retroceder = () => {
    if (!loading) setStep((s) => Math.max(1, s - 1));
  };

  const confirmarRegistro = (e) => {
    e.preventDefault();
    if (validarPaso()) setShowConfirmModal(true);
  };

  // Envío final
  const handleSubmit = async () => {
    if (loading) return;
    setShowConfirmModal(false);
    setLoading(true);
    setMensaje("");

    try {
      const f = new FormData();
      f.append("persona", JSON.stringify({
        ...persona,
        // no serializar foto como string
        foto: undefined,
      }));
      f.append("usuario", JSON.stringify(usuario));
      f.append("funcionario", JSON.stringify(funcionario));
      if (persona.foto) f.append("foto", persona.foto);
      for (const [k, file] of Object.entries(archivos)) {
        if (file) f.append(`archivo_${k}`, file);
      }

      const token = localStorage.getItem("token") || "";
      const url = `${process.env.REACT_APP_API_URL}/api/coordinador/registrarFuncionario`; // ruta correcta

      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        body: f,
      });

      // parseo seguro
      let data;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) data = await res.json();
      else {
        const text = await res.text();
        try { data = JSON.parse(text); } catch { data = { mensaje: text }; }
      }

      if (res.ok) {
        setUsuarioGenerado(data.usuario ?? data.user ?? null);
        setMensaje(data.mensaje ?? "✅ Profesor registrado con éxito");
        // limpiar formulario o avanzar a pantalla final
        setStep(4);
      } else {
        setMensaje(data.mensaje || `❌ Error ${res.status}`);
      }
    } catch (err) {
      console.error("handleSubmit error:", err);
      setMensaje("❌ Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // small loader overlay inside component
  const LoaderOverlay = () =>
    loading ? (
      <div className="loader-overlay" aria-live="polite">
        <div className="loader-box">
          <div className="spinner" />
          <div style={{ marginTop: 12 }}>Procesando... por favor espera</div>
        </div>
      </div>
    ) : null;

  return (
    <div className="profesor-formulario">
      <h2>Registro de Profesor</h2>

      <div className="pasos">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`paso ${step === n ? "activo" : ""}`}>{n}</div>
        ))}
      </div>

      <form onSubmit={confirmarRegistro}>
        <AnimatePresence mode="wait">
          {/* Paso 1 */}
          {step === 1 && (
            <motion.div key="paso1" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Datos Personales</h3>

              {/* inputs text */}
              {[
                ["numero_documento", "Documento"],
                ["nombre", "Nombre"],
                ["apellido", "Apellido"],
                ["correo", "Correo"],
                ["telefono", "Teléfono"],
                ["direccion", "Dirección"],
                ["ciudad_residencia", "Ciudad"],
                ["tipo_sangre", "Tipo Sangre"],
                ["discapacidad", "Discapacidad"],
                ["ocupacion", "Ocupación"],
                ["fecha_nacimiento", "Fecha Nacimiento"],
              ].map(([name, label]) => (
                <div key={name} className="mb-3">
                  <label className="form-label">{label} <span style={{ color: "red" }}>*</span></label>
                  <input
                    name={name}
                    type={name === "fecha_nacimiento" ? "date" : "text"}
                    value={persona[name] || ""}
                    onChange={handlePersona}
                    required
                  />
                </div>
              ))}

              {/* selects de catálogos */}
              <div className="mb-3">
                <label className="form-label">Sexo <span style={{ color: "red" }}>*</span></label>
                <select name="id_sexo" value={persona.id_sexo || ""} onChange={handlePersona} required>
                  <option value="">Seleccione sexo</option>
                  {(catalogos.sexos || []).map((s) => (
                    // s puede venir con id_sexo, id o similar
                    <option key={s.id_sexo ?? s.id ?? JSON.stringify(s)} value={s.id_sexo ?? s.id}>
                      {s.nombre ?? s.name ?? String(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Tipo de documento <span style={{ color: "red" }}>*</span></label>
                <select name="id_tipo_documento" value={persona.id_tipo_documento || ""} onChange={handlePersona} required>
                  <option value="">Seleccione tipo</option>
                  {(catalogos.tiposDocumento || []).map((t) => (
                    <option key={t.id_tipo_documento ?? t.id ?? JSON.stringify(t)} value={t.id_tipo_documento ?? t.id}>
                      {t.nombre ?? t.name ?? String(t)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Foto <span style={{ color: "red" }}>*</span></label>
                <input ref={fotoRef} name="foto" type="file" accept="image/*" onChange={handlePersona} required />
              </div>

              <div className="tratamiento-datos">
                                <div className="checkbox-moderno">
                                  <input 
                                    id="chkTratamiento" 
                                    type="checkbox" 
                                    checked={aceptaTratamiento} 
                                    onChange={() => setAceptaTratamiento(prev => !prev)} 
                                  />
                                  <label htmlFor="chkTratamiento" className="checkbox-label">
                                    <FaShieldAlt className="checkbox-icon" />
                                    Acepto el tratamiento de mis datos personales según la{" "}
                                    <a 
                                      href="/documentacion/tratamiento-de-datos.pdf" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="link-politica"
                                    >
                                      ley de protección de datos
                                    </a>
                                    <span className="required">*</span>
                                  </label>
                                </div>
                              </div>
            </motion.div>
          )}

          {/* Paso 2: credenciales y datos del funcionario */}
          {step === 2 && (
            <motion.div key="paso2" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Datos Académicos / Credenciales</h3>

              <div className="mb-3">
                <label className="form-label">Usuario (username) <span style={{ color: "red" }}>*</span></label>
                <input name="username" value={usuario.username} onChange={handleUsuario} type="text" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña <span style={{ color: "red" }}>*</span></label>
                <input name="contrasena" value={usuario.contrasena} onChange={handleUsuario} type="password" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Cargo <span style={{ color: "red" }}>*</span></label>
                <input name="cargo" value={funcionario.cargo} onChange={handleFuncionario} type="text" required />
              </div>

              <div className="mb-3">
                <label className="form-label">ARL <span style={{ color: "red" }}>*</span></label>
                <input name="arl" value={funcionario.arl} onChange={handleFuncionario} type="text" required />
              </div>
              <div className="mb-3">
              <label className="form-label">Rol <span style={{ color: "red" }}>*</span></label>
              <select
                name="id_tipo_usuario"
                value={usuario.id_tipo_usuario}
                onChange={handleUsuario}
                required
              >
                {catalogos.tiposUsuario?.map((t) => (
                  <option key={t.id_tipo_usuario} value={t.id_tipo_usuario}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            </motion.div>
          )}

          {/* Paso 3: archivos opcionales y revisión */}
          {step === 3 && (
            <motion.div key="paso3" className="form-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Archivos / Revisión</h3>
              <div className="mb-3">
                <label className="form-label">EPS (archivo)</label>
                <input name="eps" type="file" onChange={handleArchivos} />
              </div>
              <div className="mb-3">
                <label className="form-label">ARL (archivo)</label>
                <input name="arl" type="file" onChange={handleArchivos} />
              </div>
              <div className="mb-3">
                <label className="form-label">Hoja de vida (archivo)</label>
                <input name="hoja_vida" type="file" onChange={handleArchivos} />
              </div>
              <div className="mb-3">
                <label className="form-label">Acta grado (archivo)</label>
                <input name="acta_grado" type="file" onChange={handleArchivos} />
              </div>
              <div className="mb-3">
                <label className="form-label">RUT (archivo)</label>
                <input name="rut" type="file" onChange={handleArchivos} />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline">Editar Datos</button>
                <button type="submit" className="btn btn-primary">Finalizar (Confirmar)</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="botones">
        {step > 1 && step < 4 && (
          <button type="button" onClick={retroceder} disabled={loading}>Anterior</button>
        )}
        {step < 3 && (
          <button type="button" onClick={avanzar} disabled={loading}>Siguiente</button>
        )}
      </div>

      {/* Modal confirmación */}
      {showConfirmModal && (
        <div style={{ backgroundColor: "rgba(0,0,0,0.6)" }} className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Confirmar Registro</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)} />
              </div>
              <div className="modal-body text-center">
                <p>¿Deseas registrar este profesor?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Registrando..." : "Sí, registrar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje final */}
      {mensaje && (
        <div style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} className="modal show text-center">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{mensaje.includes("✅") ? "Éxito" : "Error"}</h5>
                <button type="button" className="btn-close" onClick={() => setMensaje("")}></button>
              </div>
              <div className="modal-body">
                <p>{mensaje}</p>
                {usuarioGenerado && (
                  <div>
                    <h6>🧑‍🏫 Usuario Registrado:</h6>
                    <p><strong>Usuario:</strong> {usuarioGenerado.username ?? usuarioGenerado.user ?? "-"}</p>
                    <p><strong>Contraseña:</strong> {usuarioGenerado.contrasena ?? usuario.contrasena ?? "-"}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => setMensaje("")}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loader overlay */}
      <LoaderOverlay />

      {/* estilos mínimos para loader (puedes mover a tu CSS) */}
      <style>{`
        .loader-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5000;
          background: rgba(0,0,0,0.35);
        }
        .loader-box {
          background: #fff;
          padding: 18px 22px;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.18);
          text-align: center;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid rgba(0,0,0,0.08);
          border-top-color: #2563eb;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
