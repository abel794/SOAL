// src/componentes/Coordinador/Common/LogoutModal.jsx
import React from 'react';

export default function LogoutModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg rounded-3 animate__animated animate__zoomIn">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Confirmar cierre de sesión
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body text-center">
            <p className="mb-3 fs-5">
              ¿Estás seguro que deseas{' '}
              <strong>cerrar tu sesión</strong>?
            </p>
            <small className="text-muted">
              Si cierras sesión, tendrás que iniciar nuevamente para
              acceder al sistema.
            </small>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              className="btn btn-outline-secondary px-4"
              onClick={onCancel}
            >
              No, quedarme
            </button>
            <button
              className="btn btn-danger px-4"
              onClick={onConfirm}
            >
              Sí, cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}