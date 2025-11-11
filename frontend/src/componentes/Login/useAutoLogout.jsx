// src/componentes/Login/useAutoLogout.js
import { useEffect } from 'react';
import { cerrarSesion } from '../../utils/auth'; // 👈 función que elimina token y redirige al login
import './useAutoLogout.css'

// Hook personalizado que cierra la sesión automáticamente
// navigate = función de react-router-dom para redirigir
// tiempoInactividad = tiempo máximo sin actividad (por defecto 10 min en ms)
export default function useAutoLogout(navigate, tiempoInactividad = 10 * 60 * 1000) {
  useEffect(() => {
    let timer; // ⏱️ Aquí guardamos el temporizador

    // Función que reinicia el temporizador cada vez que hay actividad
    const resetTimer = () => {
      clearTimeout(timer); // Cancelamos el temporizador anterior
      // Configuramos un nuevo temporizador
      timer = setTimeout(() => {
        cerrarSesion(navigate); // Si pasa el tiempo -> cerrar sesión
      }, tiempoInactividad);
    };

    // Escuchamos la actividad del usuario
    window.addEventListener('mousemove', resetTimer); // 👈 si mueve el mouse
    window.addEventListener('keydown', resetTimer);   // 👈 si presiona una tecla

    // Iniciamos el temporizador por primera vez
    resetTimer();

    // Limpiamos todo al desmontar el componente
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [navigate, tiempoInactividad]); // Dependencias: si cambian, se vuelve a configurar
}
