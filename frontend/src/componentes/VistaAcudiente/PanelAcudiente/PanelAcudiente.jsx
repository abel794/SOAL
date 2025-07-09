import AcudienteSidebar from '../AcudienteSidebar/AcudienteSidebar';
import AcudienteHeader from '../AcudienteHeader/AcudienteHeader';
import AcudienteObservacionCard from '../AcudienteObservacionCard/AcudienteObservacionCard';
import './PanelAcudiente.css';


function PanelAcudiente() {
  const observaciones = [
    {
      estudiante: 'David Martínez',
      categoria: 'Comportamiento',
      grado: '4A',
      fecha: '24 abr. 2024, 10:30',
      descripcion: 'El estudiante ha tenido un comportamiento inapropiado en clase de ciencias.'
    },
    // Más observaciones...
  ];

  return (
    <div className="panel-container">
      <AcudienteSidebar />
      <div className="main-content">
        <AcudienteHeader nombreUsuario="Juan Rodríguez" />
        <div className="observaciones">
          {observaciones.map((obs, index) => (
            <AcudienteObservacionCard key={index} observacion={obs} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PanelAcudiente;
