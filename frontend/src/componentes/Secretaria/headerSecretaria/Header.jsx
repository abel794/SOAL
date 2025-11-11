import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/Header.css"

const normalizeStored = (v) => {
  if (v === null || v === undefined) return null;
  if (typeof v !== "string") return v;
  const trimmed = v.trim();
  if (
    trimmed === "" ||
    trimmed.toLowerCase() === "undefined" ||
    trimmed.toLowerCase() === "null"
  )
    return null;
  return trimmed;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "¡Buenos días";
  if (hour >= 12 && hour < 18) return "¡Buenas tardes";
  return "¡Buenas noches";
};

const makeInitials = (nombre = "", apellido = "") => {
  const n = (nombre || "").trim();
  const a = (apellido || "").trim();
  const ni = n ? n[0] : "";
  const ai = a ? a[0] : "";
  return (ni + ai).toUpperCase() || "U";
};

const HeaderAcudiente = () => {
  const [nombreColegio, setNombreColegio] = useState("");
  const [usuario, setUsuario] = useState({ nombre: "", apellido: "" });
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const token = normalizeStored(localStorage.getItem("token"));
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchConfig = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/coordinador/configuracionSistema", {
          headers,
          signal: controller.signal,
        });
        setNombreColegio(res.data?.nombre_colegio || "");
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error obtener configuración:", err?.message ?? err);
        }
      }
    };

    const fetchUsuario = async () => {
      try {
        setLoadingUsuario(true);
        const res = await axios.get("http://localhost:3000/api/usuarios/me", {
          headers,
          signal: controller.signal,
        });
        const data = res.data || {};

        const nom =
          data.nombre ??
          data.persona?.nombre ??
          data.usuario?.nombre ??
          data.data?.nombre ??
          null;
        const ape =
          data.apellido ??
          data.persona?.apellido ??
          data.usuario?.apellido ??
          data.data?.apellido ??
          null;

        const finalNom = normalizeStored(nom) || "";
        const finalApe = normalizeStored(ape) || "";

        setUsuario({ nombre: finalNom, apellido: finalApe });
        localStorage.setItem("nombre", finalNom);
        localStorage.setItem("apellido", finalApe);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error obtener usuario:", err?.message ?? err);
        }
      } finally {
        setLoadingUsuario(false);
      }
    };

    const fetchNotifs = async () => {
      try {
       const res = await axios.get(
  "http://localhost:3000/api/notificaciones-secretaria/count",
  { headers, signal: controller.signal }
);
        if (typeof res.data?.count === "number") {
          setNotifCount(res.data.count);
        }
      } catch {
        // si no existe endpoint, no rompe nada
      }
    };

    fetchConfig();
    fetchUsuario();
    fetchNotifs();

    return () => controller.abort();
  }, []);

  const displayName =
    usuario.nombre && usuario.apellido
      ? `${usuario.nombre} ${usuario.apellido}`
      : loadingUsuario
      ? "Cargando..."
      : "Acudiente";

  const initials = makeInitials(usuario.nombre, usuario.apellido);
  const greeting = getGreeting();

  return (
    <header className="header-acudiente">
      <div className="header-left">
        <div className="icono-colegio" aria-hidden="true">
          📚
        </div>

        <div>
          <div className="nombre-colegio">{nombreColegio || "Colegio"}</div>
          <div className="subtitulo">
            Observador Estudiantil • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="saludo-texto">
          <div className="greeting">
            {greeting}{" "}
            <span className="nombre-usuario">{usuario.nombre || "!"}</span> 👋
          </div>
          <div className="bienvenida">
            {usuario.nombre || usuario.apellido
              ? `Bienvenido de nuevo, ${displayName.split(" ")[0]}`
              : "Inicia sesión para ver tu perfil"}
          </div>
        </div>

        <button
          type="button"
          className="btn-notificaciones"
          title="Notificaciones"
          aria-label="Ver notificaciones"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon-bell"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2a7 7 0 0 0-7 7v5H4v2h16v-2h-1v-5a7 7 0 0 0-7-7zm0 18a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z" />
          </svg>
          {notifCount > 0 && <span className="badge">{notifCount}</span>}
        </button>

        <div
          className="avatar-usuario"
          title={displayName}
          aria-label="Avatar del usuario"
        >
          {initials}
        </div>
      </div>
    </header>
  );
};

export default HeaderAcudiente;
