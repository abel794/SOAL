import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaBars } from "react-icons/fa";
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
  FaPlus,
  FaExclamationTriangle,
  FaSync,
  FaCheckCircle,
  FaUserCircle
} from "react-icons/fa";
import "./UserHeader.css";
import Sidebar from "../Sidebar/Sidebar"

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
  if (/^data:image\//i.test(s)) {
    // Optimizar: si es base64 muy grande, considerar usar placeholder
    if (s.length > 50000) {
      console.warn("Imagen base64 muy grande, considerar optimización");
    }
    return s;
  }
  
  // Limpiar espacios y verificar si es base64 válido
  const cleaned = s.replace(/\s+/g, "");
  
  // Verificar si es base64 (caracteres válidos y longitud mínima)
  if (/^[A-Za-z0-9+/=]+$/.test(cleaned) && cleaned.length >= 100) {
    // Si es muy grande, usar calidad reducida
    if (cleaned.length > 100000) {
      console.warn("Imagen base64 muy pesada para avatar");
    }
    return `data:image/jpeg;base64,${cleaned}`;
  }
  
  // Si parece una URL, retornarla
  if (s.startsWith('http') || s.startsWith('/')) {
    return s;
  }
  
  return null;
};

// Genera iniciales desde nombre y apellido
const makeInitials = (nombre = "", apellido = "") => {
  const ni = nombre.trim().charAt(0) || "";
  const ai = apellido.trim().charAt(0) || "";
  return (ni + ai).toUpperCase() || "U";
};

// Componente Skeleton Loader
const SkeletonLoader = ({ type = "text", width = "100%", height = "1rem" }) => {
  return (
    <div 
      className={`uh-skeleton uh-skeleton-${type}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

// Componente Loading Spinner
const LoadingSpinner = ({ size = "medium" }) => {
  const sizes = {
    small: "16px",
    medium: "24px",
    large: "32px"
  };

  return (
    <div 
      className="uh-loading-spinner"
      style={{ 
        width: sizes[size], 
        height: sizes[size] 
      }}
      aria-label="Cargando..."
    >
      <div className="uh-spinner-inner"></div>
    </div>
  );
};

/**
 * Componente Principal
 */
export default function UserHeader({ onActionSelect, onToggleSidebar, sidebarOpen = false }) {
  const [usuario, setUsuario] = useState({ 
    nombre: "", 
    apellido: "", 
    foto: "" 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const mountedRef = useRef(true);
  const dropdownRef = useRef(null);

  const MAX_RETRIES = 3;

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

  // Cache keys
  const CACHE_KEYS = {
    NOMBRE: "user_nombre",
    APELLIDO: "user_apellido", 
    FOTO: "user_foto",
    TIMESTAMP: "user_data_timestamp"
  };

  // Verificar si el cache es válido (5 minutos)
  const isCacheValid = useCallback(() => {
    const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
    if (!timestamp) return false;
    
    const now = Date.now();
    const cacheTime = parseInt(timestamp, 10);
    return (now - cacheTime) < 5 * 60 * 1000; // 5 minutos
  }, [CACHE_KEYS.TIMESTAMP]);

  // Guardar en cache
  const saveToCache = useCallback((data) => {
    try {
      localStorage.setItem(CACHE_KEYS.NOMBRE, data.nombre);
      localStorage.setItem(CACHE_KEYS.APELLIDO, data.apellido);
      localStorage.setItem(CACHE_KEYS.FOTO, data.foto);
      localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
    } catch (err) {
      console.warn("Error guardando en cache:", err);
    }
  }, [CACHE_KEYS]);

  // Obtener del cache
  const getFromCache = useCallback(() => {
    try {
      const nombre = localStorage.getItem(CACHE_KEYS.NOMBRE) || "";
      const apellido = localStorage.getItem(CACHE_KEYS.APELLIDO) || "";
      const foto = localStorage.getItem(CACHE_KEYS.FOTO) || "";
      return { nombre, apellido, foto };
    } catch (err) {
      console.warn("Error leyendo cache:", err);
      return { nombre: "", apellido: "", foto: "" };
    }
  }, [CACHE_KEYS]);

  // Fetch datos del usuario
  const fetchUsuario = useCallback(async (token) => {
    if (!token) {
      throw new Error("No hay token disponible");
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/usuarios/me`, {
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
      
      if (err.response?.status === 404) {
        throw new Error("Usuario no encontrado");
      }
      
      throw new Error(err.response?.data?.message || err.message || "Error desconocido");
    }
  }, []);

  // Función para inicializar datos
  const initializeUserData = useCallback(async () => {
    const token = localStorage.getItem("token");

    // 1. Intentar usar cache válido primero
    if (isCacheValid() && retryCount === 0) {
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
        setUsuario({ 
          nombre: "Usuario", 
          apellido: "", 
          foto: "" 
        });
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
        setError(null);
        setRetryCount(0); // Resetear contador en éxito
      }
    } catch (err) {
      console.error("Error obteniendo datos del usuario:", err.message);
      
      if (mountedRef.current) {
        setError(err.message);
        
        // Intentar reintentar si es error de red
        if (err.message.includes("red") || err.message.includes("tiempo") || err.code === 'ECONNABORTED' || err.message.includes("Network Error")) {
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => {
              if (mountedRef.current) {
                setRetryCount(prev => prev + 1);
              }
            }, 2000 * (retryCount + 1)); // Backoff exponencial
          }
        }
        
        // En caso de error, intentar usar cache aunque sea viejo
        const cachedData = getFromCache();
        if (cachedData.nombre || cachedData.apellido) {
          setUsuario(cachedData);
        } else {
          // Datos por defecto si no hay cache
          setUsuario({ 
            nombre: "Usuario", 
            apellido: "", 
            foto: "" 
          });
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [isCacheValid, retryCount, getFromCache, fetchUsuario, saveToCache]);

  // Efecto principal para cargar datos
  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);

    initializeUserData();

    return () => {
      mountedRef.current = false;
    };
  }, [initializeUserData]);

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

  // Detectar cambios en conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Manejar cambios en el token
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token eliminado, limpiar cache
        localStorage.removeItem(CACHE_KEYS.NOMBRE);
        localStorage.removeItem(CACHE_KEYS.APELLIDO);
        localStorage.removeItem(CACHE_KEYS.FOTO);
        localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
        
        if (mountedRef.current) {
          setUsuario({ nombre: "", apellido: "", foto: "" });
          setLoading(true);
          initializeUserData();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initializeUserData, CACHE_KEYS]);

  // Manejar acción rápida
  const handleQuickAction = (action) => {
    console.log("Acción seleccionada:", action);
    if (onActionSelect) {
      onActionSelect(action);
    }
    setShowQuickActions(false);
  };

  // Reintentar carga
  const handleRetry = () => {
    setRetryCount(0);
    setLoading(true);
    setError(null);
    initializeUserData();
  };

  // Datos para mostrar
  const displayName = usuario.nombre || usuario.apellido 
    ? `${usuario.nombre}${usuario.apellido ? " " + usuario.apellido : ""}`.trim()
    : "Coordinador";

  const initials = makeInitials(usuario.nombre, usuario.apellido);
  const imgSrc = !imgError ? buildImgSrc(usuario.foto) : null;

  return (
    <div className={`usuario-header uh-root ${sidebarOpen ? 'sidebar-open' : ''}`} role="banner">
      <div className="uh-content">
        <button
          className="uh-hamburger"
          onClick={onToggleSidebar}
          aria-label="Alternar menú lateral"
          aria-expanded={sidebarOpen}
          aria-controls="main-sidebar"
        >
          <FaBars />
        </button>
        
        {/* Información de texto */}
        <div className="uh-text" aria-live="polite">
          {loading ? (
            <div className="uh-loading">
              <LoadingSpinner size="medium" />
              <div className="uh-loading-content">
                <SkeletonLoader width="200px" height="32px" />
                <SkeletonLoader width="150px" height="20px" />
                <SkeletonLoader width="180px" height="18px" />
              </div>
            </div>
          ) : error ? (
            <div className="uh-error" role="alert">
              <div className="uh-error-icon">
                <FaExclamationTriangle />
              </div>
              <div className="uh-error-content">
                <strong>Error al cargar datos</strong>
                <small>{error}</small>
                <button 
                  className="uh-retry-btn"
                  onClick={handleRetry}
                  disabled={retryCount >= MAX_RETRIES}
                >
                  <FaSync /> Reintentar
                  {retryCount > 0 && <span>({retryCount}/{MAX_RETRIES})</span>}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="uh-title">
                {displayName}
                {!isOnline && (
                  <span className="uh-offline-badge" title="Modo sin conexión">
                    <FaUserCircle /> Offline
                  </span>
                )}
              </h1>
              <div className="uh-role">Coordinador Académico</div>
              <div className="uh-school">
                <span className="uh-school-icon">🏫</span>
                Instituto Renato Descartes
              </div>
              
              {/* Acciones rápidas */}
              <div className="uh-quick-actions" aria-label="Acciones rápidas">
                <div 
                  className="uh-quick-actions-toggle"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setShowQuickActions(!showQuickActions);
                      e.preventDefault();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={showQuickActions}
                  aria-haspopup="menu"
                >
                  <FaPlus className="uh-quick-actions-icon" />
                  <span>Acciones rápidas</span>
                  <FaChevronDown className={`uh-chevron ${showQuickActions ? 'rotated' : ''}`} />
                </div>
                
                {showQuickActions && (
                  <div 
                    className="uh-quick-actions-dropdown" 
                    ref={dropdownRef}
                    role="menu"
                    aria-label="Menú de acciones rápidas"
                  >
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
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleQuickAction(action.action);
                              e.preventDefault();
                            }
                          }}
                          style={{ '--action-color': action.color }}
                          role="menuitem"
                          tabIndex={0}
                        >
                          <div 
                            className="uh-quick-action-icon"
                            style={{ backgroundColor: action.color }}
                            aria-hidden="true"
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
                    
                    <div className="uh-quick-actions-footer">
                      <button 
                        className="uh-view-all-btn"
                        onClick={() => {
                          if (onActionSelect) onActionSelect("Ver todas las acciones");
                          setShowQuickActions(false);
                        }}
                      >
                        Ver todas las acciones →
                      </button>
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
            className={`uh-avatar ${imgSrc ? 'has-image' : 'no-image'} ${loading ? 'loading' : ''}`}
            title={displayName}
            aria-label={`Foto de perfil de ${displayName}`}
            role="img"
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={`Foto de perfil de ${displayName}`}
                onError={() => setImgError(true)}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="uh-initials">{initials}</span>
            )}
            {loading && <div className="uh-avatar-loading"></div>}
          </div>
          
          {/* Estado en línea */}
          <div 
            className={`uh-status ${isOnline ? 'online' : 'offline'}`} 
            title={isOnline ? "En línea" : "Sin conexión"}
            aria-label={isOnline ? "Estado: En línea" : "Estado: Sin conexión"}
          >
            <div className="uh-status-dot"></div>
            <span className="uh-status-text">
              {isOnline ? 'En línea' : 'Offline'}
            </span>
          </div>
          
          {/* Notificaciones */}
          <button 
            className="uh-notifications-btn"
            aria-label="Notificaciones"
            onClick={() => onActionSelect && onActionSelect("Notificaciones")}
          >
            <FaBell />
            <span className="uh-notifications-badge">3</span>
          </button>
        </div>
      </div>
      
      {/* Indicador de conexión */}
      {!isOnline && (
        <div className="uh-connection-alert" role="alert">
          <FaExclamationTriangle />
          <span>Estás trabajando en modo sin conexión. Algunas funciones pueden estar limitadas.</span>
        </div>
      )}
    </div>
  );
}