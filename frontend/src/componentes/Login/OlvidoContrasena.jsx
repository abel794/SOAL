import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../componentes/Login/style/RestablecerContraseña.css';
import logo from '../../assets/image.png';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import './OlvidoContrasena.css'

const OlvidoContrasena = () => {
  const [username, setUsername] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      // ⚠️ Cambiamos el puerto al del backend (3001)
      const res = await fetch('http://localhost:3000/api/auth/olvido-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ tipo: 'exito', texto: '✅ Revisa tu correo para restablecer la contraseña' });
        setTimeout(() => navigate('/'), 3000);
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
      <div className="formulario-login">
        <div className="formulario">
          <img src={logo} alt="Logo" className="logo" />
          <h4>Recuperar tu contraseña</h4>
          <form onSubmit={manejarEnvio}>
            <CampoTexto
              etiqueta="Correo electrónico"
              tipo="email"
              placeholder="ejemplo@correo.com"
              valor={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {mensaje && (
              <p className={mensaje.tipo === 'exito' ? 'mensaje-verde' : 'mensaje-rojo'}>
                {mensaje.texto}
              </p>
            )}

            <Boton texto="Enviar enlace" />
          </form>
          <p className="login-link">
            ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OlvidoContrasena;
