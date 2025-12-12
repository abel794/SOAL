// 📂 src/componentes/Profesor/EnviarNotificacionGrado.jsx
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EnviarNotificacionGrado = ({ gradoSeleccionado }) => {
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [respuesta, setRespuesta] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const enviarNotificacion = async (e) => {
    e.preventDefault();
    if (!gradoSeleccionado) {
      setRespuesta({ tipo: "error", texto: "Debes seleccionar un grado antes de enviar." });
      return;
    }

    if (!titulo.trim() || !mensaje.trim()) {
      setRespuesta({ tipo: "error", texto: "Completa todos los campos." });
      return;
    }

    try {
      setEnviando(true);
      const token = localStorage.getItem("token"); // asegúrate de guardar el token al iniciar sesión
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/profesor/enviar-grado`,
        { id_grado: parseInt(gradoSeleccionado), titulo, mensaje },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRespuesta({ tipo: "exito", texto: res.data.mensaje });
      setTitulo("");
      setMensaje("");
    } catch (error) {
      console.error(error);
      setRespuesta({
        tipo: "error",
        texto: error.response?.data?.mensaje || "Error al enviar la notificación.",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h4 className="text-center text-success fw-bold mb-3">
            Enviar Notificación al Grado
          </h4>

          <form onSubmit={enviarNotificacion}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Título</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Recordatorio de reunión"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Mensaje</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Escribe el contenido del mensaje..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 fw-bold"
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Enviar Notificación"}
            </button>
          </form>

          {respuesta && (
            <div
              className={`alert mt-4 text-center ${
                respuesta.tipo === "exito" ? "alert-success" : "alert-danger"
              }`}
            >
              {respuesta.texto}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnviarNotificacionGrado;
