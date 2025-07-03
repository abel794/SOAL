import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/Login/Login';
import PanelCoordinador from './componentes/Coordinador/PanelCoordinador';
import DashboardSecretaria from './componentes/DashBoard/DashboardSecretaria';
import PanelProfesor from './componentes/Profesor/Profesor/PanelProfesor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/coordinador" element={<PanelCoordinador />} />
        <Route path="/secretaria" element={<DashboardSecretaria />} />
        <Route path="/profesor" element={<PanelProfesor />} />
      </Routes>
    </Router>
  );
}

export default App;
