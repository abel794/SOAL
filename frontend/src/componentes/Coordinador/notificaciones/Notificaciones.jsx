import React, { useState, useEffect } from "react";
import "./Notificaciones.css";
import { FiBell, FiSearch } from "react-icons/fi";

// 📬 Componente principal
export default function Notificaciones() {
  // Estado donde se guardan las notificaciones obtenidas del backend
  const [notificaciones, setNotificaciones] = useState([]);
  // ID de la notificación que se está mostrando en detalle
  const [detalleId, setDetalleId] = useState(null);
  // Mensajes informativos o de error
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  // Control de carga
  const [loading, setLoading] = useState(false);

  // 🔹 Filtros disponibles para buscar notificaciones
  const [filtros, setFiltros] = useState({
    numero_documento: "",
    id_estado: "",
    id_canal: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  // 🔹 Al iniciar el componente, se cargan todas las notificaciones
  useEffect(() => {
    obtenerNotificaciones();
  }, []);

  // 🔹 Función para obtener las notificaciones desde el backend
  const obtenerNotificaciones = async (params = "") => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/coordinador/notificacion${params}`;
      const res = await fetch(url);
      const data = await res.json();

      // Si hay resultados
      if (res.ok && data.length > 0) {
        setNotificaciones(data);
        setMensaje("");
      } else {
        // Si no se encontraron notificaciones
        setNotificaciones([]);
        setMensaje("No hay notificaciones registradas con esos filtros.");
        setTipoMensaje("info");
      }
    } catch (error) {
      // Si el servidor no responde o hay error de conexión
      setMensaje("⚠️ Error al conectar con el servidor.");
      setTipoMensaje("error");
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Función que actualiza los filtros a medida que el usuario escribe o selecciona
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  // 🔍 Función que aplica los filtros (arma la query y llama al backend)
  const aplicarFiltros = () => {
    const queryParams = Object.entries(filtros)
      .filter(([_, v]) => v.trim() !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");

    const params = queryParams ? `?${queryParams}` : "";
    obtenerNotificaciones(params);
  };

  // 🧼 Limpia los filtros y recarga todas las notificaciones
  const limpiarFiltros = () => {
    setFiltros({
      numero_documento: "",
      id_estado: "",
      id_canal: "",
      fecha_inicio: "",
      fecha_fin: "",
    });
    obtenerNotificaciones();
  };

  // 🔄 Muestra u oculta los detalles de una notificación
  const toggleDetalles = (id) => {
    setDetalleId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="noti-principal">
      {/* 🔷 Encabezado principal */}
      
      <header className="noti-encabezado">
        <div>
          <h2>Centro de Notificaciones</h2>
          <p>Instituto Renato Descartes</p>
        </div>
        <span className="noti-docente">👨‍🏫 Coordinador General</span>
      </header>
      <section className="noti-ayuda">
  <p className="texto-ayuda">
    🔍 <strong>Filtra tus notificaciones</strong> usando cualquiera de los siguientes campos:
    <br />
    - Escribe el <strong>número de documento</strong> del acudiente.<br />
    - Selecciona el <strong>estado</strong> (Pendiente, Enviado o Fallido).<br />
    - Elige el <strong>canal</strong> (Email, WhatsApp o SMS).<br />
    - O usa un <strong>rango de fechas</strong> para ver notificaciones enviadas en ese periodo.
  </p>
</section>


      {/* 🎯 Sección de filtros */}
      <section className="noti-filtros">
        <input
          type="text"
          name="numero_documento"
          placeholder="Documento del acudiente"
          value={filtros.numero_documento}
          onChange={manejarCambio}
        />

        <select name="id_estado" value={filtros.id_estado} onChange={manejarCambio}>
          <option value="">Estado</option>
          <option value="1">Pendiente</option>
          <option value="2">Enviado</option>
          <option value="3">Fallido</option>
        </select>

        <select name="id_canal" value={filtros.id_canal} onChange={manejarCambio}>
          <option value="">Canal</option>
          <option value="1">Email</option>
          <option value="2">WhatsApp</option>
          <option value="3">SMS</option>
        </select>

        <input type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={manejarCambio} />
        <input type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={manejarCambio} />

        <button onClick={aplicarFiltros}>
          <FiSearch /> Buscar
        </button>
        
      </section>

      {/* 🔔 Mensajes informativos */}
      {mensaje && (
        <div
          className={`alerta ${
            tipoMensaje === "error"
              ? "alerta-error"
              : tipoMensaje === "info"
              ? "alerta-info"
              : "alerta-exito"
          }`}
        >
          {mensaje}
        </div>
      )}

      {loading && <div className="alerta alerta-info">Cargando notificaciones...</div>}

      {/* 🧾 Listado de notificaciones */}
      <div className="noti-listado">
        {notificaciones.map((n) => (
          <div key={n.id_notificacion} className="noti-tarjeta">
            <div className="noti-cabecera">
              <div className="noti-cabecera-info">
                <FiBell size={40} color="#f5b400" />
                <p>
                  <strong>Canal:</strong> {n.canal?.nombre || "Desconocido"}
                </p>
              </div>
              <p className="noti-fecha">
                {new Date(n.fecha_envio).toLocaleString("es-CO")}
              </p>
            </div>

            <h4>Mensaje</h4>
            <p>{n.mensaje}</p>

            {/* 🔽 Mostrar u ocultar detalles */}
            {detalleId === n.id_notificacion ? (
              <div className="noti-detalles">
                <p>
                  <strong>Estado:</strong> {n.estado?.nombre || "No definido"}
                </p>
                <p>
                  <strong>Acudiente:</strong>{" "}
                  {n.acudiente?.numero_documento || "Desconocido"}
                </p>
                <p>
                  <strong>ID Observación:</strong> {n.id_observacion}
                </p>
                <button
                  className="btn-ocultar"
                  onClick={() => toggleDetalles(n.id_notificacion)}
                >
                  Ocultar
                </button>
              </div>
            ) : (
              <button
                className="btn-detalles"
                onClick={() => toggleDetalles(n.id_notificacion)}
              >
                Ver detalles
              </button>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
}
