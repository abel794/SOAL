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

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: correo,
          contrasena: clave
        }),
      });

      // Pequeña pausa para mostrar el loader mínimo
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      // ✅ ÉXITO - Mostrar feedback positivo
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
        // Esperar 1 segundo para mostrar el mensaje de éxito
        setTimeout(() => {
          setLoading(false);
          navigate(ruta);
        }, 1000);
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
      {/* OVERLAY DE CARGA - debe estar aquí, fuera del formulario */}
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
                <p className="texto-carga">Por favor, espere un momento...</p>
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

        {/* Mensaje de error - solo si no está cargando */}
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
              type="button"
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
        />

        <a 
          className={`enlace-olvido ${loading ? 'enlace-deshabilitado' : ''}`} 
          href="#"
          onClick={(e) => {
            if (loading) e.preventDefault();
          }}
        >
          ¿Olvidaste tu contraseña?
        </a>

        <Boton
          texto={loading ? (success ? "Acceso confirmado ✓" : "Procesando...") : "Iniciar sesión"}
          disabled={loading}
          type="submit"
          className={loading ? "boton-cargando" : ""}
        />

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

export default LoginFormulario;