import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import './style/LoginFormulario.css';
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

    // Validación simple
    if (!correo.trim() || !clave.trim()) {
      setError('⚠️ Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    // Timeout mínimo para evitar parpadeo
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 600));

    try {
      // Usar Promise.all para timeout mínimo
      const [_, res] = await Promise.all([
        timeoutPromise,
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: correo,
            contrasena: clave
          }),
        })
      ]);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      // Mostrar éxito antes de redirigir
      setSuccess(true);
      
      const tipoUsuario = data.usuario.id_tipo_usuario;

      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Rutas según el tipo de usuario
      const rutasPorTipo = {
        5: '/dashboard',      // secretaria
        2: '/profesor',       // profesor
        4: '/coordinador',    // coordinador
      };

      const ruta = rutasPorTipo[tipoUsuario];

      if (ruta) {
        // Esperar 1.5 segundos para mostrar mensaje de éxito
        setTimeout(() => {
          setLoading(false);
          navigate(ruta);
        }, 1500);
      } else {
        throw new Error('🔒 Tu rol no tiene acceso a este panel');
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fondo-login">
      {/* Overlay de carga */}
      {loading && (
        <div className={`overlay-carga ${success ? 'overlay-exito' : ''}`}>
          <div className="contenido-carga">
            {success ? (
              <>
                <div className="icono-exito">✓</div>
                <h3 className="titulo-exito">¡Acceso confirmado!</h3>
                <p className="texto-exito">Redirigiendo a tu panel...</p>
                <div className="loader-exito"></div>
              </>
            ) : (
              <>
                <div className="spinner-carga"></div>
                <h3 className="titulo-carga">Verificando credenciales</h3>
                <p className="texto-carga">Estamos validando tu información...</p>
                <div className="barra-progreso">
                  <div className="progreso"></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <form className={`formulario-login ${loading ? 'formulario-cargando' : ''}`} onSubmit={manejarEnvio}>
        <img
          src="/logo.png"
          alt="Logo"
          className="logo-login"
        />

        {/* Mensaje de error */}
        {error && !loading && (
          <div className="notificacion-error">
            <div className="icono-error">✕</div>
            <div className="contenido-error">
              <h4>Error de autenticación</h4>
              <p>{error}</p>
            </div>
            <button 
              className="cerrar-error" 
              onClick={() => setError('')}
              aria-label="Cerrar mensaje"
            >
              ×
            </button>
          </div>
        )}

        <CampoTexto
          etiqueta="Correo electrónico"
          tipo="email"
          id="correo"
          valor={correo}
          onChange={(e) => setCorreo(e.target.value)}
          autoComplete="username"
          disabled={loading}
          icono="✉️"
        />

        <CampoTexto
          etiqueta="Contraseña"
          tipo="password"
          id="clave"
          placeholder="••••••••"
          valor={clave}
          onChange={(e) => setClave(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
          icono="🔒"
        />

        <a 
          className={`enlace-olvido ${loading ? 'enlace-deshabilitado' : ''}`} 
          href="#"
          onClick={(e) => loading && e.preventDefault()}
        >
          ¿Olvidaste tu contraseña?
        </a>

        <Boton
          texto={loading ? (success ? "Acceso confirmado ✓" : "Procesando...") : "Iniciar sesión"}
          disabled={loading}
          tipo={success ? "exito" : loading ? "cargando" : "primario"}
          icono={loading ? (success ? "✓" : "⏳") : "→"}
        />

        <div className="separador">
          <span>o continúa con</span>
        </div>

        <div className="redes-sociales">
          <button type="button" className="boton-social" disabled={loading}>
            <span className="icono-social">G</span>
            Google
          </button>
          <button type="button" className="boton-social" disabled={loading}>
            <span className="icono-social">f</span>
            Facebook
          </button>
        </div>

        <div className="terminos-servicio">
          <p className="texto-legal">
            Al iniciar sesión, aceptas nuestras
            <a href="#" className="enlace-legal"> Políticas de Privacidad</a> y
            <a href="#" className="enlace-legal"> Términos de Servicio</a>.
          </p>

          <p className="texto-registro">
            ¿No tienes cuenta? 
            <a href="#" className="enlace-registro"> Regístrate aquí</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginFormulario;