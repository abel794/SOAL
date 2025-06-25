import React, { useState } from 'react';
import '../../componentes/Login/style/RestablecerContraseña.css';
import logo from '../../assets/image.png';
import CampoTexto from './CampoTexto';
import Boton from './Boton';

const RestablecerContraseña = ({ volverAlLogin }) => {
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [establecida, setEstablecida] = useState(false);

  const esSegura = nueva.length >= 8;
  const coincide = nueva === confirmacion;

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (esSegura && coincide) {
      setEstablecida(true);
    }
  };

  return (
    <div className="pagina-restablecer">
      {!establecida ? (
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

              <Boton texto="Iniciar sesión" />

              <p className="info">
                Al continuar, aceptas nuestros{' '}
                <a href="#">Términos y Condiciones</a> y{' '}
                <a href="#">Política de Privacidad</a>.
              </p>

              <p className="login-link">
                ¿Ya tienes cuenta?{' '}
                <a href="#" onClick={volverAlLogin}>Inicia sesión</a>
              </p>
            </form>
          </div>
        </div>
      ) : (
        <div className="exito">
          <img src="https://img.icons8.com/ios/100/000000/new-post--v1.png" alt="Correo" />
          <h2>¡Contraseña establecida!</h2>
          <button onClick={volverAlLogin}>Ir a bandeja de entrada</button>
          <a href="#" className="reenviar">← enviar correo</a>
        </div>
      )}
    </div>
  );
};

export default RestablecerContraseña;
