import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import '../Login/style/LoginFormulario.css';
import '../Login/style/CampoTexto.css';
import '../Login/style/Boton.css';
import logo from '../../assets/image.png';

// Mapeo de roles según el ID
const rolesMapping = {
  1: 'Estudiante',
  2: 'Acudiente',
  3: 'Profesor',
  4: 'Coordinador',
  5: 'Secretaria',
  6: 'Administrativo',
  7: 'Rector',
  8: 'Orientador'
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    console.log('Login enviado:', username, contrasena);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username, contrasena })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Guardar token y usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('id_usuario', data.usuario.id_usuario);

        const id_tipo_usuario = data.usuario.id_tipo_usuario;
        const rol = rolesMapping[id_tipo_usuario];

        // Redirección según rol
        switch (rol) {
          case 'Coordinador':
          case 'Rector':
          case 'Administrativo':
            navigate('/coordinador');
            break;
          case 'Secretaria':
            navigate('/secretaria');
            break;
          case 'Profesor':
            navigate('/profesor');
            break;
          case 'Estudiante':
            navigate('/estudiante');
            break;
          case 'Acudiente':
            navigate('/acudiente');
            break;
          case 'Orientador':
            navigate('/orientador');
            break;
          default:
            alert(`🔒 Rol no autorizado: ${rol}`);
            break;
        }
      } else {
        alert(`❌ ${data.mensaje || 'Credenciales inválidas'}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('❌ Error de conexión con el servidor');
    }
  };

  return (
    <div className="fondo-login">
      <form className="formulario-login" onSubmit={manejarEnvio}>
        <img src={logo} alt="Logo" className="logo-login" />
        <h2>¡Ingresar! <span>🎓</span></h2>
        <p>Entra a tu cuenta</p>

        <CampoTexto
          etiqueta="Nombre de usuario"
          tipo="text"
          placeholder="ej: juan.perez"
          valor={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <CampoTexto
          etiqueta="Contraseña"
          tipo="password"
          placeholder="••••••••"
          valor={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <p className="enlace-texto">¿Olvidaste tu contraseña?</p>

        <Boton texto="Iniciar sesión" />

        <p className="texto-pequeño">
          Al iniciar sesión, aceptas nuestras
          <a href="/politicas-privacidad"> Políticas de Privacidad</a> y
          <a href="/terminos-servicio"> Términos de Servicio</a>.
        </p>

        <p className="texto-pequeño">
          ¿No tienes cuenta? <a href="/registro">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
