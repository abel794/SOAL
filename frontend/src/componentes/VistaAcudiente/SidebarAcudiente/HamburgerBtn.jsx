import React from "react";
import "../SidebarAcudiente/HamburguesaBtn.css"
import "bootstrap-icons/font/bootstrap-icons.css";

const HamburgerBtn = ({ onClick, isOpen = false }) => {
  return (
    <>
      {/* Estilos inline para el botón */}
      <style>{`
       
      `}</style>

      <button
        onClick={onClick}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        title={isOpen ? "Cerrar menú" : "Abrir menú"}
        className={`hamburger-btn ${isOpen ? 'open' : ''} rounded-circle d-flex align-items-center justify-content-center`}
        style={{
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          outline: "none"
        }}
      >
        <i 
          className={`hamburger-icon bi ${isOpen ? 'bi-x-lg' : 'bi-list'} text-white`}
          style={{ 
            fontSize: "1.5rem",
            lineHeight: 1,
            transition: "transform 0.3s ease"
          }}
        ></i>
      </button>
    </>
  );
};

// Versión alternativa más minimalista
export const HamburgerBtnMinimal = ({ onClick, isOpen = false }) => {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      className="btn bg-white bg-opacity-10 backdrop-blur border-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
      style={{
        width: "42px",
        height: "42px",
        transition: "all 0.2s ease"
      }}
    >
      <div className="position-relative" style={{ width: "20px", height: "16px" }}>
        <span 
          className="position-absolute bg-white rounded"
          style={{
            width: "100%",
            height: "2px",
            top: isOpen ? "50%" : "0",
            left: "0",
            transform: isOpen ? "rotate(45deg)" : "none",
            transformOrigin: "center",
            transition: "all 0.3s ease"
          }}
        ></span>
        <span 
          className="position-absolute bg-white rounded"
          style={{
            width: "100%",
            height: "2px",
            top: "50%",
            left: "0",
            opacity: isOpen ? "0" : "1",
            transform: "translateY(-50%)",
            transition: "all 0.3s ease"
          }}
        ></span>
        <span 
          className="position-absolute bg-white rounded"
          style={{
            width: "100%",
            height: "2px",
            bottom: isOpen ? "50%" : "0",
            left: "0",
            transform: isOpen ? "rotate(-45deg)" : "none",
            transformOrigin: "center",
            transition: "all 0.3s ease"
          }}
        ></span>
      </div>
    </button>
  );
};

// Versión con solo ícono (sin fondo)
export const HamburgerIconOnly = ({ onClick, isOpen = false, size = "md" }) => {
  const sizes = {
    sm: { button: "36px", icon: "1.2rem" },
    md: { button: "42px", icon: "1.4rem" },
    lg: { button: "48px", icon: "1.6rem" }
  };

  const { button: btnSize, icon: iconSize } = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      className="btn btn-link p-0 d-flex align-items-center justify-content-center text-decoration-none"
      style={{
        width: btnSize,
        height: btnSize,
        transition: "all 0.3s ease",
        color: "#667eea"
      }}
    >
      <i 
        className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}
        style={{ 
          fontSize: iconSize,
          transition: "transform 0.3s ease",
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))"
        }}
      ></i>
    </button>
  );
};

export default HamburgerBtn;