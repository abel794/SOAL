// HamburgerBtn.jsx
import React from "react";
import "./HamburgerBtn.css";

const HamburgerBtn = ({ onClick }) => {
  return (
    <button 
      className="hamburger-btn d-md-none"
      onClick={onClick}
      aria-label="Abrir menú"
    >
      <i className="bi bi-list"></i>
    </button>
  );
};

export default HamburgerBtn;