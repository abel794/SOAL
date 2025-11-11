// src/components/ui/ModalMensaje.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ModalMensaje.css";

export default function ModalMensaje({
  visible,
  tipo = "info",
  titulo,
  mensaje,
  onClose,
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cancelar"
}) {
  if (!visible) return null;

  const iconos = {
    exito: "✅",
    error: "❌",
    advertencia: "⚠️",
    info: "ℹ️",
    confirmacion: "❔"
  };

  const colores = {
    exito: "modal-success",
    error: "modal-error", 
    advertencia: "modal-warning",
    info: "modal-info",
    confirmacion: "modal-confirm"
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`modal-container ${colores[tipo]}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <span className="modal-icon">{iconos[tipo]}</span>
            <h3 className="modal-title">{titulo}</h3>
          </div>
          
          <div className="modal-body">
            <p>{mensaje}</p>
          </div>

          <div className="modal-footer">
            {tipo === "confirmacion" ? (
              <>
                <button className="btn btn-secondary" onClick={onClose}>
                  {cancelText}
                </button>
                <button className="btn btn-primary" onClick={onConfirm}>
                  {confirmText}
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={onClose}>
                Cerrar
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}