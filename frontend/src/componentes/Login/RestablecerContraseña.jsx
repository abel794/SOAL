// frontend/src/componentes/Login/RestablecerContraseña.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../componentes/Login/style/RestablecerContraseña.css';
import logo from '../../assets/image.png';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import './RestablecerContraseña.css'

const RestablecerContraseña = () => {
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  // 🔹 Capturamos el token de la URL
  const { token } = useParams();

  const esSegura = nueva.length >= 8;
  const coincide = nueva === confirmacion;

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!esSegura || !coincide) return;

    try {
      // 🔹 URL actualizada al backend en puerto 3001
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/restablecer-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nueva }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ tipo: 'exito', texto: '✅ Contraseña restablecida con éxito' });
        setTimeout(() => navigate('/'), 2500);
      } else {
        setMensaje({ tipo: 'error', texto: `❌ ${data.mensaje}` });
      }
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'error', texto: '❌ Error de conexión con el servidor' });
    }
  };

  return (
    <div className="pagina-restablecer">
      <div className="contenedor-formulario">
        <div className="formulario">
          <img src={logo} alt="Logo" className="logo" />
          <h4>Actualice su nueva contraseña</h4>
          <form onSubmit={manejarEnvio}>
            <CampoTexto
              etiqueta="Contraseña"
              tipo="password"
              placeholder="••••••••"
              valor={nueva}
              onChange={(e) => setNueva(e.target.value)}
            />

            <CampoTexto
              etiqueta="Confirme su Contraseña"
              tipo="password"
              placeholder="••••••••"
              valor={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
            />

            {nueva && (
              <p className={esSegura ? 'mensaje-verde' : 'mensaje-rojo'}>
                {esSegura
                  ? '¡Bien hecho! Tu contraseña es segura.'
                  : 'Tu contraseña debe tener al menos 8 caracteres.'}
              </p>
            )}

            {!coincide && confirmacion && (
              <p className="mensaje-rojo">Las contraseñas no coinciden.</p>
            )}

            {mensaje && (
              <p className={mensaje.tipo === 'exito' ? 'mensaje-verde' : 'mensaje-rojo'}>
                {mensaje.texto}
              </p>
            )}

            <Boton texto="Restablecer contraseña" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContraseña;
