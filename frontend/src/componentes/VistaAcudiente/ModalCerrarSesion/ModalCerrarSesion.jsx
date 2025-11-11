// components/ModalCerrarSesion.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import './ModalCerrarSesion.css'

export default function ModalCerrarSesion({ abierto, onClose, onConfirm }) {
  return (
    <Modal show={abierto} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>🔒 Cerrar Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que quieres cerrar sesión?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
