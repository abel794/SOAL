// Componente para mostrar una galería de íconos Lordicon en React
import React from 'react';

export default function IconGallery() {
  // Lista de íconos con nombre y URL (puedes añadir más)
  const iconos = [
    { nombre: '👍 Pulgar Arriba', src: 'https://cdn.lordicon.com/tdrtiskw.json' },
    { nombre: '😞 Carita Triste', src: 'https://cdn.lordicon.com/nnbhwnej.json' },
    { nombre: '✅ Check', src: 'https://cdn.lordicon.com/lupuorrc.json' },
    { nombre: '❌ Cruz', src: 'https://cdn.lordicon.com/qsakojef.json' },
    { nombre: '🔔 Campana', src: 'https://cdn.lordicon.com/psnhyobz.json' },
    { nombre: '💬 Mensaje', src: 'https://cdn.lordicon.com/nocovwne.json' },
    { nombre: '📦 Caja', src: 'https://cdn.lordicon.com/slkvcfos.json' },
    { nombre: '👨‍🏫 Profesor', src: 'https://cdn.lordicon.com/eszyyflr.json' },
    { nombre: '🔍 Lupa', src: 'https://cdn.lordicon.com/xfftupfv.json' },
    { nombre: '🚫 Prohibido', src: 'https://cdn.lordicon.com/hpivxauj.json' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Galería de Íconos Lordicon</h2>
      <p>Todos los íconos cargados desde CDN.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '2rem' }}>
        {iconos.map((icon, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <lord-icon
              src={icon.src}
              trigger="hover"
              delay="500"
              style={{ width: '80px', height: '80px' }}
            />
            <p style={{ marginTop: '0.5rem' }}>{icon.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
