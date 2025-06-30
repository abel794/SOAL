// Importamos el tipo de datos de Sequelize
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Definimos el modelo Estudiante
  const Estudiante = sequelize.define('Estudiante', {
    // ID único del estudiante, clave primaria y autoincremental
    id_estudiante: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Documento del estudiante (referencia a Persona), puede ser null en algunos casos
    numero_documento: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    // ID del usuario (relación con tabla Usuario), puede ser null si aún no tiene cuenta
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // ID de la EPS a la que está afiliado el estudiante
    id_eps: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Estado académico (activo, suspendido, retirado, etc.)
    id_estado_academico: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // ID del acudiente relacionado al estudiante
    id_acudiente: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    // Nombre real de la tabla en la base de datos
    tableName: 'estudiante',

    // No se usan los timestamps automáticos (createdAt, updatedAt)
    timestamps: false,
  });

  // Relacionamos este modelo con otros
  Estudiante.associate = (models) => {
    // Relación con Persona (por número_documento)
    Estudiante.belongsTo(models.Persona, {
      foreignKey: 'numero_documento',
      targetKey: 'numero_documento', // Relación no por ID, sino por documento
      as: 'persona'
    });

    // Relación con Usuario (para inicio de sesión)
    Estudiante.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });

    // Relación con EPS (seguridad social del estudiante)
    Estudiante.belongsTo(models.Eps, {
      foreignKey: 'id_eps',
      as: 'eps'
    });

    // Relación con EstadoAcadémico (activo, retirado, egresado, etc.)
    Estudiante.belongsTo(models.EstadoAcademico, {
      foreignKey: 'id_estado_academico',
      as: 'estadoAcademico'
    });

    // Relación con Acudiente (quien responde por el estudiante)
    Estudiante.belongsTo(models.Acudiente, {
      foreignKey: 'id_acudiente',
      as: 'acudiente'
    });

    // Inversas - un estudiante puede tener varias asistencias
    Estudiante.hasMany(models.Asistencia, {
      foreignKey: 'id_estudiante',
      as: 'asistencias'
    });

    // Un estudiante puede tener múltiples observaciones registradas
    Estudiante.hasMany(models.Observacion, {
      foreignKey: 'id_estudiante',
      as: 'observaciones'
    });

    // Un estudiante puede tener varias PQRs
    Estudiante.hasMany(models.Pqr, {
      foreignKey: 'id_estudiante',
      as: 'pqrs'
    });

    // Un estudiante puede tener varias citas (con orientador, coordinación, etc.)
    Estudiante.hasMany(models.Cita, {
      foreignKey: 'id_estudiante',
      as: 'citas'
    });

    // Un estudiante puede justificar ausencias (PDF, imagen, etc.)
    Estudiante.hasMany(models.Justificacion, {
      foreignKey: 'id_estudiante',
      as: 'justificaciones'
    });
  };

  // Retornamos el modelo definido
  return Estudiante;
};
