// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const servicioAutenticacion = require('../services/servicioAutenticacion');
const db = require('../models');
const { enviarCorreo } = require('../services/emailService');
require('dotenv').config();

const Usuario = db.Usuario;
const Persona = db.Persona;
const TokenBlacklist = db.TokenBlacklist; // puede ser undefined si no lo definiste en models

// fallback en memoria (temporal) si la BD no está disponible
const tokensEnMemoria = new Set();

// ---------- CONFIG ----------
const intentosFallidos = {}; // { username: { count: Number, lastAttempt: Number(ms) } }
const desbloqueoCodes = {};  // { username: { code: '123456', expiresAt: Number(ms) } }

const TIEMPO_RESET_INTENTOS = 5 * 60 * 1000;
const CADUCIDAD_CODIGO_MS = 15 * 60 * 1000;
const MAX_INTENTOS = 3;
const ID_ESTADO_BLOQUEADO = 3;
const ID_ESTADO_ACTIVO = 1;
// ----------------------------

const authController = {
  // ------------------------
  // iniciarSesion (sin cambios lógicos importantes)
  // ------------------------
  async iniciarSesion(req, res) {
    const { username, contrasena } = req.body || {};
    console.log('--- iniciarSesion START ---', new Date().toISOString());
    console.log('📥 Payload recibido:', req.body);

    try {
      const usuarioDB = await Usuario.findOne({
        where: { username },
        include: [{ model: Persona }]
      });

      if (usuarioDB && Number(usuarioDB.id_estado_usuario) === ID_ESTADO_BLOQUEADO) {
        console.warn(`🔒 Intento de login con cuenta bloqueada: ${username}`);
        return res.status(423).json({
          mensaje: 'Tu cuenta está bloqueada. ¿Deseas desbloquearla?',
          desbloqueo: true
        });
      }

      const datosUsuario = await servicioAutenticacion.iniciarSesion(username, contrasena);

      if (intentosFallidos[username]) {
        intentosFallidos[username] = { count: 0, lastAttempt: null };
      }

      const token = jwt.sign(
        {
          id_usuario: datosUsuario.id_usuario,
          id_tipo_usuario: datosUsuario.id_tipo_usuario,
          rol: datosUsuario.rol, // ahora sí usa el rol con texto (ej: "Acudiente")
          id_funcionario: datosUsuario.id_funcionario || null,
          id_estudiante: datosUsuario.id_estudiante || null,
          id_acudiente: datosUsuario.id_acudiente || null,
          persona_estudiante: datosUsuario.persona_estudiante || null,
          persona_acudiente: datosUsuario.persona_acudiente || null
        },
        process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );


      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        token,
        usuario: datosUsuario
      });
    } catch (error) {
      const usernameReq = (req.body && req.body.username) || 'unknown';
      const ahora = Date.now();
      console.error('❌ iniciarSesion - excepción capturada:', error && (error.message || error));

      if (!intentosFallidos[usernameReq]) {
        intentosFallidos[usernameReq] = { count: 1, lastAttempt: ahora };
      } else {
        const ultimo = intentosFallidos[usernameReq].lastAttempt || 0;
        if (ahora - ultimo > TIEMPO_RESET_INTENTOS) {
          intentosFallidos[usernameReq] = { count: 1, lastAttempt: ahora };
        } else {
          intentosFallidos[usernameReq].count += 1;
          intentosFallidos[usernameReq].lastAttempt = ahora;
        }
      }

      const count = intentosFallidos[usernameReq].count;

      try {
        const usuarioBD = await Usuario.findOne({ where: { username: usernameReq } });
        if (count >= MAX_INTENTOS && usuarioBD) {
          await Usuario.update(
            { id_estado_usuario: ID_ESTADO_BLOQUEADO },
            { where: { id_usuario: usuarioBD.id_usuario } }
          );
          return res.status(423).json({
            mensaje: 'Usuario bloqueado por demasiados intentos. Solicita desbloqueo.',
            desbloqueo: true
          });
        }
      } catch (dbErr) {
        console.error('❌ Error al intentar bloquear usuario en BD:', dbErr);
      }

      return res.status(401).json({ mensaje: error.message || 'Credenciales inválidas' });
    }
  },

  // ------------------------
  // solicitarDesbloqueo
  // ------------------------
  async solicitarDesbloqueo(req, res) {
    console.log('--- solicitarDesbloqueo START ---', new Date().toISOString());
    try {
      const { username, correo } = req.body || {};
      if (!username || !correo) {
        return res.status(400).json({ mensaje: 'Faltan datos: username y correo son obligatorios' });
      }

      const usuarioDB = await Usuario.findOne({
        where: { username },
        include: [{ model: Persona }]
      });

      if (!usuarioDB || !usuarioDB.Persona) {
        return res.status(404).json({ mensaje: 'Usuario o correo no encontrado' });
      }

      const correoRegistrado = usuarioDB.Persona.correo;
      if (!correoRegistrado || correoRegistrado.toLowerCase() !== correo.toLowerCase()) {
        return res.status(404).json({ mensaje: 'Correo no coincide con el registrado' });
      }

      const codigo = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + CADUCIDAD_CODIGO_MS;
      desbloqueoCodes[username] = { code: codigo, expiresAt };

      const asunto = '🔑 Código de desbloqueo';
      const texto = `Tu código de desbloqueo es: ${codigo}. Válido por 15 minutos.`;

      try {
        await enviarCorreo(correoRegistrado, asunto, texto);
      } catch (mailErr) {
        delete desbloqueoCodes[username];
        return res.status(500).json({ mensaje: 'Error al enviar correo de desbloqueo' });
      }

      return res.status(200).json({ mensaje: '📨 Código enviado al correo', expiracion_minutos: 15 });
    } catch (error) {
      console.error('❌ Error en solicitarDesbloqueo:', error);
      return res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
    }
  },

  // ------------------------
  // verificarCodigoDesbloqueo
  // ------------------------
  async verificarCodigoDesbloqueo(req, res) {
    console.log('--- verificarCodigoDesbloqueo START ---', new Date().toISOString());
    try {
      const { username, codigo } = req.body || {};
      if (!username || !codigo) {
        return res.status(400).json({ mensaje: 'Faltan datos: username y codigo son obligatorios' });
      }

      const record = desbloqueoCodes[username];
      if (!record) {
        return res.status(400).json({ mensaje: 'No hay un código solicitado o ha expirado' });
      }

      if (Date.now() > record.expiresAt) {
        delete desbloqueoCodes[username];
        return res.status(400).json({ mensaje: 'Código expirado. Solicita uno nuevo.' });
      }

      if (record.code !== String(codigo).trim()) {
        return res.status(400).json({ mensaje: 'Código incorrecto' });
      }

      const usuarioDB = await Usuario.findOne({ where: { username } });
      if (!usuarioDB) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      await Usuario.update(
        { id_estado_usuario: ID_ESTADO_ACTIVO },
        { where: { id_usuario: usuarioDB.id_usuario } }
      );

      if (intentosFallidos[username]) delete intentosFallidos[username];
      delete desbloqueoCodes[username];

      return res.status(200).json({ mensaje: '✅ Cuenta desbloqueada. Ya puedes iniciar sesión o cambiar tu contraseña.' });
    } catch (error) {
      console.error('❌ Error en verificarCodigoDesbloqueo:', error);
      return res.status(500).json({ mensaje: 'Error al procesar la verificación' });
    }
  },

  // ------------------------
  // olvidoContrasena
  // ------------------------
  async olvidoContrasena(req, res) {
    console.log('--- olvidoContrasena START ---', new Date().toISOString());
    try {
      const { username } = req.body;
      const persona = await Persona.findOne({
        where: { correo: username },
        include: [{ model: Usuario, as: 'usuario' }]
      });

      if (!persona || !persona.usuario) {
        return res.status(404).json({ mensaje: 'Correo no encontrado' });
      }

      const token = jwt.sign(
        { id_usuario: persona.usuario.id_usuario },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const link = `http://localhost:3001/restablecer/${token}`;

      try {
        await enviarCorreo(persona.correo, '🔑 Restablecimiento de contraseña', `Haz clic: ${link}`);
      } catch (mailErr) {
        return res.status(500).json({ mensaje: 'Error al enviar correo de restablecimiento' });
      }

      return res.json({ mensaje: '📨 Correo enviado con el enlace de restablecimiento' });
    } catch (error) {
      console.error('❌ Error en olvidoContrasena:', error);
      return res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
    }
  },

  // ------------------------
  // restablecerContrasena
  // ------------------------
  async restablecerContrasena(req, res) {
    console.log('--- restablecerContrasena START ---', new Date().toISOString());
    try {
      const { token, nueva } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hash = await bcrypt.hash(nueva, 10);
      await Usuario.update(
        { contrasena: hash },
        { where: { id_usuario: decoded.id_usuario } }
      );
      return res.json({ mensaje: '✅ Contraseña restablecida con éxito' });
    } catch (error) {
      console.error('❌ Error en restablecerContrasena:', error);
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }
  },

  // ------------------------
  // cerrarSesion (logout)
  // ------------------------
  // dentro de controllers/authController.js -> función cerrarSesion (reemplaza la actual)
async cerrarSesion(req, res) {
  try {
    console.log("[POST] /api/auth/logout - headers:", req.headers);

    const authHeader = req.headers['authorization'] || "";
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      console.log("[logout] No token proporcionado en headers - respondiendo OK para que frontend limpie.");
      return res.status(200).json({ mensaje: 'No token proporcionado. Sesión local eliminada.' });
    }

    // Decodificamos el token (no usamos verify para evitar fallos por secret)
    let decoded = null;
    try {
      decoded = jwt.decode(token);
      console.log("[logout] token decodificado:", decoded ? { id_usuario: decoded.id_usuario, exp: decoded.exp } : null);
    } catch (err) {
      console.warn("[logout] fallo al decodificar token (no crítico):", err.message);
    }

    // Calculamos expiración (en formato Date) si existe decoded.exp
    const expDate = (decoded && decoded.exp) ? new Date(decoded.exp * 1000) : null;

    // Si existe modelo TokenBlacklist y tenemos id_usuario + exp, guardamos en BD con los campos esperados
    if (TokenBlacklist && decoded && decoded.id_usuario && expDate) {
      try {
        await TokenBlacklist.create({
          token,
          usuario_id: decoded.id_usuario,  // campo requerido según tu modelo
          expira_en: expDate               // campo requerido según tu modelo
        });
        console.log("🚪 Token agregado a TokenBlacklist (BD) con usuario_id y expira_en.");
      } catch (err) {
        console.error("⚠️ Error al guardar blacklist en BD, usando fallback en memoria:", err.message || err);
        tokensEnMemoria.add(token);
      }
    } else {
      // Si no tenemos los datos obligatorios para insertar en BD -> fallback en memoria
      if (!TokenBlacklist) {
        console.warn("⚠️ TokenBlacklist model no disponible. Guardando token en memoria (temporal).");
      } else {
        console.warn("⚠️ decoded.id_usuario o decoded.exp faltante. Guardando token en memoria (temporal).", { decoded });
      }
      tokensEnMemoria.add(token);
    }

    return res.status(200).json({ mensaje: 'Sesión cerrada correctamente ✅' });
  } catch (error) {
    console.error("❌ Error en cerrarSesion:", error.stack || error);
    return res.status(500).json({ mensaje: 'Error al cerrar sesión', error: error.message || error });
  }
}
};

module.exports = authController;
