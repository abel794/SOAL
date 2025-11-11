import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalMensaje from "../../ui/ModalMensaje"; // asumo que ya lo tienes

const ConfiguracionCuenta = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad_residencia: "",
    ocupacion: "",
    foto: null,
    passwordActual: "",
    passwordNueva: "",
    passwordConfirm: "",
  });

  const [datosOriginales, setDatosOriginales] = useState({});
  const [fotoPreview, setFotoPreview] = useState(null);

  // Mensajes visibles en el formulario (alert)
  const [mensaje, setMensaje] = useState("");

  // Modal: confirmación de "¿estás seguro?"
  const [modalVisible, setModalVisible] = useState(false);

  // Modal: resultado (éxito / error / info)
  const [resultadoModal, setResultadoModal] = useState({
    visible: false,
    tipo: "info", // "exito" | "error" | "info"
    titulo: "",
    mensaje: "",
  });

  // === Función que hace el PUT al backend (se llama cuando confirman) ===
  const ejecutarSubmit = async () => {
    const token = localStorage.getItem("token");
    const documento = localStorage.getItem("documento");

    // Validación de nueva contraseña
    if (formData.passwordNueva || formData.passwordConfirm) {
      if (formData.passwordNueva !== formData.passwordConfirm) {
        setMensaje("❌ La nueva contraseña no coincide con la confirmación");
        setModalVisible(false);
        return;
      }
    }

    // Detectar cambios (excluimos campos de password temporal)
    const hayCambios =
      Object.keys(formData).some(
        (key) =>
          key !== "passwordActual" &&
          key !== "passwordNueva" &&
          key !== "passwordConfirm" &&
          formData[key] !== datosOriginales[key]
      ) || !!formData.passwordNueva;

    if (!hayCambios) {
      setMensaje("⚠️ No hay cambios para guardar");
      setModalVisible(false);
      // mostramos modal de resultado tipo info (opcional)
      setResultadoModal({
        visible: true,
        tipo: "info",
        titulo: "Nada que guardar",
        mensaje: "No detectamos cambios en tus datos.",
      });
      return;
    }

    try {
      // construimos payload (mapeo passwordNueva -> contrasena)
      const payload = { ...formData };
      if (formData.passwordNueva) payload.contrasena = formData.passwordNueva;

      // quitamos campos que no espera backend
      delete payload.passwordActual;
      delete payload.passwordNueva;
      delete payload.passwordConfirm;

      await axios.put(
        `http://localhost:3000/api/coordinador/persona/${documento}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizamos estados locales
      setDatosOriginales(formData);
      setFormData((prev) => ({
        ...prev,
        passwordActual: "",
        passwordNueva: "",
        passwordConfirm: "",
      }));

      setMensaje("✅ Datos actualizados correctamente");

      // mostramos modal de resultado con estilo éxito
      setResultadoModal({
        visible: true,
        tipo: "exito",
        titulo: "¡Listo!",
        mensaje: "✅ Datos actualizados correctamente",
      });

      // auto-cerrar modal de éxito después de 3.5s
      setTimeout(() => {
        setResultadoModal((prev) => ({ ...prev, visible: false }));
      }, 3500);

    } catch (err) {
      const detalle = err.response?.data?.detalle || err.response?.data?.error || err.message;
      const texto = "❌ Error al guardar los cambios: " + detalle;
      setMensaje(texto);

      setResultadoModal({
        visible: true,
        tipo: "error",
        titulo: "Error",
        mensaje: texto,
      });
    } finally {
      // cerramos modal de confirmación (si estaba abierto)
      setModalVisible(false);
    }
  };

  // Cuando el usuario hace submit en el formulario: abrimos modal de confirmación
  const handleSubmit = (e) => {
    e.preventDefault();
    setModalVisible(true);
  };

  // Fetch inicial de datos
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const documento = localStorage.getItem("documento");

        const res = await axios.get(
          `http://localhost:3000/api/coordinador/persona/${documento}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;
        setFormData((prev) => ({
          ...prev,
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          correo: data.correo || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          ciudad_residencia: data.ciudad_residencia || "",
          ocupacion: data.ocupacion || "",
          foto: data.foto || null,
        }));

        setDatosOriginales(data);

        if (data.foto) setFotoPreview(data.foto);
      } catch (err) {
        setMensaje("❌ Error al cargar los datos");
        setResultadoModal({
          visible: true,
          tipo: "error",
          titulo: "Error",
          mensaje: "❌ Error al cargar tus datos. Revisa la conexión al servidor.",
        });
      }
    };

    fetchDatos();
  }, []);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo imagen local -> base64 preview
  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result);
      setFormData((prev) => ({ ...prev, foto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4 text-center">Configuración de Cuenta</h4>

      <form onSubmit={handleSubmit} className="row g-3">
        {/* Correo */}
        <div className="col-md-6">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Teléfono */}
        <div className="col-md-6">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            pattern="[0-9]{7,15}"
            placeholder="Solo números"
          />
        </div>

        {/* Dirección */}
        <div className="col-md-12">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>

        {/* Ciudad */}
        <div className="col-md-12">
          <label className="form-label">Ciudad de residencia</label>
          <input
            type="text"
            className="form-control"
            name="ciudad_residencia"
            value={formData.ciudad_residencia}
            onChange={handleChange}
          />
        </div>

        {/* Ocupación */}
        <div className="col-md-12">
          <label className="form-label">Ocupación</label>
          <input
            type="text"
            className="form-control"
            name="ocupacion"
            value={formData.ocupacion}
            onChange={handleChange}
          />
        </div>

        {/* Contraseñas */}
        <div className="col-md-12">
          <label className="form-label">Contraseña actual</label>
          <input
            type="password"
            className="form-control"
            name="passwordActual"
            value={formData.passwordActual}
            onChange={handleChange}
            placeholder="Ingrese su contraseña actual"
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            name="passwordNueva"
            value={formData.passwordNueva}
            onChange={handleChange}
            placeholder="Ingrese la nueva contraseña"
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Confirmar nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="Confirme la nueva contraseña"
          />
        </div>

        {/* Foto */}
        <div className="col-md-12">
          <label className="form-label">Foto de perfil</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFotoChange}
          />
          {fotoPreview && (
            <div className="text-center mt-3">
              <img
                src={fotoPreview}
                alt="Foto de perfil"
                className="img-thumbnail rounded-circle"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        {/* Mensaje y botón */}
        <div className="col-12 text-center mt-4">
          {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

          <button type="submit" className="btn btn-primary px-4">
            Guardar cambios
          </button>
        </div>
      </form>

      {/* Modal de confirmación (antes de ejecutar) */}
      <ModalMensaje
        visible={modalVisible}
        tipo="confirmacion"
        titulo="Confirmar cambios"
        mensaje="¿Estás seguro de que quieres guardar los cambios de tu cuenta?"
        onClose={() => setModalVisible(false)}
        onConfirm={ejecutarSubmit}
      />

      {/* Modal de resultado (éxito / error / info) */}
      <ModalMensaje
        visible={resultadoModal.visible}
        tipo={resultadoModal.tipo}
        titulo={resultadoModal.titulo}
        mensaje={resultadoModal.mensaje}
        onClose={() => setResultadoModal({ ...resultadoModal, visible: false })}
      />
    </div>
  );
};

export default ConfiguracionCuenta;
