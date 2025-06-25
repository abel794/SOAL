import React, { useState } from 'react';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import '../estilos/style/LoginFormulario';

const LoginFormulario = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    console.log('Correo:', correo, 'Clave:', clave);
  };

  return (
    <div className="fondo-login">
      <form className="formulario-login" onSubmit={manejarEnvio}>
        <h2>¡Conectemos! <span>📡</span></h2>
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
