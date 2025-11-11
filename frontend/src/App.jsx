// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./componentes/Login/Login";
import OlvidoContrasena from "./componentes/Login/OlvidoContrasena";
import RestablecerContraseña from "./componentes/Login/RestablecerContraseña";
import PanelCoordinador from "./componentes/Coordinador/PanelCoordinador";
import SecretariaInicio from "./componentes/Secretaria/Inicio/SecretariaInicio";
import PanelProfesor from "./componentes/Profesor/PanelProfesor";
import PanelAcudiente from "./componentes/VistaAcudiente/PanelAcudiente/PanelAcudiente";
import PanelEstudiante from "./componentes/PanelEstudiante/panel_estudiante/Panel_estudinate";
import PanelOrientador from "./componentes/Orientador/PanelOrientador.jsx";

// 👇 Importamos nuestra ruta protegida
import RutaProtegida from "./routes/RutaProtegida.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/olvido-contrasena" element={<OlvidoContrasena />} />
        <Route path="/restablecer/:token" element={<RestablecerContraseña />} />

        {/* 🔒 Rutas protegidas */}
        <Route
          path="/coordinador"
          element={
            <RutaProtegida>
              <PanelCoordinador />
            </RutaProtegida>
          }
        />

        <Route
          path="/secretaria"
          element={
            <RutaProtegida>
              <SecretariaInicio />
            </RutaProtegida>
          }
        />

        <Route
          path="/profesor"
          element={
            <RutaProtegida>
              <PanelProfesor />
            </RutaProtegida>
          }
        />

        <Route
          path="/acudiente"
          element={
            <RutaProtegida>
              <PanelAcudiente />
            </RutaProtegida>
          }
        />

        <Route
          path="/estudiante"
          element={
            <RutaProtegida>
              <PanelEstudiante />
            </RutaProtegida>
          }
        />
        <Route
          path="/Orientador"
          element={
            <RutaProtegida>
              <PanelOrientador />
            </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
