import React from "react";
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import ObservacionCard from '../components/ObservacionCard/ObservacionCard';

export default function Observador() {
  const usuario = "Juan Rodriguez";
  const observaciones = [
    {
      titulo: "Observación importante para los padres",
      estudiante: "David Martinez",
      grado: "4A",
      categoria: "Comportamiento",
      descripcion: "El estudiante ha tenido comportamientos inapropiados en clase de ciencias. Se solicita reunión urgente.",
      fecha: "24 de abril de 2024, 10:30",
    },
    {
      titulo: "Excelente desempeño en matemáticas",
      estudiante: "Ana López",
      grado: "4B",
      categoria: "Academico",
      descripcion: "Ha mostrado un progreso destacado en resolución de problemas y participación activa en clase.",
      fecha: "23 de abril de 2024, 15:45",
    },
    // Más observaciones aquí
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar fijo en escritorio */}
      <Sidebar />

      <main className="flex-1 p-4 overflow-auto">
        {/* Header con usuario */}
        <Header usuario={usuario} />

        {/* Contenedor de observaciones con scroll si hay muchas */}
        <div className="mt-4 space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
          {observaciones.map((obs, index) => (
            <ObservacionCard key={index} obs={obs} />
          ))}
        </div>
      </main>
    </div>
  );
}
