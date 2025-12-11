// components/ModalCerrarSesion.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

export default function ModalCerrarSesion({ abierto, onClose, onConfirm }) {
  return (
    <Modal show={abierto} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">🔒 Cerrar Sesión</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <p className="m-0">¿Estás seguro de que quieres cerrar sesión?</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        <Button variant="primary" onClick={onConfirm}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
