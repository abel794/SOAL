import React, { useState } from 'react';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import '../Login/style/LoginFormulario.css';
import '../Login/style/CampoTexto.css';
import '../Login/style/Boton.css';
import logo from '../../assets/image.png';

const Login = ({ setAutenticado, setMostrarOlvidaste }) => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (correo  && clave ) {
      setAutenticado(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="fondo-login">
      <form className="formulario-login" onSubmit={manejarEnvio}>
        <img src={logo} alt="Logo" className="logo-login" />
        <h2>¡Ingresar! <span>🎓</span></h2>
        <p>Entra tu cuenta</p>

        <CampoTexto
          etiqueta="Correo electrónico"
          tipo="email"
          placeholder="ejemplo@correo.com"
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

        <p className="enlace-texto" onClick={() => setMostrarOlvidaste(true)}>
            ¿Olvidaste tu contraseña?
        </p>


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

export default Login;
