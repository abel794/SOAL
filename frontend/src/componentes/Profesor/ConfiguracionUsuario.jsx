// src/componentes/ConfiguracionCuenta/ConfiguracionCuenta.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalMensaje from "../ui/ModalMensaje";
import "./ConfiguracionCuenta.css";

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
  const [modal, setModal] = useState({
    visible: false,
    tipo: "info",
    titulo: "",
    mensaje: "",
    onConfirm: null
  });

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
        setFormData(prev => ({
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
        showModal("error", "Error", "❌ Error al cargar los datos");
      }
    };

    fetchDatos();
  }, []);

  const showModal = (tipo, titulo, mensaje, onConfirm = null) => {
    setModal({
      visible: true,
      tipo,
      titulo,
      mensaje,
      onConfirm
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, visible: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showModal("error", "Error", "La imagen debe ser menor a 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
        setFormData(prev => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (formData.passwordNueva || formData.passwordConfirm) {
      if (formData.passwordNueva !== formData.passwordConfirm) {
        showModal("error", "Error", "❌ La nueva contraseña no coincide con la confirmación");
        return;
      }
      if (formData.passwordNueva.length < 6) {
        showModal("error", "Error", "❌ La contraseña debe tener al menos 6 caracteres");
        return;
      }
    }

    // Verificar cambios
    const hayCambios = Object.keys(formData).some(
      key =>
        !["passwordActual", "passwordNueva", "passwordConfirm"].includes(key) &&
        formData[key] !== datosOriginales[key]
    ) || formData.passwordNueva;

    if (!hayCambios) {
      showModal("info", "Información", "⚠️ No hay cambios para guardar");
      return;
    }

    showModal(
      "confirmacion",
      "Confirmar Cambios",
      "¿Estás seguro de que deseas guardar los cambios en tu configuración?",
      confirmarCambios
    );
  };

  const confirmarCambios = async () => {
    closeModal();
    const token = localStorage.getItem("token");
    const documento = localStorage.getItem("documento");

    try {
      const payload = { ...formData };
      
      if (formData.passwordNueva) {
        payload.contrasena = formData.passwordNueva;
      }

      // Limpiar campos de contraseña
      delete payload.passwordActual;
      delete payload.passwordNueva;
      delete payload.passwordConfirm;

      const response = await axios.put(
        `http://localhost:3000/api/coordinador/persona/${documento}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showModal("exito", "Éxito", "✅ Datos actualizados correctamente");
      setDatosOriginales(formData);
      setFormData(prev => ({
        ...prev,
        passwordActual: "",
        passwordNueva: "",
        passwordConfirm: "",
      }));
    } catch (err) {
      const mensajeError = err.response?.data?.detalle || 
                          err.response?.data?.error || 
                          "❌ Hubo un error al guardar los cambios";
      showModal("error", "Error", mensajeError);
    }
  };

  return (
    <div className="configuracion-container">
      <div className="configuracion-header">
        <h1>⚙️ Configuración de Cuenta</h1>
        <p>Gestiona tu información personal y preferencias</p>
      </div>

      <form onSubmit={handleSubmit} className="configuracion-form">
        <div className="form-section">
          <h3>📝 Información Personal</h3>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Teléfono</label>
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
            </div>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              className="form-control"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Ciudad de residencia</label>
                <input
                  type="text"
                  className="form-control"
                  name="ciudad_residencia"
                  value={formData.ciudad_residencia}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Ocupación</label>
                <input
                  type="text"
                  className="form-control"
                  name="ocupacion"
                  value={formData.ocupacion}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>🔒 Seguridad</h3>
          <div className="form-group">
            <label>Contraseña actual</label>
            <input
              type="password"
              className="form-control"
              name="passwordActual"
              value={formData.passwordActual}
              onChange={handleChange}
              placeholder="Ingrese su contraseña actual para hacer cambios"
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="passwordNueva"
                  value={formData.passwordNueva}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="Repita la nueva contraseña"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>🖼️ Foto de Perfil</h3>
          <div className="foto-upload">
            <div className="foto-preview">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Foto de perfil" className="foto-img" />
              ) : (
                <div className="foto-placeholder">
                  <i className="bi bi-person-circle"></i>
                </div>
              )}
            </div>
            <div className="foto-controls">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFotoChange}
              />
              <small>Formatos: JPG, PNG, GIF. Máximo 5MB</small>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            💾 Guardar Cambios
          </button>
        </div>
      </form>

      <ModalMensaje
        visible={modal.visible}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensaje={modal.mensaje}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default ConfiguracionCuenta;