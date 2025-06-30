import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // para redireccionar
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import './style/LoginFormulario.css';

const LoginFormulario = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/autenticacion/iniciar-sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_usuario: correo,
          clave: clave
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const rol = data.usuario.rol;

        // Guardar usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        // Redirección según el rol
        if (rol === 'Coordinador' || rol === 'Rector' || rol === 'Administrativo') {
          navigate('/coordinador');
        } else {
          alert('🔒 Tu rol no tiene acceso a este panel');
        }
      } else {
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
        <h2>¡Conectemos! <span>📡</span></h2>
        <p>Entra tu cuenta</p>

        <CampoTexto
          etiqueta="Correo electrónico"
          tipo="text"
          valor={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <CampoTexto
          etiqueta="Contraseña"
          tipo="password"
          placeholder="••••••••"
          valor={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        <a className="enlace" href="#">¿Olvidaste tu contraseña?</a>

        <Boton texto="Iniciar sesión" />

        <p className="texto-pequeño">
          Al iniciar sesión, aceptas nuestras
          <a href="#"> Políticas de Privacidad</a> y
          <a href="#"> Términos de Servicio</a>.
        </p>

        <p className="texto-pequeño">¿No tienes cuenta? <a href="#">Regístrate</a></p>
      </form>
    </div>
  );
};

export default LoginFormulario;
