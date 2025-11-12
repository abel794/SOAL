import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarraLateralSecretaria from '../Menu/BarraLateralSecretaria';
import MatricularEstudiante from '../MatricularEstudiante/MatricularEstudiante'; 
import ResponderPQR from '../Pqr/ResponderPQR';
import './style/SecretariaInicio.css';
import {
  FaUsers,
  FaGraduationCap,
  FaCommentDots,
  FaBell,
  FaSearch,
  FaCogs,
  FaChartLine,
  FaUserPlus,
  FaComments,
  FaCog
} from 'react-icons/fa';
import { HiUserAdd } from "react-icons/hi";
import DashboardSecretaria from '../DashBoard/DashboardSecretaria';
import BuscarEstudiantes from '../Estudiantes/BuscarEstudiantes';
import NotificacionesSecretaria from '../Notificaciones/NotificacionesSecretaria';
import ConfiguracionSecretaria from '../Configuracion/ConfiguracionSecretaria';
import Header from '../headerSecretaria/Header';

const SecretariaInicio = () => {
  const [vista, setVista] = useState("inicio");
  const [activeCard, setActiveCard] = useState(null);
  const [resumen, setResumen] = useState({
    estudiantes: 0,
    docentes: 0,
    reportes: 0
  });

  // 🔹 Cargar datos desde la API
  const fetchResumen = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/dashboard-secretaria/resumen");
      setResumen(res.data);
    } catch (error) {
      console.error("Error al obtener el resumen:", error);
    }
  };

  useEffect(() => {
    fetchResumen();
  }, []);

  // Datos de las tarjetas del dashboard
  const features = [
    {
      id: "dashboard",
      icon: <FaChartLine className="feature-icon" />,
      title: "Dashboard Analytics",
      description: "Métricas y estadísticas en tiempo real del sistema",
      vista: "Dashboard",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      accent: "#667eea"
    },
    {
      id: "estudiantes",
      icon: <FaGraduationCap className="feature-icon" />,
      title: "Gestión Estudiantil",
      description: "Administra y consulta información de estudiantes",
      vista: "estudiantes",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      accent: "#f5576c"
    },
    {
      id: "notificaciones",
      icon: <FaBell className="feature-icon" />,
      title: "Centro de Notificaciones",
      description: "Comunícate con estudiantes y acudientes",
      vista: "notificaciones",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      accent: "#4facfe"
    },
    {
      id: "pqr",
      icon: <FaComments className="feature-icon" />,
      title: "Gestión PQR",
      description: "Atiende peticiones, quejas y reclamos",
      vista: "ResponderPQR",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      accent: "#43e97b"
    },
    {
      id: "matriculas",
      icon: <FaUserPlus className="feature-icon" />,
      title: "Proceso de Matrículas",
      description: "Gestiona nuevas matriculas estudiantiles",
      vista: "matriculas",
      color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      accent: "#fa709a"
    },
    {
      id: "configuracion",
      icon: <FaCog className="feature-icon" />,
      title: "Configuración del Sistema",
      description: "Personaliza preferencias y ajustes",
      vista: "configuracion",
      color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      accent: "#a8edea"
    }
  ];

  const handleCardClick = (vista, id) => {
    setActiveCard(id);
    setTimeout(() => {
      setVista(vista);
      setActiveCard(null);
    }, 300);
  };

  const handleCardHover = (id) => setActiveCard(id);
  const handleCardLeave = () => setActiveCard(null);

  return (
    <div className="modern-layout">
      {/* Barra Lateral */}
      <BarraLateralSecretaria setVista={setVista} />
      
      {/* Contenido Principal */}
      <div className="main-content">
        {/* Header */}
        {vista === "inicio" && <Header />}
        
        {/* Vista de Inicio */}
        {vista === "inicio" && (
          <div className="dashboard-container">
            {/* Hero Section */}
            <div className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  Bienvenida, <span className="gradient-text">Secretaría</span>
                </h1>
                <p className="hero-subtitle">
                  Panel de control central del sistema educativo institucional
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">{resumen.estudiantes}</span>
                    <span className="stat-label">Estudiantes Activos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{resumen.docentes}</span>
                    <span className="stat-label">Docentes Registrados</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{resumen.reportes}</span>
                    <span className="stat-label">Reportes Totales</span>
                  </div>
                </div>
              </div>
              <div className="hero-graphic">
                <div className="floating-elements">
                  <div className="floating-element element-1">🎓</div>
                  <div className="floating-element element-2">📚</div>
                  <div className="floating-element element-3">⭐</div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="features-section">
              <div className="section-header">
                <h2>Módulos del Sistema</h2>
                <p>Accede a todas las funcionalidades administrativas</p>
              </div>

              <div className="features-grid">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`feature-card ${activeCard === feature.id ? 'active' : ''}`}
                    onClick={() => handleCardClick(feature.vista, feature.id)}
                    onMouseEnter={() => handleCardHover(feature.id)}
                    onMouseLeave={handleCardLeave}
                    style={{ 
                      '--card-gradient': feature.color,
                      '--card-accent': feature.accent
                    }}
                  >
                    <div className="card-icon-wrapper">
                      {feature.icon}
                    </div>
                    <div className="card-content">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                    <div className="card-hover-effect"></div>
                    <div className="card-arrow">
                      <span>→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-info">
                  <span className="stat-value">45</span>
                  <span className="stat-label">Nuevos este mes</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBell />
                </div>
                <div className="stat-info">
                  <span className="stat-value">23</span>
                  <span className="stat-label">Notificaciones pendientes</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaComments />
                </div>
                <div className="stat-info">
                  <span className="stat-value">8</span>
                  <span className="stat-label">PQR por responder</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Otras Vistas */}
        {vista === "matriculas" && <MatricularEstudiante />}
        {vista === "ResponderPQR" && <ResponderPQR />}
        {vista === "Dashboard" && <DashboardSecretaria />}
        {vista === "estudiantes" && <BuscarEstudiantes />}
        {vista === "notificaciones" && <NotificacionesSecretaria />}
        {vista === "configuracion" && <ConfiguracionSecretaria />}
      </div>
    </div>
  );
};

export default SecretariaInicio;
