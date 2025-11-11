import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaSearch,
  FaRegStickyNote,
  FaClipboardList,
  FaCalendarAlt,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserTie,
  FaCog,
  FaBell,
  FaChevronDown,
  FaPlus
} from "react-icons/fa";
import "./UserHeader.css";

/**
 * Utils - Funciones auxiliares
 */

// Normaliza texto: quita tildes, trim y convierte a Title Case
const normalizeStored = (raw) => {
  if (!raw && raw !== 0) return null;
  
  const s = String(raw)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

// Construye la fuente de imagen desde base64 o data URL
const buildImgSrc = (foto) => {
  if (!foto || typeof foto !== "string") return null;
  
  const s = foto.trim();
  
  // Si ya es una data URL, retornar directamente
  if (/^data:image\//i.test(s)) return s;
  
  // Limpiar espacios y verificar si es base64 válido
  const cleaned = s.replace(/\s+/g, "");
  
  // Verificar si es base64 (caracteres válidos y longitud mínima)
  if (/^[A-Za-z0-9+/=]+$/.test(cleaned) && cleaned.length >= 100) {
    return `data:image/jpeg;base64,${cleaned}`;
  }
  
  return null;
};

// Genera iniciales desde nombre y apellido
const makeInitials = (nombre = "", apellido = "") => {
  const ni = nombre.trim().charAt(0) || "";
  const ai = apellido.trim().charAt(0) || "";
  return (ni + ai).toUpperCase() || "U";
};

/**
 * Componente Principal
 */
export default function UserHeader({ onActionSelect }) {
  const [usuario, setUsuario] = useState({ 
    nombre: "", 
    apellido: "", 
    foto: "" 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const mountedRef = useRef(true);
  const dropdownRef = useRef(null);

  // Opciones rápidas más comunes
  const quickActions = [
    {
      label: "Buscar estudiante",
      icon: <FaSearch />,
      description: "Buscar información de estudiantes",
      color: "#3498db",
      action: "Buscar estudiante"
    },
    {
      label: "Registrar observación",
      icon: <FaRegStickyNote />,
      description: "Agregar nueva observación",
      color: "#e74c3c",
      action: "Registrar observación"
    },
    {
      label: "Agendar cita",
      icon: <FaCalendarAlt />,
      description: "Programar cita con acudiente",
      color: "#9b59b6",
      action: "Agendar cita con acudiente"
    },
    {
      label: "Matricular estudiante",
      icon: <FaGraduationCap />,
      description: "Nueva matrícula",
      color: "#2ecc71",
      action: "Matricular estudiante"
    },
    {
      label: "Registrar profesor",
      icon: <FaChalkboardTeacher />,
      description: "Agregar nuevo profesor",
      color: "#f39c12",
      action: "Registrar profesor"
    },
    {
      label: "Historial observaciones",
      icon: <FaClipboardList />,
      description: "Ver todas las observaciones",
      color: "#1abc9c",
      action: "Historial de Observaciones"
    }
  ];

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cache keys
  const CACHE_KEYS = {
    NOMBRE: "user_nombre",
    APELLIDO: "user_apellido", 
    FOTO: "user_foto",
    TIMESTAMP: "user_data_timestamp"
  };

  // Verificar si el cache es válido (5 minutos)
  const isCacheValid = () => {
    const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
    if (!timestamp) return false;
    
    const now = Date.now();
    const cacheTime = parseInt(timestamp, 10);
    return (now - cacheTime) < 5 * 60 * 1000; // 5 minutos
  };

  // Guardar en cache
  const saveToCache = (data) => {
    try {
      localStorage.setItem(CACHE_KEYS.NOMBRE, data.nombre);
      localStorage.setItem(CACHE_KEYS.APELLIDO, data.apellido);
      localStorage.setItem(CACHE_KEYS.FOTO, data.foto);
      localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
    } catch (err) {
      console.warn("Error guardando en cache:", err);
    }
  };

  // Obtener del cache
  const getFromCache = () => {
    try {
      const nombre = localStorage.getItem(CACHE_KEYS.NOMBRE) || "";
      const apellido = localStorage.getItem(CACHE_KEYS.APELLIDO) || "";
      const foto = localStorage.getItem(CACHE_KEYS.FOTO) || "";
      return { nombre, apellido, foto };
    } catch (err) {
      console.warn("Error leyendo cache:", err);
      return { nombre: "", apellido: "", foto: "" };
    }
  };

  // Fetch datos del usuario
  const fetchUsuario = async (token) => {
    if (!token) {
      throw new Error("No hay token disponible");
    }

    try {
      const response = await axios.get("http://localhost:3000/api/usuarios/me", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 segundos timeout
      });

      const data = response.data || {};

      // Extraer nombre de diferentes estructuras posibles
      const nom = 
        data.nombre ??
        data.Nombre ??
        data.persona?.nombre ??
        data.Persona?.nombre ??
        data.usuario?.persona?.nombre ??
        null;

      // Extraer apellido de diferentes estructuras posibles  
      const ape =
        data.apellido ??
        data.Apellido ??
        data.persona?.apellido ??
        data.Persona?.apellido ??
        data.usuario?.persona?.apellido ??
        null;

      // Extraer foto de diferentes estructuras posibles
      const foto =
        data.foto ??
        data.Foto ??
        data.persona?.foto ??
        data.Persona?.foto ??
        data.usuario?.persona?.foto ??
        "";

      const finalNom = normalizeStored(nom) || "";
      const finalApe = normalizeStored(ape) || "";

      return {
        nombre: finalNom,
        apellido: finalApe,
        foto: foto || ""
      };
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        throw new Error("Tiempo de espera agotado");
      }
      
      if (err.response?.status === 401) {
        throw new Error("Sesión expirada");
      }
      
      throw new Error(err.response?.data?.message || err.message || "Error desconocido");
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);

    const initializeUserData = async () => {
      const token = localStorage.getItem("token");

      // 1. Intentar usar cache válido primero
      if (isCacheValid()) {
        const cachedData = getFromCache();
        if (mountedRef.current) {
          setUsuario(cachedData);
          setLoading(false);
        }
        return;
      }

      // 2. Si no hay token, usar valores por defecto
      if (!token) {
        if (mountedRef.current) {
          setUsuario({ nombre: "", apellido: "", foto: "" });
          setLoading(false);
        }
        return;
      }

      // 3. Fetch desde API
      try {
        const userData = await fetchUsuario(token);
        
        if (mountedRef.current) {
          setUsuario(userData);
          saveToCache(userData);
          setImgError(false);
        }
      } catch (err) {
        console.error("Error obteniendo datos del usuario:", err.message);
        
        if (mountedRef.current) {
          setError(err.message);
          // En caso de error, intentar usar cache aunque sea viejo
          const cachedData = getFromCache();
          if (cachedData.nombre || cachedData.apellido) {
            setUsuario(cachedData);
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeUserData();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Manejar acción rápida
  const handleQuickAction = (action) => {
    if (onActionSelect) {
      onActionSelect(action);
    }
    setShowQuickActions(false);
  };

  // Datos para mostrar
  const displayName = usuario.nombre || usuario.apellido 
    ? `${usuario.nombre}${usuario.apellido ? " " + usuario.apellido : ""}`.trim()
    : "Coordinador";

  const initials = makeInitials(usuario.nombre, usuario.apellido);
  const imgSrc = !imgError ? buildImgSrc(usuario.foto) : null;

  return (
    <div className="usuario-header uh-root" role="banner">
      <div className="uh-content">
        {/* Información de texto */}
        <div className="uh-text" aria-live="polite">
          {loading ? (
            <div className="uh-loading">
              <div className="uh-loading-spinner"></div>
              Cargando información...
            </div>
          ) : error ? (
            <div className="uh-error" role="alert">
              <span className="uh-error-icon">⚠️</span>
              <div>
                <strong>Error al cargar datos</strong>
                <small>{error}</small>
              </div>
            </div>
          ) : (
            <>
              <h1 className="uh-title">{displayName}</h1>
              <div className="uh-role">Coordinador Académico</div>
              <div className="uh-school">
                <span className="uh-school-icon">🏫</span>
                Instituto Renato Descartes
              </div>
              
              {/* Acciones rápidas */}
              <div className="uh-quick-actions">
                <div 
                  className="uh-quick-actions-toggle"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                >
                  <FaPlus className="uh-quick-actions-icon" />
                  <span>Acciones rápidas</span>
                  <FaChevronDown className={`uh-chevron ${showQuickActions ? 'rotated' : ''}`} />
                </div>
                
                {showQuickActions && (
                  <div className="uh-quick-actions-dropdown" ref={dropdownRef}>
                    <div className="uh-quick-actions-header">
                      <h4>Acciones frecuentes</h4>
                      <small>Selecciona una acción rápida</small>
                    </div>
                    
                    <div className="uh-quick-actions-grid">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          className="uh-quick-action-btn"
                          onClick={() => handleQuickAction(action.action)}
                          style={{ '--action-color': action.color }}
                        >
                          <div 
                            className="uh-quick-action-icon"
                            style={{ backgroundColor: action.color }}
                          >
                            {action.icon}
                          </div>
                          <div className="uh-quick-action-content">
                            <span className="uh-quick-action-title">
                              {action.label}
                            </span>
                            <span className="uh-quick-action-desc">
                              {action.description}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <div className="uh-avatar-container">
          <div 
            className={`uh-avatar ${imgSrc ? 'has-image' : 'no-image'}`}
            title={displayName}
            aria-label={`Foto de perfil de ${displayName}`}
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={`Foto de perfil de ${displayName}`}
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <span className="uh-initials">{initials}</span>
            )}
          </div>
          
          {/* Estado en línea */}
          <div className="uh-status" title="En línea">
            <div className="uh-status-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}