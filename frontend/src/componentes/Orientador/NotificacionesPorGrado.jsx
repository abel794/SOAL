// 📂 src/componentes/Profesor/NotificacionesPorGrado.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import GradosSelector from "./GradosSelector";
import EnviarNotificacionGrado from "./EnviarNotificacionGrado";

const NotificacionesPorGrado = () => {
  const [grados, setGrados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");

  useEffect(() => {
    const obtenerGrados = async () => {
      try {
        const token = localStorage.getItem("token");
        const usuario = JSON.parse(localStorage.getItem("usuario")); // 👈 Verificamos el usuario guardado
        console.log("🧩 Usuario en localStorage:", usuario);

        if (!usuario || !usuario.id_funcionario) {
          console.error("⚠️ No se encontró id_funcionario en localStorage");
          return;
        }

        const idProfesor = usuario.id_funcionario;

        console.log(`📡 Consultando grados para profesor ID: ${idProfesor}`);

        const res = await axios.get(
          `http://localhost:3000/api/profesor/${idProfesor}/grados`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Respuesta del servidor:", res.data);

        if (res.data && res.data.data) {
          setGrados(res.data.data);
        } else {
          console.warn("⚠️ No se recibieron grados válidos");
        }
      } catch (error) {
        console.error("❌ Error al cargar los grados:", error);
      }
    };

    obtenerGrados();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">📚 Notificaciones por grado</h4>

      <GradosSelector
        grados={grados}
        gradoSeleccionado={gradoSeleccionado}
        setGradoSeleccionado={setGradoSeleccionado}
      />

      {gradoSeleccionado && (
        <EnviarNotificacionGrado gradoSeleccionado={gradoSeleccionado} />
      )}
    </div>
  );
};

export default NotificacionesPorGrado;
