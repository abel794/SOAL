// src/hooks/useResponsiveLayout.js
import { useState, useEffect } from 'react';

export default function useResponsiveLayout() {
  const [abierto, setAbierto] = useState(true);
  const [esMovil, setEsMovil] = useState(() =>
    window.matchMedia ? window.matchMedia('(max-width: 767px)').matches : false
  );

  const toggleMenu = () => setAbierto((v) => !v);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setEsMovil(e.matches);
    
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);

  // Bloqueo de scroll cuando sidebar está abierto en móvil
  useEffect(() => {
    if (esMovil) {
      if (abierto) document.body.classList.add('sidebar-open');
      else document.body.classList.remove('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => document.body.classList.remove('sidebar-open');
  }, [abierto, esMovil]);

  const WIDTH_OPEN = 260;
  const WIDTH_COLLAPSED = 72;

  const contenidoStyle = esMovil
    ? { marginLeft: 0, transition: 'margin-left 180ms ease', padding: 20 }
    : {
        marginLeft: abierto ? WIDTH_OPEN : WIDTH_COLLAPSED,
        transition: 'margin-left 180ms ease',
        padding: 20
      };

  return {
    abierto,
    esMovil,
    toggleMenu,
    contenidoStyle
  };
}