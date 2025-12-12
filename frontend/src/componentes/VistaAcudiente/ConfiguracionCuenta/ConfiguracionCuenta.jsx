import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ConfiguracionCuenta/ConfiguracionCuenta.css"
import "bootstrap/dist/css/bootstrap.min.css";


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
  });

  const [passwords, setPasswords] = useState({
    passwordActual: "",
    passwordNueva: "",
    passwordConfirm: "",
  });

  const [datosOriginales, setDatosOriginales] = useState({});
  const [fotoPreview, setFotoPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 Cargar datos del usuario
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const documento = localStorage.getItem("documento");

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/coordinador/persona/${documento}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;
        setFormData({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          correo: data.correo || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          ciudad_residencia: data.ciudad_residencia || "",
          ocupacion: data.ocupacion || "",
          foto: null,
        });

        setDatosOriginales(data);

        if (data.foto) setFotoPreview(data.foto);
      } catch (err) {
        setMensaje("❌ Error al cargar los datos");
      }
    };

    fetchDatos();
  }, []);

  // 🟢 Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Manejo de foto
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, foto: file }));
    }
  };

  // 🟢 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Validar contraseña
    if (passwords.passwordNueva || passwords.passwordConfirm) {
      if (!passwords.passwordActual) {
        setMensaje("❌ Debe ingresar su contraseña actual para cambiarla");
        return;
      }
      if (passwords.passwordNueva !== passwords.passwordConfirm) {
        setMensaje("❌ La nueva contraseña no coincide");
        return;
      }
    }

    // Detectar cambios
    const hayCambios =
      Object.keys(formData).some((key) => formData[key] !== datosOriginales[key]) ||
      passwords.passwordNueva ||
      formData.foto;

    if (!hayCambios) {
      setMensaje("⚠️ No hay cambios para guardar");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const documento = localStorage.getItem("documento");

      const payload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) payload.append(key, formData[key]);
      });

      if (passwords.passwordNueva)
        payload.append("contrasena", passwords.passwordNueva);

      if (passwords.passwordActual)
        payload.append("passwordActual", passwords.passwordActual);

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/coordinador/persona/${documento}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMensaje("✅ Datos actualizados correctamente");
      setDatosOriginales(formData);
      setPasswords({ passwordActual: "", passwordNueva: "", passwordConfirm: "" });
    } catch (err) {
      if (err.response) {
        setMensaje("❌ Error: " + (err.response.data.detalle || err.response.data.error));
      } else {
        setMensaje("❌ Hubo un error al guardar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="configuracion-container">
    <div className="container py-4">
      <h4 className="mb-4 text-center fw-bold">Configuración de Cuenta</h4>

      {mensaje && (
        <div className="alert alert-info text-center fw-semibold">{mensaje}</div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">

        {/* Correo */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Correo electrónico</label>
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
          <label className="form-label fw-semibold">Teléfono</label>
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
          <label className="form-label fw-semibold">Dirección</label>
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
          <label className="form-label fw-semibold">Ciudad de residencia</label>
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
          <label className="form-label fw-semibold">Ocupación</label>
          <input
            type="text"
            className="form-control"
            name="ocupacion"
            value={formData.ocupacion}
            onChange={handleChange}
          />
        </div>

        {/* Contraseña actual */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Contraseña actual</label>
          <input
            type="password"
            className="form-control"
            name="passwordActual"
            value={passwords.passwordActual}
            onChange={handlePasswordChange}
            placeholder="Ingrese su contraseña actual"
          />
        </div>

        {/* Nueva contraseña */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            name="passwordNueva"
            value={passwords.passwordNueva}
            onChange={handlePasswordChange}
            placeholder="Ingrese la nueva contraseña"
          />
        </div>

        {/* Confirmar contraseña */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Confirmar nueva contraseña</label>
          <input
            type="password"
            className="form-control"
            name="passwordConfirm"
            value={passwords.passwordConfirm}
            onChange={handlePasswordChange}
            placeholder="Confirme la nueva contraseña"
          />
        </div>

        {/* Foto */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Foto de perfil</label>
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
                className="img-thumbnail rounded-circle shadow-sm"
                style={{ width: 140, height: 140, objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        {/* Guardar */}
        <div className="col-12 text-center mt-4">
          <button
            type="submit"
            className="btn btn-primary px-4 fw-semibold"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

      </form>
    </div>
    </div>
  );
};

export default ConfiguracionCuenta;
