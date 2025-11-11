import React, { useMemo } from "react";
import "./TarjetasPorcentajes.css";
import GraficoTorta from "../GraficoTorta/GraficoTorta";
import { FaExclamationTriangle, FaCalendarAlt } from "react-icons/fa";

export default function TarjetasPorcentajes() {
  // 🔹 Datos simulados de categorías
  const categorias = useMemo(() => [
    { id: 1, nombre: "Actitud", cantidad: 12 },
    { id: 2, nombre: "Disciplinaria", cantidad: 5 },
    { id: 3, nombre: "Psicologica", cantidad: 3 },
    { id: 4, nombre: "Situacion financiera", cantidad: 2 },
  ], []);

  const tarjetasExtras = useMemo(() => [
    {
      title: "Casos críticos",
      count: 4,
      icon: <FaExclamationTriangle className="icono-tarjeta critico" />,
      color: "critico"
    },
    {
      title: "Citas programadas",
      count: 8,
      icon: <FaCalendarAlt className="icono-tarjeta citas" />,
      color: "citas"
    },
  ], []);

  const totalObservaciones = useMemo(() => 
    categorias.reduce((acc, c) => acc + c.cantidad, 0), [categorias]
  );

  const Tarjeta = useMemo(() => ({ item, tipo = "categoria" }) => {
    const porcentaje = ((item.cantidad / totalObservaciones) * 100).toFixed(1);
    
    const datosGrafico = tipo === "categoria" 
      ? [
          { nombre: item.nombre, cantidad: item.cantidad },
          { nombre: "Otros", cantidad: totalObservaciones - item.cantidad },
        ]
      : [
          { nombre: "Completado", cantidad: item.count },
          { nombre: "Pendiente", cantidad: totalObservaciones - item.count },
        ];

    return (
      <div className={`tarjeta ${tipo} ${item.color || ''}`}>
        <div className="tarjeta-contenido">
          {item.icon && (
            <div className="tarjeta-icono">
              {item.icon}
            </div>
          )}
          
          <h5 className="tarjeta-titulo">{item.nombre || item.title}</h5>
          <h2 className="tarjeta-valor">{item.cantidad || item.count}</h2>

          <div className="tarjeta-grafico">
            <GraficoTorta 
              datos={datosGrafico} 
              compact={true} 
              size={120} 
            />
          </div>

          <p className="tarjeta-porcentaje">{porcentaje}%</p>
        </div>
      </div>
    );
  }, [totalObservaciones]);

  return (
    <div className="tarjetas-porcentajes-container">
      <div className="tarjetas-grid">
        {categorias.map((cat) => (
          <div className="tarjeta-columna" key={`cat-${cat.id}`}>
            <Tarjeta item={cat} tipo="categoria" />
          </div>
        ))}
        
        {tarjetasExtras.map((item, i) => (
          <div className="tarjeta-columna" key={`extra-${i}`}>
            <Tarjeta item={item} tipo="extra" />
          </div>
        ))}
      </div>
    </div>
  );
}