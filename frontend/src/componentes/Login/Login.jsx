import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CampoTexto from './CampoTexto';
import Boton from './Boton';
import '../Login/style/LoginFormulario.css';
import '../Login/style/CampoTexto.css';
import '../Login/style/Boton.css';

import logo from '../../assets/image.png';

const rolesMapping = {
  1: 'Estudiante',
  2: 'Acudiente',
  3: 'Profesor',
  4: 'Coordinador',
  5: 'Secretaria',
  6: 'Orientador',
  7: 'Rector',
  8: 'Administrador',
  9: 'Super administrador'
};


const Login = () => {
  const [username, setUsername] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!username.trim() || !contrasena.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: '⚠️ Todos los campos son obligatorios',
        timer: 2500,
        showConfirmButton: false
      });
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, contrasena })
      });

      const data = await res.json();

      // Usuario bloqueado: mostrar modal y ofrecer desbloqueo (no dependemos de data.email)
      if (res.status === 423) {
        return Swal.fire({
          icon: 'error',
          title: 'Cuenta bloqueada',
          html: `
            <p>Tu cuenta está bloqueada 🚫</p>
            <p>Para recuperarla, haz clic en <strong>"Desbloquear"</strong> y sigue las instrucciones.</p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Desbloquear',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await solicitarDesbloqueo(); // abrimos el modal que pide username + correo
          }
        });
      }

      if (res.ok && data.token) {
        // Guardar token y datos
        localStorage.setItem('token', data.token);
        console.log('Token guardado:', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('documento', data.usuario.numero_documento);

        const id_tipo_usuario = data.usuario.id_tipo_usuario;
        const rol = rolesMapping[id_tipo_usuario];

        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${rol}!`,
          text: 'Redirigiendo a tu panel...',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
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
              Swal.fire({
                icon: 'error',
                title: 'Rol no autorizado',
                text: `🔒 Rol no autorizado: ${rol}`
              });
              break;
          }
        });
      } else if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: `❌ ${data.mensaje || 'Credenciales inválidas'}`
        });
      }

    } catch (error) {
      console.error('Error de conexión:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: '❌ No se pudo conectar con el servidor'
      });
    }
  };

  // ✉️ Solicita desbloqueo: modal con username + correo (valida y envía { username, correo })
  const solicitarDesbloqueo = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Desbloquear cuenta',
      html:
        '<input id="swal-username" class="swal2-input" placeholder="Nombre de usuario">' +
        '<input id="swal-email" type="email" class="swal2-input" placeholder="Correo electrónico">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enviar código',
      preConfirm: () => {
        const usernameInput = document.getElementById('swal-username')?.value.trim();
        const emailInput = document.getElementById('swal-email')?.value.trim();

        if (!usernameInput || !emailInput) {
          Swal.showValidationMessage('⚠️ Ambos campos son obligatorios');
          return false;
        }
        // validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
          Swal.showValidationMessage('⚠️ Ingresa un correo válido');
          return false;
        }
        return { usernameInput, emailInput };
      }
    });

    if (!formValues) return;

    const { usernameInput, emailInput } = formValues;

    try {
      const res = await fetch('http://localhost:3000/api/auth/solicitar-desbloqueo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, correo: emailInput }) // <-- envio "correo" como el backend espera
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'info',
          title: 'Código enviado',
          text: '📩 Revisa tu correo e ingresa el código para desbloquear la cuenta'
        });
        // Abrimos el modal de verificación, pasando usernameInput
        verificarCodigo(usernameInput);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'No se pudo enviar el código'
        });
      }
    } catch (error) {
      console.error('Error al solicitar desbloqueo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el código. Intenta más tarde.'
      });
    }
  };

  // 🔐 Verifica el código: le pasamos username (viene del modal anterior)
  const verificarCodigo = async (usernameFromModal) => {
    const { value: codigo } = await Swal.fire({
      title: 'Verificación',
      input: 'text',
      inputLabel: 'Ingresa el código enviado a tu correo',
      inputPlaceholder: 'Código de desbloqueo',
      confirmButtonText: 'Verificar',
      showCancelButton: true,
      inputValidator: (val) => {
        if (!val || !val.trim()) return 'Ingresa el código';
        return null;
      }
    });

    if (!codigo) return;

    try {
      const res = await fetch('http://localhost:3000/api/auth/verificar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameFromModal, codigo: codigo.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Cuenta desbloqueada 🎉',
          text: 'Ahora puedes iniciar sesión normalmente'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Código inválido',
          text: data.mensaje || 'El código no es correcto'
        });
      }
    } catch (error) {
      console.error('Error al verificar código:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo verificar el código. Intenta más tarde.'
      });
    }
  };

  return (
    <div className="fondo-login">
      <form className="formulario-login" onSubmit={manejarEnvio}>
        <img src={logo} alt="Logo" className="logo-login mx-auto rounded-xl" />
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

        <p
          className="enlace-texto"
          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
          onClick={() => navigate('/olvido-contrasena')}
        >
          ¿Olvidaste tu contraseña?
        </p>

        <Boton texto="Iniciar sesión" />

        <p className="texto-pequeño">
          Al iniciar sesión, aceptas nuestras
          <a href="#"> Políticas de Privacidad</a> y
          <a href="#"> Términos de Servicio</a>.
        </p>
      </form>
    </div>
  );
};

export default Login;
