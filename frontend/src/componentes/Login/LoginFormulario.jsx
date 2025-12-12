import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import './style/LoginFormulario.css';
import './LoginFormulario.css'

const LoginFormulario = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!correo.trim() || !clave.trim()) {
      alert('⚠️ Todos los campos son obligatorios');
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
        navigate(ruta);
      } else {
        alert('🔒 Tu rol no tiene acceso a este panel');
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fondo-login">
      <img src="../../assets/fondologin.jpg" alt="" />
      <form className="formulario-login" onSubmit={manejarEnvio}>
        <img
          src="/logo.png"
          alt="Logo"
          className="logo-login"
        />

        <CampoTexto
          etiqueta="Correo electrónico"
          tipo="text"
          id="correo"
          valor={correo}
          onChange={(e) => setCorreo(e.target.value)}
          autoComplete="username"
        />

        <CampoTexto
          etiqueta="Contraseña"
          tipo="password"
          id="clave"
          placeholder="••••••••"
          valor={clave}
          onChange={(e) => setClave(e.target.value)}
          autoComplete="current-password"
        />

        <a className="enlace" href="#">¿Olvidaste tu contraseña?</a>

        <Boton
          texto={loading ? 'Cargando...' : 'Iniciar sesión'}
          disabled={loading}
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
