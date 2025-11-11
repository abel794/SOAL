import React from "react";
import { FiMenu } from "react-icons/fi";
import './HamburgerBtn.css'

const HamburgerBtn = ({ onClick }) => {
  return (
    <button className="hamburger-btn d-md-none " onClick={onClick} aria-label="Abrir menú" title="Abrir menú">
      <FiMenu />
    </button>
  );
};

export default HamburgerBtn;