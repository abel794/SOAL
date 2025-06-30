import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import '../Login/style/LoginFormulario.css';
import '../Login/style/CampoTexto.css';
import '../Login/style/Boton.css';
import logo from '../../assets/image.png';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/autenticacion/iniciar-sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_usuario: usuario,
          clave: clave
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const tipo_usuario = data.usuario.rol;

        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        if (tipo_usuario === 'Coordinador' || tipo_usuario === 'Rector' || tipo_usuario === 'Administrativo') {
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
        <img src={logo} alt="Logo" className="logo-login" />
        <h2>¡Ingresar! <span>🎓</span></h2>
        <p>Entra tu cuenta</p>

        <CampoTexto
          etiqueta="Nombre de usuario"
          tipo="text"
          placeholder="ej: juan.perez"
          valor={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <CampoTexto
          etiqueta="Contraseña"
          tipo="password"
          placeholder="••••••••"
          valor={clave}
          onChange={(e) => setClave(e.target.value)}
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

