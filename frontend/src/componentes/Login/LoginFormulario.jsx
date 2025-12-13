import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import './LoginFormulario.css';

const LoginFormulario = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!correo.trim() || !clave.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: correo,
            contrasena: clave
          })
        }
      );

      await new Promise(r => setTimeout(r, 600)); // loader visible

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');

      setSuccess(true);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      const rutas = {
        5: '/dashboard',
        2: '/profesor',
        4: '/coordinador'
      };

      setTimeout(() => {
        setLoading(false);
        navigate(rutas[data.usuario.id_tipo_usuario]);
      }, 1000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fondo-login">

      {loading && (
        <div className={`overlay-carga ${success ? 'overlay-exito' : ''}`}>
          <div className="contenido-carga">
            {success ? (
              <>
                <div className="icono-exito">✓</div>
                <h3 className="titulo-exito">Acceso concedido</h3>
                <p className="texto-exito">Redirigiendo…</p>
                <div className="loader-exito"></div>
              </>
            ) : (
              <>
                <div className="spinner-carga"></div>
                <h3 className="titulo-carga">Verificando</h3>
                <p className="texto-carga">Espere un momento…</p>
                <div className="barra-progreso">
                  <div className="progreso"></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <form
        className={`formulario-login ${loading ? 'formulario-cargando' : ''}`}
        onSubmit={manejarEnvio}
      >
        <img src="/logo.png" alt="Logo" className="logo-login" />

        {error && !loading && (
          <div className="notificacion-error">
            <div className="icono-error">!</div>
            <div className="contenido-error">
              <h4>Error</h4>
              <p>{error}</p>
            </div>
            <button
              type="button"
              className="cerrar-error"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        )}

        <div className="formulario-top">
          <CampoTexto
            etiqueta="Correo electrónico"
            tipo="email"
            id="correo"
            valor={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={loading}
          />

          <CampoTexto
            etiqueta="Contraseña"
            tipo="password"
            id="clave"
            valor={clave}
            onChange={(e) => setClave(e.target.value)}
            disabled={loading}
          />

          <a className="enlace-olvido">¿Olvidaste tu contraseña?</a>
        </div>

        <div className="formulario-bottom">
          <Boton
            texto={loading ? 'Procesando…' : 'Iniciar sesión'}
            disabled={loading}
            type="submit"
          />

          <p className="texto-pequeño">
            Al iniciar sesión aceptas nuestras
            <a href="#"> Políticas</a> y
            <a href="#"> Términos</a>.
          </p>

          <p className="texto-pequeño">
            ¿No tienes cuenta? <a href="#">Regístrate</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginFormulario;
