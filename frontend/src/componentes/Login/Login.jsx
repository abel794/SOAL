import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import '../Login/style/LoginFormulario.css';
import '../Login/style/CampoTexto.css';
import '../Login/style/Boton.css';
import logo from '../../assets/image.png';

// Mapeo de tipos de usuario
const rolesMapping = {
  1: 'Estudiante',
  2: 'Acudiente',
  3: 'Profesor',
  4: 'Coordinador',
  5: 'Secretaria',
  6: 'Administrativo',
  7: 'Rector',
  8: 'Orientador'
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos los campos que espera el backend
        body: JSON.stringify({
          username: username,
          contrasena: contrasena
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Se asume que el backend devuelve los datos del usuario en data.usuario,
        // y que el campo "id_tipo_usuario" es un número, ej. 4 para Coordinador.
        const id_tipo_usuario = data.usuario.id_tipo_usuario;
        // Convertimos el número a su representación textual usando nuestro mapping.
        const rol = rolesMapping[id_tipo_usuario];

        // Guardar el usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        // Redirigir según el rol permitido. Aquí permitimos Coordinador, Rector y Administrativo.
        if (rol === 'Coordinador' || rol === 'Rector' || rol === 'Administrativo') {
          navigate('/coordinador');
        } else {
          alert(`🔒 Tu rol (${rol}) no tiene acceso a este panel.`);
        }
      } else {
        // Si hay error, se muestra el mensaje devuelto por el backend.
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('⚠️ Error de conexión con el servidor');
    }
  };

  return (
    <div className="fondo-login">
      <form className="formulario-login" onSubmit={manejarEnvio}>
        <img src={logo} alt="Logo" className="logo-login" />
        <h2>¡Ingresar! <span>🎓</span></h2>
        <p>Entra tu cuenta</p>

        <CampoTexto
          etiqueta="Nombre de usuario"
          tipo="text"
          placeholder="ej: juan.perez"
          valor={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <CampoTexto
          etiqueta="Contraseña"
          tipo="password"
          placeholder="••••••••"
          valor={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <p className="enlace-texto">¿Olvidaste tu contraseña?</p>

        <Boton texto="Iniciar sesión" />

        <p className="texto-pequeño">
          Al iniciar sesión, aceptas nuestras
          <a href="#"> Políticas de Privacidad</a> y
          <a href="#"> Términos de Servicio</a>.
        </p>

        <p className="texto-pequeño">
          ¿No tienes cuenta? <a href="#">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
