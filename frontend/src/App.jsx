import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/Login/Login'; // o tu ruta correcta
import PanelCoordinador from './componentes/Coordinador/PanelCoordinador';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/coordinador" element={<PanelCoordinador />} />
      </Routes>
    </Router>
  );
}

export default App;

