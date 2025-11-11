import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/ResponderPqr.css"

const ResponderPqr = () => {
  const [pqrs, setPqrs] = useState([]);
  const [selectedPqr, setSelectedPqr] = useState(null);
  const [mensajeRespuesta, setMensajeRespuesta] = useState("");
  const [tipoRespuesta, setTipoRespuesta] = useState(""); // "success" | "error"
  const [mensaje, setMensaje] = useState("");
  const [estadoPqr, setEstadoPqr] = useState("");
  const [historial, setHistorial] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/coordinador/pqr", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPqrs(res.data))
      .catch((err) => {
        console.error("Error al cargar PQRs:", err);
        setMensajeRespuesta("Error al cargar la bandeja de PQRs");
        setTipoRespuesta("error");
      });
  }, [token]);

  const verHistorial = (idPqr) => {
    setSelectedPqr(idPqr);
    axios
      .get(`http://localhost:3000/api/coordinador/pqr/${idPqr}/historial`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHistorial(res.data))
      .catch((err) => {
        console.error("Error al cargar historial:", err);
        setMensajeRespuesta("Error al cargar el historial de la PQR");
        setTipoRespuesta("error");
      });
  };

  const responderPqr = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:3000/api/coordinador/pqr/${selectedPqr}/responder`,
        { mensaje, id_estado_pqr: estadoPqr },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setMensajeRespuesta("Respuesta enviada con éxito");
        setTipoRespuesta("success");
        setMensaje("");
        setEstadoPqr("");
        verHistorial(selectedPqr);
      })
      .catch((err) => {
        console.error("Error al responder PQR:", err);
        setMensajeRespuesta("Error al enviar la respuesta");
        setTipoRespuesta("error");
      });
  };

  const getEstadoClass = (estadoNombre) => {
    switch (estadoNombre?.toLowerCase()) {
      case "pendiente":
        return "estado-pendiente";
      case "en proceso":
        return "estado-enproceso";
      case "resuelto":
        return "estado-resuelto";
      case "rechazado":
        return "estado-rechazado";
      default:
        return "";
    }
  };

  return (
    <div className="pqr-container">
      <div className="texto1">
        <h2>📋 Bandeja de PQR</h2>
      </div>
      <br />
      {mensajeRespuesta && (
        <div className={`alerta ${tipoRespuesta}`}>{mensajeRespuesta}</div>
      )}

      <div className="pqr-grid">
        <div className="pqr-lista">
          <table className="pqr-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Acudiente</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pqrs.map((p) => (
                <tr key={p.id_pqr}>
                  <td>{p.id_pqr}</td>
                  <td>{p.acudiente?.persona?.nombre} {p.acudiente?.persona?.apellido}</td>
                  <td className="truncado" title={p.descripcion}>{p.descripcion}</td>
                  <td>
                    <span className={`estado ${getEstadoClass(p.estado?.nombre)}`}>
                      {p.estado?.nombre}
                    </span>
                  </td>
                  <td>{p.fecha}</td>
                  <td>
                    <button onClick={() => verHistorial(p.id_pqr)}>Ver / Responder</button>
                  </td>
                </tr>
              ))}
              {pqrs.length === 0 && (
                <tr>
                  <td colSpan="6" className="centrado">No hay PQRs</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedPqr && (
              <div className="pqr-historial">
                <div className="historial-header">
                  Historial de PQR #{selectedPqr}
                  <button
                    className="btn-cerrar"
                    onClick={() => {
                      setSelectedPqr(null);
                      setHistorial([]);
                    }}
                  >
                    ✖
                  </button>
                </div>
            <div className="historial-lista">
              {historial.length > 0 ? (
                historial.map((h) => (
                  <div key={h.id_historial_pqr} className="historial-item">
                    <div className="historial-header-item">
                      <strong>{h.usuario_respuesta?.username}</strong>
                      <span className={`estado ${getEstadoClass(h.estado_historial?.nombre)}`}>
                        {h.estado_historial?.nombre}
                      </span>
                    </div>
                    <p>{h.mensaje}</p>
                    <small>{new Date(h.fecha).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <div className="centrado">No hay respuestas aún</div>
              )}
            </div>

            <form onSubmit={responderPqr} className="pqr-formulario">
              <label>Respuesta</label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              ></textarea>

              <label>Nuevo estado</label>
              <select
                value={estadoPqr}
                onChange={(e) => setEstadoPqr(e.target.value)}
                required
              >
                <option value="">-- Seleccione --</option>
                <option value="1">Pendiente</option>
                <option value="2">En proceso</option>
                <option value="3">Resuelto</option>
                <option value="4">Rechazado</option>
              </select>

              <button type="submit" className="btn-enviar">Enviar respuesta</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponderPqr;
