// src/routes/RutaProtegida.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // 👈 Instálalo: npm install jwt-decode
import Swal from "sweetalert2";

/**
 * Componente de protección de rutas.
 * - Verifica si existe un token en localStorage.
 * - Valida si el token está expirado.
 * - Si no existe o está vencido, redirige al login.
 */
export default function RutaProtegida({ children }) {
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // ❌ No hay token → debe iniciar sesión
      Swal.fire({
        icon: "warning",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para acceder al sistema.",
        confirmButtonText: "Entendido",
      }).then(() => setAutenticado(false));
      return;
    }

    try {
      // ✅ Decodificamos el token
      const decoded = jwtDecode(token);
      const ahora = Date.now() / 1000; // tiempo actual en segundos

      if (decoded.exp && decoded.exp < ahora) {
        // ❌ Token expirado
        localStorage.clear();
        Swal.fire({
          icon: "info",
          title: "Sesión expirada",
          text: "Tu sesión ha caducado. Por favor, vuelve a iniciar sesión.",
          confirmButtonText: "Iniciar sesión",
        }).then(() => setAutenticado(false));
      } else {
        // ✅ Token válido
        setAutenticado(true);
      }
    } catch (error) {
      // ❌ Token inválido o corrupto
      localStorage.clear();
      Swal.fire({
        icon: "error",
        title: "Token inválido",
        text: "Hubo un problema con tu sesión. Por favor, inicia sesión nuevamente.",
        confirmButtonText: "Aceptar",
      }).then(() => setAutenticado(false));
    }
  }, []);

  // ⏳ Mientras valida el token, evita mostrar contenido (pantalla de carga)
  if (autenticado === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700 text-lg">
        Verificando sesión...
      </div>
    );
  }

  // 🔒 Si no está autenticado → redirigir al login
  if (autenticado === false) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si está autenticado → mostrar el contenido
  return children;
}
