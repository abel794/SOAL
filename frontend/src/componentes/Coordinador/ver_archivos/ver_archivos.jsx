// src/componentes/Coordinador/ver_archivos/ver_archivos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import './ver_archivos.css';


export default function VerArchivos() {
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerArchivos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/ObtenerArchivo"); // Ajusta tu ruta
        setArchivos(res.data);
      } catch (error) {
        console.error("Error al obtener archivos:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerArchivos();
  }, []);

  if (cargando) {
    return <p className="text-center mt-4">Cargando archivos...</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-3">
        <i className="bi bi-images me-2"></i>Archivos subidos
      </h2>

      {archivos.length === 0 ? (
        <p className="text-muted">No hay archivos registrados.</p>
      ) : (
        <div className="row g-4">
          {archivos.map((archivo) => (
            <div key={archivo.id_archivo} className="col-md-3 col-sm-6">
              <div className="card shadow-sm border-0 h-100">
                {archivo.tipo.startsWith("image/") ? (
                  <img
                    src={archivo.contenido_base64}
                    alt={archivo.nombre_original}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: "180px" }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: "180px" }}>
                    <i className="bi bi-file-earmark-text fs-1 text-secondary"></i>
                  </div>
                )}
                <div className="card-body text-center">
                  <h6 className="card-title text-truncate">
                    {archivo.nombre_original}
                  </h6>
                  <small className="text-muted d-block mb-2">
                    {archivo.tipo}
                  </small>
                  <a
                    href={archivo.contenido_base64}
                    download={archivo.nombre_original}
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-download me-1"></i>Descargar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
