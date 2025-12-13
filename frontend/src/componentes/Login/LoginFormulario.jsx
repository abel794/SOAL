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
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');

    // Validación simple
    if (!correo.trim() || !clave.trim()) {
      setError('⚠️ Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    // Agregar un timeout mínimo para evitar parpadeo muy rápido
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Usar Promise.all para esperar tanto el fetch como el timeout mínimo
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
        // Pequeña pausa para mostrar mensaje de éxito
        setTimeout(() => {
          navigate(ruta);
        }, 300);
      } else {
        throw new Error('🔒 Tu rol no tiene acceso a este panel');
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fondo-login">
      <img src="../../assets/fondologin.jpg" alt="" />
      
      {/* Overlay de carga */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Iniciando sesión...</p>
            <p className="loading-subtext">Por favor, espere un momento</p>
          </div>
        </div>
      )}
      
      <form className="formulario-login" onSubmit={manejarEnvio}>
        <img
          src="/logo.png"
          alt="Logo"
          className="logo-login"
        />

        {/* Mensaje de error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <CampoTexto
          etiqueta="Correo electrónico"
          tipo="text"
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

        <a className="enlace" href="#" style={{ pointerEvents: loading ? 'none' : 'auto' }}>
          ¿Olvidaste tu contraseña?
        </a>

        <Boton
          texto="Iniciar sesión"
          disabled={loading}
          type="submit"
        />


        {loading && (
          <div className="overlay-carga">
            <div className="icono-carga"></div>
            <span>Verificando…</span>
          </div>
        )}


        <p className="texto-pequeño" style={{ opacity: loading ? 0.5 : 1 }}>
          Al iniciar sesión, aceptas nuestras
          <a href="#" style={{ pointerEvents: loading ? 'none' : 'auto' }}> Políticas de Privacidad</a> y
          <a href="#" style={{ pointerEvents: loading ? 'none' : 'auto' }}> Términos de Servicio</a>.
        </p>

        <p className="texto-pequeño" style={{ opacity: loading ? 0.5 : 1 }}>
          ¿No tienes cuenta? <a href="#" style={{ pointerEvents: loading ? 'none' : 'auto' }}>Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default LoginFormulario;