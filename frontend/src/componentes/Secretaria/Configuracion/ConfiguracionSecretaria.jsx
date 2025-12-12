import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const documento = localStorage.getItem("documento");

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/coordinador/persona/${documento}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setFormData((prev) => ({
          ...prev,
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          correo: data.correo || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          ciudad_residencia: data.ciudad_residencia || "",
          foto: data.foto || null,
        }));

        setDatosOriginales(data);

        if (data.foto) setFotoPreview(data.foto);
      } catch (err) {
        setMensaje("❌ Error al cargar los datos");
      }
    };

    fetchDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
        setFormData((prev) => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const documento = localStorage.getItem("documento");

    // ✅ Validación de nueva contraseña
    if (formData.passwordNueva || formData.passwordConfirm) {
      if (formData.passwordNueva !== formData.passwordConfirm) {
        setMensaje("❌ La nueva contraseña no coincide con la confirmación");
        return;
      }
    }

    // ✅ Detectar cambios
    const hayCambios =
      Object.keys(formData).some(
        (key) =>
          key !== "passwordActual" &&
          key !== "passwordNueva" &&
          key !== "passwordConfirm" &&
          formData[key] !== datosOriginales[key]
      ) || formData.passwordNueva;

    if (!hayCambios) {
      setMensaje("⚠️ No hay cambios para guardar");
      return;
    }

    try {
      // 🛠️ Armamos payload
      const payload = { ...formData };

      // 🔑 Mapeamos passwordNueva → contrasena
      if (formData.passwordNueva) {
        payload.contrasena = formData.passwordNueva;
      }

      // 🚫 Eliminamos los campos que no debe recibir backend
      delete payload.passwordActual;
      delete payload.passwordNueva;
      delete payload.passwordConfirm;

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/personas/${documento}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMensaje("✅ Datos actualizados correctamente");
      setDatosOriginales(formData);
      setFormData((prev) => ({
        ...prev,
        passwordActual: "",
        passwordNueva: "",
        passwordConfirm: "",
      }));
    } catch (err) {
      if (err.response) {
        setMensaje("❌ Error: " + (err.response.data.detalle || err.response.data.error));
      } else {
        setMensaje("❌ Hubo un error al guardar los cambios");
      }
    }
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4 text-center">Configuración de Cuenta</h4>
      {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}
      <form onSubmit={handleSubmit} className="row g-3">
        {/* Campos existentes */}
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

        {/* Campos de contraseña */}
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

        {/* Foto de perfil */}
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

        <div className="col-12 text-center mt-4">
          <button type="submit" className="btn btn-primary px-4">
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracionCuenta;
