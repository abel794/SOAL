// RegistroSecretariaMultistep.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./RegistroSecretaria.css";
import { FaShieldAlt } from "react-icons/fa";

export default function RegistroSecretariaMultistep() {
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    foto: null, // mantengo la propiedad para que sea igual a profesor
  });

  const [usuario, setUsuario] = useState({
    username: "",
    contrasena: "",
    id_tipo_usuario: 5, // Secretaria
  });

  const [funcionario, setFuncionario] = useState({
    cargo: "Secretaria",
    arl: "No aplica",
  });

  const [archivos, setArchivos] = useState({
    eps: null,
    arl: null,
    hoja_vida: null,
    acta_grado: null,
    rut: null,
  });

  const [aceptaTratamiento, setAceptaTratamiento] = useState(false);

  const handlePersona = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setPersona((prev) => ({ ...prev, foto: files[0] }));
    } else {
      setPersona((prev) => ({
        ...prev,
        [name]: ["id_sexo", "id_tipo_documento"].includes(name)
          ? Number(value)
          : value,
      }));
    }
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
    setArchivos((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  // Validación paso a paso (igual estructura al del profesor)
  const validarPaso = () => {
    if (step === 1) {
      const {
        nombre,
        apellido,
        numero_documento,
        correo,
        telefono,
        direccion,
        ciudad_residencia,
        tipo_sangre,
        ocupacion,
        fecha_nacimiento,
        id_sexo,
        id_tipo_documento,
        foto,
      } = persona;

      if (
        !nombre ||
        !apellido ||
        !numero_documento ||
        !correo ||
        !telefono ||
        !direccion ||
        !ciudad_residencia ||
        !tipo_sangre ||
        !ocupacion ||
        !fecha_nacimiento ||
        !id_sexo ||
        !id_tipo_documento ||
        !foto
      ) {
        setMensaje("❌ Faltan campos por llenar en Datos Personales");
        return false;
      }

      if (!aceptaTratamiento) {
        setMensaje("❌ Debes aceptar el tratamiento de datos personales");
        return false;
      }
    }

    if (step === 2) {
      const { username, contrasena } = usuario;
      const { cargo, arl } = funcionario;
      if (!username || !contrasena || !cargo || !arl) {
        setMensaje("❌ Completa todos los campos académicos");
        return false;
      }
    }

    if (step === 3) {
      for (const [campo, file] of Object.entries(archivos)) {
        if (!file) {
          setMensaje(`❌ Debes adjuntar el archivo: ${campo.toUpperCase()}`);
          return false;
        }
      }
    }

    // si todo ok, limpia mensaje
    setMensaje("");
    return true;
  };

  const avanzar = () => {
    if (validarPaso()) {
      if (step < 4) setStep(step + 1);
    }
  };

  const retroceder = () => step > 1 && setStep(step - 1);

  // Confirmar antes de registrar
  const confirmarRegistro = (e) => {
    e.preventDefault();
    if (validarPaso()) {
      setShowConfirmModal(true);
    }
  };

  // Envío: armamos FormData igual que en profesor
  const handleSubmit = async () => {
    setShowConfirmModal(false);

    // Si el usuario no rellenó manualmente username/contraseña, generamos por defecto
    const usuarioToSend = {
      ...usuario,
      username: usuario.username || persona.correo,
      contrasena: usuario.contrasena || persona.numero_documento,
      id_tipo_usuario: 5,
    };

    const funcionarioToSend = {
      ...funcionario,
      cargo: funcionario.cargo || "Secretaria",
      arl: funcionario.arl || "No aplica",
    };

    const formData = new FormData();

    // Eliminamos foto del objeto persona para no serializar el File dentro del JSON
    const personaSinFoto = { ...persona };
    if ("foto" in personaSinFoto) delete personaSinFoto.foto;

    formData.append("persona", JSON.stringify(personaSinFoto));
    formData.append("usuario", JSON.stringify(usuarioToSend));
    formData.append("funcionario", JSON.stringify(funcionarioToSend));

    // Adjuntamos la foto (si existe)
    if (persona.foto) {
      formData.append("foto", persona.foto);
    }

    // Archivos extra
    for (const [campo, file] of Object.entries(archivos)) {
      if (file) {
        formData.append(`archivo_${campo}`, file);
      }
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/coordinador/registrarFuncionario`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUsuarioGenerado({
          username: usuarioToSend.username,
          contrasena: usuarioToSend.contrasena,
        });
        setMensaje(data.mensaje || "✅ Secretaria registrada con éxito");
        setStep(4);
      } else {
        setMensaje(data.mensaje || "❌ Error al registrar");
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="profesor-formulario">
      <h2>Registro de Secretaria</h2>

      <div className="pasos">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`paso ${step === n ? "activo" : ""}`}>
            {n}
          </div>
        ))}
      </div>

      <form onSubmit={confirmarRegistro}>
        <AnimatePresence mode="wait">
          {/* Paso 1 */}
          {step === 1 && (
            <motion.div
              key="paso1"
              className="form-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3>Datos Personales</h3>

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
                  <label className="form-label">
                    {label} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    name={name}
                    type={name === "fecha_nacimiento" ? "date" : "text"}
                    value={persona[name]}
                    onChange={handlePersona}
                    required
                  />
                </div>
              ))}

              {/* Foto (igual que profesor) */}
              <div className="mb-3">
                <label className="form-label">
                  Foto <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="file"
                  name="foto"
                  accept="image/*"
                  onChange={handlePersona}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Sexo <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  name="id_sexo"
                  value={persona.id_sexo}
                  onChange={handlePersona}
                  required
                >
                  <option value="">Seleccione sexo</option>
                  <option value="1">Masculino</option>
                  <option value="2">Femenino</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Tipo Documento <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  name="id_tipo_documento"
                  value={persona.id_tipo_documento}
                  onChange={handlePersona}
                  required
                >
                  <option value="">Seleccione tipo de documento</option>
                  <option value="1">CC</option>
                  <option value="2">TI</option>
                </select>
              </div>

              {/* Checkbox tratamiento de datos */}
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

          {/* Paso 2: Datos Académicos (igual que profesor) */}
          {step === 2 && (
            <motion.div
              key="paso2"
              className="form-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3>Datos Académicos</h3>
              <label>
                Usuario <span style={{ color: "red" }}>*</span>
              </label>
              <input
                name="username"
                value={usuario.username}
                onChange={handleUsuario}
                placeholder="usuario (ej. correo)"
                required
              />

              <label>
                Contraseña <span style={{ color: "red" }}>*</span>
              </label>
              <input
                name="contrasena"
                type="password"
                value={usuario.contrasena}
                onChange={handleUsuario}
                required
              />

              <label>
                Cargo <span style={{ color: "red" }}>*</span>
              </label>
              <input
                name="cargo"
                value={funcionario.cargo}
                onChange={handleFuncionario}
                required
              />

              <label>
                ARL <span style={{ color: "red" }}>*</span>
              </label>
              <input
                name="arl"
                value={funcionario.arl}
                onChange={handleFuncionario}
                required
              />
            </motion.div>
          )}

          {/* Paso 3: Documentos */}
          {step === 3 && (
            <motion.div
              key="paso3"
              className="form-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3>Documentos (PDF o PNG)</h3>
              {["eps", "arl", "hoja_vida", "acta_grado", "rut"].map((name) => (
                <div key={name} className="mb-3">
                  <label>
                    {name.replace("_", " ").toUpperCase()}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="file"
                    name={name}
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleArchivos}
                    required
                  />
                </div>
              ))}
              <button type="submit">Registrar Secretaria</button>
            </motion.div>
          )}

          {/* Paso 4: Resultado (similar al modal final del profesor) */}
          {step === 4 && (
            <motion.div
              key="paso4"
              className="form-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3>Resultado</h3>
              {mensaje && <p className="mensaje-final">{mensaje}</p>}
              {usuarioGenerado && (
                <div>
                  <h6>🧑‍💼 Usuario Registrado:</h6>
                  <p>
                    <strong>Usuario:</strong> {usuarioGenerado.username}
                  </p>
                  <p>
                    <strong>Contraseña:</strong> {usuarioGenerado.contrasena}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="botones">
        {step > 1 && step < 4 && (
          <button type="button" onClick={retroceder}>
            Anterior
          </button>
        )}
        {step < 3 && (
          <button type="button" onClick={avanzar}>
            Siguiente
          </button>
        )}
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg rounded-3">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Confirmar Registro</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p className="fs-5">¿Deseas registrar esta secretaria?</p>
                <small className="text-muted">
                  Verifica que toda la información esté correcta.
                </small>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary px-4" onClick={handleSubmit}>
                  Sí, registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Mensaje Final (igual que en profesor) */}
      {mensaje && (
        <div
          className="modal fade show text-center"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mensaje.includes("✅") ? "Éxito" : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMensaje("")}
                ></button>
              </div>
              <div className="modal-body">
                <p>{mensaje}</p>
                {usuarioGenerado && (
                  <div>
                    <h6>🧑‍💼 Usuario Registrado:</h6>
                    <p>
                      <strong>Usuario:</strong> {usuarioGenerado.username}
                    </p>
                    <p>
                      <strong>Contraseña:</strong> {usuarioGenerado.contrasena}
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setMensaje("")}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
