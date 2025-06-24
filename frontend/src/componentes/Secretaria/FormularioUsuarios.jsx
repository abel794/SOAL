import React, { useState } from "react";
import "./FormularioUsuarios.css";
import SelectorTipoUsuario from "./SelectorTipoUsuario";
import FormularioDatosEstudiantes from "./FormularioDatosEstudiantes";
import FormularioCuentaEstudiante from "./FormularioCuentaEstudiante";
import BotonesFormulario from "./BotonesFormulario";
import Paso from "./Paso";

const FormularioUsuarios = () => {
  const [pasoActual, setPasoActual] = useState(1);

  const [datosEstudiante, setDatosEstudiante] = useState({
    nombre: "",
    documento: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    email: "",
    direccion: "",
    localidad: "",
    barrio: "",
    grado: "",
    acudiente: "",
    foto: null
  });

  const avanzarPaso = () => setPasoActual(prev => prev + 1);
  const retrocederPaso = () => setPasoActual(prev => prev - 1);

  return (
    <div className="formulario-usuario">
      <h2 className="titulo-formulario">Creación de Usuarios</h2>
      <Paso pasoActual={pasoActual} />

      {pasoActual === 1 && (
        <>
          <SelectorTipoUsuario />
          <FormularioDatosEstudiantes
            datosEstudiante={datosEstudiante}
            setDatosEstudiante={setDatosEstudiante}
          />
        </>
      )}

      {pasoActual === 2 && (
        <FormularioCuentaEstudiante 
        datosEstudiante={datosEstudiante}
        setDatosEstudiante={setDatosEstudiante} />
      )}
        {/* Si hay un paso 3, puedes agregarlo así: */}
        {/* {pasoActual === 3 && <FormularioPermisos />} */}

      <BotonesFormulario
        pasoActual={pasoActual}
        avanzarPaso={avanzarPaso}
        retrocederPaso={retrocederPaso}
      />
    </div>
  );
};

export default FormularioUsuarios;

