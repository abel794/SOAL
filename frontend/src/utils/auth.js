// src/utils/auth.js
import axios from "axios";
import Swal from "sweetalert2";

/**
 * Función para cerrar sesión del usuario de forma segura.
 * 1. Informa al backend para invalidar el token.
 * 2. Limpia todo rastro de sesión en el frontend (token, usuario, etc.).
 * 3. Redirige al login mostrando un mensaje visual al usuario.
 *
 * @param {Function} navigate - Hook de navegación de React Router (useNavigate)
 */
export const cerrarSesion = async (navigate) => {
  // 🔍 Obtenemos el token almacenado localmente
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  try {
    if (!API_URL) {
      console.warn("⚠️ No se encontró REACT_APP_API_URL en el entorno");
    }

    // Si hay token, lo notificamos al backend para invalidarlo
    if (token) {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 8000, // ⏱️ por si el servidor no responde
        }
      );
      console.log("✅ Sesión invalidada en el backend.");
    }
  } catch (error) {
    // Captura de errores detallada
    console.error("❌ Error al cerrar sesión en el backend:", error);

    if (error.response) {
      console.error("🧾 Respuesta del servidor:", error.response.data);
    } else if (error.request) {
      console.error("📡 No hubo respuesta del servidor:", error.request);
    } else {
      console.error("⚙️ Error en la configuración de la petición:", error.message);
    }
  } finally {
    // 🧹 Limpieza local completa: token, usuario y cualquier otro dato sensible
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("correo");

    // 🔒 Mensaje visual de confirmación
    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "Tu sesión ha sido cerrada correctamente.",
      showConfirmButton: false,
      timer: 1500,
    });

    // 🧭 Redirigir al login después de una breve pausa
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }
};
