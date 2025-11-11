import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoaderBar from "./LoaderBar";
import './RegistroMultistep.css';
import ModalMensaje from "../../ui/ModalMensaje.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  FaUserGraduate, 
  FaUserTie, 
  FaFileUpload, 
  FaCheck, 
  FaSearch,
  FaIdCard,
  FaFilePdf,
  FaImages,
  FaShieldAlt
} from 'react-icons/fa';

/**
 * Map de relaciones (nombre -> id en la BD)
 * Asegúrate que estos IDs coincidan con los de tu tabla relacionAcudiente
 */
const RELACIONES_MAP = {
  "Tutor Legal": 1,
  "Cuidador": 2,
  "Padre": 3,
  "Madre": 4,
  "Tío": 5,
  "Abuela": 6,
  "Hermano": 7
};

export default function RegistroMultistep() {
  const [step, setStep] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accionConfirmada, setAccionConfirmada] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [aceptaTratamiento, setAceptaTratamiento] = useState(false);
  const [loading, setLoading] = useState(false);

  const [catalogos, setCatalogos] = useState({
    sexos: [], tiposDocumento: [], eps: [], estadosAcademicos: [], grados: [], relaciones: []
  });

  const initialFormData = {
    estudiante: {
      nombre: '', apellido: '', numero_documento: '', correo: '', telefono: '',
      direccion: '', ciudad: '', tipo_sangre: '', discapacidad: '', ocupacion: '',
      fecha_nacimiento: '', sexo: '', tipo_documento: '', eps: '', estado_academico: ''
    },
    acudiente: {
      nombre: '', apellido: '', numero_documento: '', correo: '', telefono: '',
      direccion: '', ciudad: '', tipo_sangre: '', discapacidad: '', ocupacion: '',
      fecha_nacimiento: '', sexo: '', tipo_documento: ''
    },
    id_grado: '',
    id_relacion: '',
    archivos: {
      fotoEstudiante: null,
      cedulaEstudiante: null,
      cedulaAcudiente: null,
      registroAnteriorColegio: null,
      certificadoEPS: null,
      reciboServicio: null
    }
  };
  const [formData, setFormData] = useState(initialFormData);

  // refs para inputs file
  const fotoEstudianteRef = useRef(null);
  const cedulaEstudianteRef = useRef(null);
  const cedulaAcudienteRef = useRef(null);
  const registroAnteriorRef = useRef(null);
  const certificadoEPSRef = useRef(null);
  const reciboServicioRef = useRef(null);

  const refs = {
    fotoEstudiante: fotoEstudianteRef,
    cedulaEstudiante: cedulaEstudianteRef,
    cedulaAcudiente: cedulaAcudienteRef,
    registroAnteriorColegio: registroAnteriorRef,
    certificadoEPS: certificadoEPSRef,
    reciboServicio: reciboServicioRef
  };

  // Estados para el flujo del acudiente
  const [acudienteExistente, setAcudienteExistente] = useState(null);
  const [preguntarAcudiente, setPreguntarAcudiente] = useState(false);
  const [busquedaAcudiente, setBusquedaAcudiente] = useState('');
  const [resultadosAcudientes, setResultadosAcudientes] = useState([]);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [sexos, tiposDocumento, eps, estados, grados, relaciones] = await Promise.all([
          fetch('http://localhost:3000/api/coordinador/sexo').then(res => res.ok ? res.json() : []),
          fetch('http://localhost:3000/api/coordinador/tipoDocumento').then(res => res.ok ? res.json() : []),
          fetch('http://localhost:3000/api/coordinador/eps').then(res => res.ok ? res.json() : []),
          fetch('http://localhost:3000/api/coordinador/estadoAcademico').then(res => res.ok ? res.json() : []),
          fetch('http://localhost:3000/api/coordinador/grado').then(res => res.ok ? res.json() : []),
          fetch('http://localhost:3000/api/coordinador/relacionAcudiente').then(res => res.ok ? res.json() : [])
        ]);
        setCatalogos({ sexos, tiposDocumento, eps, estadosAcademicos: estados, grados, relaciones });
      } catch (err) {
        console.error('❌ Error al cargar catálogos:', err);
        setMensaje('❌ Error al cargar catálogos. Revisa la consola.');
        setTimeout(() => setMensaje(''), 6000);
      }
    };
    fetchCatalogos();
  }, []);

  const handleChange = (e, tipo, campo) => {
    setFormData(prev => ({ ...prev, [tipo]: { ...prev[tipo], [campo]: e.target.value } }));
  };

  const handleFileChange = (e, campo) => {
    const file = e.target.files[0] || null;
    setFormData(prev => ({ ...prev, archivos: { ...prev.archivos, [campo]: file } }));
  };

  const camposPersona = [
    { nombre: 'nombre', label: 'Nombre', icon: FaUserGraduate },
    { nombre: 'apellido', label: 'Apellido', icon: FaUserGraduate },
    { nombre: 'numero_documento', label: 'Documento', icon: FaIdCard },
    { nombre: 'correo', label: 'Correo', type: 'email' },
    { nombre: 'telefono', label: 'Teléfono', type: 'tel' },
    { nombre: 'direccion', label: 'Dirección' },
    { nombre: 'ciudad', label: 'Ciudad' },
    { nombre: 'tipo_sangre', label: 'Tipo de Sangre' },
    { nombre: 'discapacidad', label: 'Discapacidad' },
    { nombre: 'ocupacion', label: 'Ocupación' },
    { nombre: 'fecha_nacimiento', label: 'Fecha de Nacimiento', type: 'date' }
  ];

  const validarPaso = () => {
    if (step === 1) {
      const est = formData.estudiante;
      if (!est.nombre || !est.apellido || !est.numero_documento || !est.correo ||
          !est.sexo || !est.tipo_documento || !est.eps || !est.estado_academico || !formData.id_grado) {
        setMensaje('⚠️ Faltan campos por llenar en el formulario del estudiante');
        setTimeout(() => setMensaje(''), 5000);
        return false;
      }
      if (!aceptaTratamiento) {
        setMensaje('⚠️ Debes aceptar el tratamiento de datos personales para continuar');
        setTimeout(() => setMensaje(''), 5000);
        return false;
      }
    }

    if (step === 2 && !acudienteExistente && !mostrarBuscador) {
      const ac = formData.acudiente;
      if (!ac.nombre || !ac.apellido || !ac.numero_documento || !ac.correo ||
          !ac.sexo || !ac.tipo_documento || !formData.id_relacion) {
        setMensaje('⚠️ Faltan campos por llenar en el formulario del acudiente');
        setTimeout(() => setMensaje(''), 5000);
        return false;
      }
    }

    if (step === 3) {
      const archivos = formData.archivos;
      const archivosRequeridos = [
        'fotoEstudiante',
        'cedulaEstudiante',
        'cedulaAcudiente',
        'registroAnteriorColegio',
        'certificadoEPS'
      ];

      const archivosFaltantes = archivosRequeridos.filter(archivo => !archivos[archivo]);
      if (archivosFaltantes.length > 0) {
        setMensaje('⚠️ Debes subir todos los documentos requeridos');
        setTimeout(() => setMensaje(''), 5000);
        return false;
      }
    }

    return true;
  };

  const avanzar = () => {
    if (!validarPaso()) return;

    if (step === 1) {
      setPreguntarAcudiente(true);
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const retroceder = () => {
    if (step > 1) {
      if (step === 2 && mostrarBuscador) {
        setMostrarBuscador(false);
        setPreguntarAcudiente(true);
      } else {
        setStep(step - 1);
      }
    }
  };

  const manejarRespuestaAcudiente = (existe) => {
    setPreguntarAcudiente(false);
    if (existe) {
      setMostrarBuscador(true);
      setStep(2);
    } else {
      setMostrarBuscador(false);
      setStep(2);
    }
  };

  const pedirConfirmacion = (accion, message = '¿Estás seguro?') => {
    setAccionConfirmada(() => accion);
    setConfirmMessage(message);
    setShowConfirm(true);
  };

  const ejecutarAccion = async () => {
    setShowConfirm(false);
    if (accionConfirmada) {
      try {
        setLoading(true);
        await accionConfirmada();
      } finally {
        setLoading(false);
        setAccionConfirmada(null);
        setConfirmMessage('');
      }
    }
  };

  // Buscar acudientes (acepta array o objeto)
  const buscarAcudientes = async (query) => {
    if (!query) {
      setResultadosAcudientes([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/coordinador/registrarEstudianteRoute/buscarAcudiente?documento=${encodeURIComponent(query)}`);
      if (!res.ok) {
        setResultadosAcudientes([]);
        return;
      }
      const data = await res.json();
      // backend puede devolver un array o un objeto
      if (Array.isArray(data)) setResultadosAcudientes(data);
      else if (data) setResultadosAcudientes([data]);
      else setResultadosAcudientes([]);
    } catch (err) {
      console.error('❌ Error al buscar acudiente:', err);
      setResultadosAcudientes([]);
    }
  };

  const seleccionarAcudiente = (ac) => {
    // Si el backend no incluye 'estudiantes' maneja ese caso
    if (!ac.estudiantes || ac.estudiantes.length === 0) {
      setMensaje('⚠️ Este acudiente no tiene relación con ningún estudiante, debes seleccionar un parentesco.');
      setTimeout(() => setMensaje(''), 6000);
      return;
    }

    // Intentar extraer la relación que trae el backend (puede ser nombre)
    const relacionName = ac.estudiantes?.[0]?.relacion || null;
    const relacionIdFromName = relacionName ? RELACIONES_MAP[relacionName] : null;
    // También puede venir id_relacion desde backend; si existe úsalo
    const id_relacion_backend = ac.estudiantes?.[0]?.id_relacion || null;
    const relacionId = id_relacion_backend || relacionIdFromName || null;

    // Guardamos la relación dentro del objeto acudiente para usarla en el submit
    const acudienteConRelacion = {
      ...ac,
      relacionId: relacionId,
      relacionName: relacionName || null
    };

    setAcudienteExistente(acudienteConRelacion);

    // Prellenar datos del formulario de acudiente (solo lectura lógica)
    setFormData(prev => ({
      ...prev,
      acudiente: {
        nombre: ac.nombre,
        apellido: ac.apellido,
        numero_documento: ac.numero_documento,
        correo: ac.correo || '',
        telefono: ac.telefono || '',
        direccion: ac.direccion || '',
        ciudad: ac.ciudad || '',
        sexo: ac.id_sexo ? String(ac.id_sexo) : (ac.sexo || ''),
        tipo_documento: ac.id_tipo_documento ? String(ac.id_tipo_documento) : (ac.tipo_documento || '')
      },
      // si se obtuvo relacionId, la prellenamos como string para el select (aunque lo deshabilitaremos)
      id_relacion: relacionId ? String(relacionId) : prev.id_relacion
    }));

    setResultadosAcudientes([]);
    setMostrarBuscador(false);
    setStep(3); // pasamos a paso 3 (documentos) asumiendo que la relación queda tomada
  };

  // ---------- FUNCIONES DE ENVÍO MEJORADAS ----------
  const formatoFecha = (valor) => {
    if (!valor) return null;
    // Manejar input type=date (valor YYYY-MM-DD) o Date string
    const d = new Date(valor);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const parseId = (v) => {
    if (v === '' || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  const limpiarInputsFile = () => {
    Object.values(refs).forEach(ref => {
      if (ref && ref.current) ref.current.value = '';
    });
  };

  const submitRegistro = async () => {
    // Validación final antes de enviar
    if (!validarPaso()) return;

    const data = new FormData();
    const archivosRequeridos = [
      'fotoEstudiante',
      'cedulaEstudiante',
      'cedulaAcudiente',
      'registroAnteriorColegio',
      'certificadoEPS',
      'reciboServicio'
    ];

    archivosRequeridos.forEach(key => {
      const file = formData.archivos[key];
      if (file) data.append(key, file);
    });

    // Determinar id_relacion a enviar:
    //  - Si acudienteExistente trae relacionId, la usamos (backend ya la conoce).
    //  - Si no, usamos la selección del usuario (formData.id_relacion).
    const relacionDesdeAcudiente = acudienteExistente?.relacionId ? parseId(acudienteExistente.relacionId) : null;
    const relacionDesdeFormulario = parseId(formData.id_relacion);
    const idRelacionFinal = relacionDesdeAcudiente || relacionDesdeFormulario || null;

    const payload = {
      estudiante: {
        numero_documento: formData.estudiante.numero_documento || null,
        nombre: formData.estudiante.nombre || null,
        apellido: formData.estudiante.apellido || null,
        correo: formData.estudiante.correo || null,
        telefono: formData.estudiante.telefono || null,
        direccion: formData.estudiante.direccion || null,
        ciudad_residencia: formData.estudiante.ciudad || null,
        tipo_sangre: formData.estudiante.tipo_sangre || null,
        discapacidad: formData.estudiante.discapacidad || null,
        ocupacion: formData.estudiante.ocupacion || null,
        fecha_nacimiento: formatoFecha(formData.estudiante.fecha_nacimiento),
        id_sexo: parseId(formData.estudiante.sexo),
        id_tipo_documento: parseId(formData.estudiante.tipo_documento),
        id_eps: parseId(formData.estudiante.eps),
        id_estado_academico: parseId(formData.estudiante.estado_academico)
      },
      id_grado: parseId(formData.id_grado),
      acudiente: acudienteExistente
        ? { id_acudiente: acudienteExistente.id_acudiente }
        : {
            numero_documento: formData.acudiente.numero_documento || null,
            nombre: formData.acudiente.nombre || null,
            apellido: formData.acudiente.apellido || null,
            correo: formData.acudiente.correo || null,
            telefono: formData.acudiente.telefono || null,
            direccion: formData.acudiente.direccion || null,
            ciudad_residencia: formData.acudiente.ciudad || null,
            id_sexo: parseId(formData.acudiente.sexo),
            id_tipo_documento: parseId(formData.acudiente.tipo_documento)
          },
      id_relacion: idRelacionFinal
    };

    // Validaciones preventivas para evitar error FK (mejor UX)
    if (!payload.estudiante.id_sexo || !payload.estudiante.id_tipo_documento || !payload.id_grado || !payload.estudiante.id_eps || !payload.estudiante.id_estado_academico) {
      setMensaje('⚠️ Faltan campos obligatorios o no están bien seleccionados (sexo, tipo de documento, EPS, estado académico o grado).');
      setTimeout(() => setMensaje(''), 6000);
      return;
    }
    if (!payload.estudiante.fecha_nacimiento) {
      setMensaje('⚠️ Fecha de nacimiento inválida o no proporcionada.');
      setTimeout(() => setMensaje(''), 6000);
      return;
    }

    // Si acudiente existe pero no trae relación y usuario no seleccionó ninguna -> error
    if (acudienteExistente && !idRelacionFinal) {
      setMensaje('⚠️ El acudiente existe pero no se encontró relación previa. Selecciona el parentesco en el formulario.');
      setTimeout(() => setMensaje(''), 6000);
      return;
    }
    // Si acudiente es nuevo, debe haber id_relacion
    if (!acudienteExistente && !idRelacionFinal) {
      setMensaje('⚠️ Debes seleccionar el parentesco (relación) con el acudiente.');
      setTimeout(() => setMensaje(''), 6000);
      return;
    }

    // Adjuntar formulario ya mapeado al FormData
    data.append('formulario', JSON.stringify(payload));

    // Debug: mostrar payload y nombre de archivos (quita en producción)
    console.log('📤 Payload a enviar:', payload);
    for (let pair of data.entries()) {
      // pair[1] puede ser File o string
      if (pair[1] instanceof File) {
        console.log(pair[0], pair[1].name);
      } else {
        console.log(pair[0], pair[1]);
      }
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/coordinador/registrarEstudianteRoute', {
        method: 'POST',
        body: data
        // NO establecer Content-Type aquí; fetch lo gestiona para multipart/form-data
      });

      const json = await res.json();

      if (res.ok) {
        setUsuarioGenerado(json);
        setMensaje('✅ Registro exitoso');
        setFormData(initialFormData);
        setAceptaTratamiento(false);
        setAcudienteExistente(null);
        setMostrarBuscador(false);
        limpiarInputsFile();
        setStep(1);
      } else {
        if (json.detalles && Array.isArray(json.detalles)) {
          const erroresUsuario = json.detalles.map(d => {
            if (d.campo === 'correo') return 'El correo ya está registrado';
            if (d.campo === 'numero_documento') return 'El número de documento ya está registrado';
            return `El valor de ${d.campo} es inválido o ya existe`;
          });
          setMensaje(`⚠️ ${erroresUsuario.join(', ')}`);
        } else {
          setMensaje(json.mensaje || '❌ Error al registrar');
        }
      }
    } catch (err) {
      console.error('❌ Error de red:', err);
      setMensaje('❌ Error de red al enviar el formulario');
    } finally {
      setLoading(false);
      setTimeout(() => setMensaje(''), 8000);
    }
  };

  const pasos = [
    { id: 1, label: 'Estudiante', icon: FaUserGraduate, desc: 'Datos personales' },
    { id: 2, label: 'Acudiente', icon: FaUserTie, desc: 'Información del acudiente' },
    { id: 3, label: 'Documentos', icon: FaFileUpload, desc: 'Subir archivos' }
  ];

  const documentos = [
    { key: 'fotoEstudiante', label: 'Foto del Estudiante', required: true, icon: FaImages, accept: 'image/*' },
    { key: 'cedulaEstudiante', label: 'Documento de Identidad', required: true, icon: FaIdCard, accept: '.pdf,image/*' },
    { key: 'cedulaAcudiente', label: 'Cédula del Acudiente', required: true, icon: FaIdCard, accept: '.pdf,image/*' },
    { key: 'registroAnteriorColegio', label: 'Certificado de Estudios', required: true, icon: FaFilePdf, accept: '.pdf,image/*' },
    { key: 'certificadoEPS', label: 'Certificado EPS', required: true, icon: FaFilePdf, accept: '.pdf,image/*' },
    { key: 'reciboServicio', label: 'Recibo de Servicio', required: false, icon: FaFilePdf, accept: '.pdf,image/*' }
  ];

  return (
    <div className="registro-moderno-container">
      <motion.div 
        className="registro-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <FaUserGraduate className="header-icon" />
          <div>
            <h1>Registro de Estudiante</h1>
            <p className="header-subtitle">Complete la información requerida para matricular al estudiante</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="progress-steps-moderno">
        {pasos.map((paso, index) => {
          const isActive = step === paso.id;
          const isCompleted = step > paso.id;
          
          return (
            <div key={paso.id} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-indicator">
                {isCompleted ? (
                  <FaCheck className="step-icon" />
                ) : (
                  <paso.icon className="step-icon" />
                )}
              </div>
              <div className="step-content">
                <span className="step-label">{paso.label}</span>
                <span className="step-desc">{paso.desc}</span>
              </div>
              {index < pasos.length - 1 && <div className="step-connector" />}
            </div>
          );
        })}
      </div>

      <form onSubmit={e => e.preventDefault()} className="form-moderno">
        <AnimatePresence mode="wait">
          {/* Paso 1 - Estudiante */}
          {step === 1 && (
            <motion.div 
              key="estudiante" 
              className="form-step-moderno"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="step-header">
                <FaUserGraduate className="step-title-icon" />
                <h3>Datos del Estudiante</h3>
              </div>
              
              <div className="form-grid">
                {camposPersona.map(campo => (
                  <div key={campo.nombre} className="form-group-moderno">
                    <label className="form-label">
                      {campo.icon && <campo.icon className="label-icon" />}
                      {campo.label} <span className="required">*</span>
                    </label>
                    <input 
                      type={campo.type || 'text'} 
                      value={formData.estudiante[campo.nombre]} 
                      onChange={e => handleChange(e, 'estudiante', campo.nombre)}
                      className="form-input-moderno"
                      placeholder={`Ingrese ${campo.label.toLowerCase()}`}
                    />
                  </div>
                ))}

                <div className="form-group-moderno">
                  <label className="form-label">
                    <FaUserGraduate className="label-icon" />
                    Sexo <span className="required">*</span>
                  </label>
                  <select 
                    value={formData.estudiante.sexo} 
                    onChange={e => handleChange(e, 'estudiante', 'sexo')}
                    className="form-select-moderno"
                  >
                    <option value="">Seleccione sexo</option>
                    {catalogos.sexos.map(op => (
                      <option key={op.id_sexo} value={op.id_sexo}>{op.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-moderno">
                  <label className="form-label">
                    <FaIdCard className="label-icon" />
                    Tipo de documento <span className="required">*</span>
                  </label>
                  <select 
                    value={formData.estudiante.tipo_documento} 
                    onChange={e => handleChange(e, 'estudiante', 'tipo_documento')}
                    className="form-select-moderno"
                  >
                    <option value="">Seleccione tipo de documento</option>
                    {catalogos.tiposDocumento.map(op => (
                      <option key={op.id_tipo_documento} value={op.id_tipo_documento}>{op.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-moderno">
                  <label className="form-label">
                    <FaFilePdf className="label-icon" />
                    EPS <span className="required">*</span>
                  </label>
                  <select 
                    value={formData.estudiante.eps} 
                    onChange={e => handleChange(e, 'estudiante', 'eps')}
                    className="form-select-moderno"
                  >
                    <option value="">Seleccione EPS</option>
                    {catalogos.eps.map(op => (
                      <option key={op.id_eps} value={op.id_eps}>{op.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-moderno">
                  <label className="form-label">
                    <FaUserGraduate className="label-icon" />
                    Estado académico <span className="required">*</span>
                  </label>
                  <select 
                    value={formData.estudiante.estado_academico} 
                    onChange={e => handleChange(e, 'estudiante', 'estado_academico')}
                    className="form-select-moderno"
                  >
                    <option value="">Seleccione estado académico</option>
                    {catalogos.estadosAcademicos.map(op => (
                      <option key={op.id_estado_academico} value={op.id_estado_academico}>{op.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-moderno">
                  <label className="form-label">
                    <FaUserGraduate className="label-icon" />
                    Grado <span className="required">*</span>
                  </label>
                  <select 
                    value={formData.id_grado} 
                    onChange={e => setFormData(prev => ({ ...prev, id_grado: e.target.value }))}
                    className="form-select-moderno"
                  >
                    <option value="">Seleccione grado</option>
                    {catalogos.grados.map(op => (
                      <option key={op.id_grado} value={op.id_grado}>{op.nombre_grado}</option>
                    ))}
                  </select>
                </div>
              </div>
                <div className="tratamiento-datos">
                  <div className="checkbox-moderno">
                    <input 
                      id="chkTratamiento" 
                      type="checkbox" 
                      checked={aceptaTratamiento} 
                      onChange={() => setAceptaTratamiento(prev => !prev)} 
                    />
                    <label htmlFor="chkTratamiento" className="checkbox-label">
                      <FaShieldAlt className="checkbox-icon" />
                      Acepto el tratamiento de mis datos personales según la{" "}
                      <a 
                        href="/documentacion/tratamiento-de-datos.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link-politica"
                      >
                        ley de protección de datos
                      </a>
                      <span className="required">*</span>
                    </label>
                  </div>
                </div>
            </motion.div>
          )}

          {/* Paso 2 - Acudiente */}
          {step === 2 && (
            <motion.div 
              key="acudiente" 
              className="form-step-moderno"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="step-header">
                <FaUserTie className="step-title-icon" />
                <h3>Datos del Acudiente</h3>
              </div>

              {mostrarBuscador && (
                <div className="buscador-moderno">
                  <div className="buscador-header">
                    <FaSearch className="buscador-icon" />
                    <h4>Buscar Acudiente Registrado</h4>
                  </div>
                  
                  <div className="form-group-moderno">
                    <label className="form-label">
                      <FaIdCard className="label-icon" />
                      Número de documento del acudiente <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={busquedaAcudiente}
                      onChange={e => {
                        setBusquedaAcudiente(e.target.value);
                        buscarAcudientes(e.target.value);
                      }}
                      className="form-input-moderno"
                      placeholder="Ingrese el número de documento"
                    />
                  </div>

                  {resultadosAcudientes.length > 0 && (
                    <div className="resultados-moderno">
                      <h5>Resultados de búsqueda:</h5>
                      <div className="resultados-grid">
                        {resultadosAcudientes.map(ac => (
                          <div key={ac.id_acudiente} className="resultado-card" onClick={() => seleccionarAcudiente(ac)}>
                            <div className="resultado-header">
                              <FaUserTie className="resultado-icon" />
                              <strong>{ac.nombre} {ac.apellido}</strong>
                            </div>
                            <div className="resultado-info">
                              <span>📄 Documento: {ac.numero_documento}</span>
                              <span>📞 Teléfono: {ac.telefono || 'No registrado'}</span>
                              <span>✉️ Correo: {ac.correo || 'No registrado'}</span>
                            </div>
                            {ac.estudiantes && ac.estudiantes.length > 0 && (
                              <div className="estudiantes-asociados">
                                <strong>🎓 Estudiantes registrados:</strong>
                                <ul>
                                  {ac.estudiantes.map(est => (
                                    <li key={est.id_estudiante}>{est.nombre} {est.apellido} <br /> Relacion: {est.relacion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="botones-buscador-moderno">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => { setMostrarBuscador(false); setPreguntarAcudiente(true); }}
                    >
                      ← Volver
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => { setMostrarBuscador(false); manejarRespuestaAcudiente(false); }}
                    >
                      Registrar nuevo acudiente
                    </button>
                  </div>
                </div>
              )}

              {!mostrarBuscador && !acudienteExistente && (
                <div className="form-grid">
                  {camposPersona.map(campo => (
                    <div key={campo.nombre} className="form-group-moderno">
                      <label className="form-label">
                        {campo.icon && <campo.icon className="label-icon" />}
                        {campo.label} <span className="required">*</span>
                      </label>
                      <input 
                        type={campo.type || 'text'} 
                        value={formData.acudiente[campo.nombre]} 
                        onChange={e => handleChange(e, 'acudiente', campo.nombre)}
                        className="form-input-moderno"
                        placeholder={`Ingrese ${campo.label.toLowerCase()}`}
                      />
                    </div>
                  ))}

                  <div className="form-group-moderno">
                    <label className="form-label">
                      <FaUserTie className="label-icon" />
                      Sexo <span className="required">*</span>
                    </label>
                    <select 
                      value={formData.acudiente.sexo} 
                      onChange={e => handleChange(e, 'acudiente', 'sexo')}
                      className="form-select-moderno"
                    >
                      <option value="">Seleccione sexo</option>
                      {catalogos.sexos.map(op => (
                        <option key={op.id_sexo} value={op.id_sexo}>{op.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-moderno">
                    <label className="form-label">
                      <FaIdCard className="label-icon" />
                      Tipo documento <span className="required">*</span>
                    </label>
                    <select 
                      value={formData.acudiente.tipo_documento} 
                      onChange={e => handleChange(e, 'acudiente', 'tipo_documento')}
                      className="form-select-moderno"
                    >
                      <option value="">Seleccione tipo de documento</option>
                      {catalogos.tiposDocumento.map(op => (
                        <option key={op.id_tipo_documento} value={op.id_tipo_documento}>{op.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-moderno">
                    <label className="form-label">
                      <FaUserTie className="label-icon" />
                      Parentesco <span className="required">*</span>
                    </label>
                    <select 
                      value={formData.id_relacion} 
                      onChange={e => setFormData(prev => ({ ...prev, id_relacion: e.target.value }))}
                      className="form-select-moderno"
                    >
                      <option value="">Seleccione parentesco</option>
                      {catalogos.relaciones.map(op => (
                        <option key={op.id_relacion} value={op.id_relacion}>{op.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {acudienteExistente && (
                <div className="acudiente-existente">
                  <div className="existente-card">
                    <div className="existente-header">
                      <FaUserTie className="existente-icon" />
                      <h4>Acudiente Encontrado</h4>
                    </div>
                    <div className="existente-info">
                      <p><strong>Nombre:</strong> {acudienteExistente.nombre} {acudienteExistente.apellido}</p>
                      <p><strong>Documento:</strong> {acudienteExistente.numero_documento}</p>
                      <p><strong>Correo:</strong> {acudienteExistente.correo || 'No registrado'}</p>
                    </div>
                    <div className="form-group-moderno">
                      <label className="form-label">
                        <FaUserTie className="label-icon" />
                        Parentesco <span className="required">*</span>
                      </label>

                      {/* Si la relación vino desde el backend, la mostramos y la deshabilitamos.
                          Si no vino, permitimos seleccionar una */}
                      <select
                        value={formData.id_relacion}
                        onChange={e => setFormData(prev => ({ ...prev, id_relacion: e.target.value }))}
                        className="form-select-moderno"
                        disabled={!!acudienteExistente.relacionId}
                      >
                        <option value="">Seleccione parentesco</option>
                        {catalogos.relaciones.map(op => (
                          <option key={op.id_relacion} value={op.id_relacion}>{op.nombre}</option>
                        ))}
                      </select>

                      {acudienteExistente.relacionName && (
                        <small className="text-muted mt-2 d-block">
                          Relación existente: <strong>{acudienteExistente.relacionName}</strong> — no se puede cambiar desde aquí.
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Paso 3 - Documentos */}
          {step === 3 && (
            <motion.div 
              key="archivos" 
              className="form-step-moderno"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="step-header">
                <FaFileUpload className="step-title-icon" />
                <h3>Subir Documentos Requeridos</h3>
              </div>

              <div className="documentos-grid-moderno">
                {documentos.map(doc => (
                  <div key={doc.key} className="documento-card">
                    <div className="documento-header">
                      <doc.icon className="documento-icon" />
                      <div>
                        <h5>{doc.label}</h5>
                        {doc.required && <span className="required-badge">Requerido</span>}
                      </div>
                    </div>
                    <p className="documento-desc">
                      {doc.required ? 'Este documento es obligatorio' : 'Documento opcional'}
                    </p>
                    <input 
                      type="file" 
                      accept={doc.accept}
                      ref={refs[doc.key]}
                      onChange={e => handleFileChange(e, doc.key)}
                      className="file-input-moderno"
                    />
                    {formData.archivos[doc.key] && (
                      <div className="file-selected">
                        <FaCheck className="file-check" />
                        <span>Archivo seleccionado: {formData.archivos[doc.key].name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="finalizar-section">
                <button 
                  type="button" 
                  className="btn-finalizar"
                  onClick={() => pedirConfirmacion(submitRegistro, '¿Estás seguro de inscribir al estudiante y acudiente?')} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Procesando registro...
                    </>
                  ) : (
                    <>
                      <FaCheck className="btn-icon" />
                      Finalizar Registro
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        {step > 1 && (
          <button 
            type="button" 
            onClick={retroceder} 
            disabled={loading}
            className="btn-navigation btn-prev"
          >
            ← Anterior
          </button>
        )}
        {step < 3 && (
          <button 
            type="button" 
            onClick={avanzar} 
            disabled={loading}
            className="btn-navigation btn-next"
          >
            {step === 1 ? 'Siguiente →' : 'Continuar a Documentos →'}
          </button>
        )}
      </div>

      {/* Modal confirmación */}
      <ModalMensaje
        visible={showConfirm}
        tipo="confirmacion"
        titulo="Confirmación"
        mensaje={confirmMessage}
        onClose={() => setShowConfirm(false)}
        onConfirm={ejecutarAccion}
      />

      {/* Modal pregunta existencia acudiente */}
      {preguntarAcudiente && (
        <div className="overlay-pregunta-moderno">
          <motion.div 
            className="modal-pregunta-moderno"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-header-moderno">
              <FaSearch className="modal-icon" />
              <h4>¿El acudiente ya está registrado en el sistema?</h4>
            </div>
            <p>Selecciona una opción para continuar con el registro:</p>
            <div className="modal-actions-moderno">
              <button className="btn-modal btn-modal-primary" onClick={() => manejarRespuestaAcudiente(true)}>
                <FaSearch className="btn-modal-icon" />
                Sí, buscar acudiente registrado
              </button>
              <button className="btn-modal btn-modal-success" onClick={() => manejarRespuestaAcudiente(false)}>
                <FaUserTie className="btn-modal-icon" />
                No, registrar nuevo acudiente
              </button>
              <button className="btn-modal btn-modal-cancel" onClick={() => setPreguntarAcudiente(false)}>
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {mensaje && (
        <ModalMensaje
          visible={!!mensaje}
          tipo={mensaje.startsWith("❌") ? "error" : mensaje.startsWith("⚠️") ? "advertencia" : "exito"}
          titulo="Notificación"
          mensaje={mensaje}
          onClose={() => { setMensaje(''); setUsuarioGenerado(null); }}
        />
      )}
    </div>
  );
}
