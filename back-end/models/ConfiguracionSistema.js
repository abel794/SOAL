// models/ConfiguracionSistema.js

module.exports = (sequelize, DataTypes) => {
  const ConfiguracionSistema = sequelize.define('ConfiguracionSistema', {
    id_configuracion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_colegio: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    anio_escolar: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hora_cierre: {
      type: DataTypes.TIME,
      allowNull: false
    },
    activar_anio: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    medio_notificacion: {
      type: DataTypes.ENUM('Correo', 'WhatsApp', 'Ambos'),
      defaultValue: 'Correo'
    },
    horario_envio: {
      type: DataTypes.ENUM('mañana', 'tarde', 'noche'),
      defaultValue: 'mañana'
    },
    notificar_acudiente: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    max_estudiantes_curso: {
      type: DataTypes.INTEGER,
      defaultValue: 30
    },
    mensaje_institucional: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'configuracion_sistema',
    timestamps: false, // ya tienes fecha_actualizacion manual
    updatedAt: 'fecha_actualizacion'
  });

  return ConfiguracionSistema;
};
