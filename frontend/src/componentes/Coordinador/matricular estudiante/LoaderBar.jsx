// src/componentes/LoaderBar.jsx
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./LoaderBar.css"

export default function LoaderBar({ active }) {
  useEffect(() => {
    if (active) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [active]);

  return null; // No renderiza nada visible, solo la barra arriba
}
