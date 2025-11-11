// back-end/models/Estudiante.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Estudiante = sequelize.define('Estudiante', {
    id_estudiante: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_documento: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_eps: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_estado_academico: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'estudiante',
    timestamps: false,
  });

  Estudiante.associate = (models) => {
    // Persona
    Estudiante.belongsTo(models.Persona, {
      foreignKey: 'numero_documento',
      targetKey: 'numero_documento',
      as: 'persona'
    });
    // Usuario
    Estudiante.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });
    // EPS
    Estudiante.belongsTo(models.Eps, {
      foreignKey: 'id_eps',
      as: 'eps'
    });
    // Estado académico
    Estudiante.belongsTo(models.EstadoAcademico, {
      foreignKey: 'id_estado_academico',
      as: 'estadoAcademico'
    });
    // Acudientes (M:N)
    Estudiante.belongsToMany(models.Acudiente, {
      through: models.EstudianteAcudiente,
      foreignKey: 'id_estudiante',
      otherKey: 'id_acudiente',
      as: 'acudientes'
    });
    // Relación directa a la tabla pivote para includes complejos
    Estudiante.hasMany(models.EstudianteAcudiente, {
      foreignKey: 'id_estudiante',
      as: 'pivotes'
    });
    
    Estudiante.hasMany(models.EstudianteGrado, {
    foreignKey: 'id_estudiante',
    as: 'gradosAsignados'
  });
    // Otras 1:N...
    Estudiante.hasMany(models.Asistencia, { foreignKey: 'id_estudiante', as: 'asistencias' });
    Estudiante.hasMany(models.Observacion, { foreignKey: 'id_estudiante', as: 'observaciones' });
    Estudiante.hasMany(models.Pqr,         { foreignKey: 'id_estudiante', as: 'pqrs' });
    Estudiante.hasMany(models.Cita,        { foreignKey: 'id_estudiante', as: 'citas' });
    Estudiante.hasMany(models.Justificacion,{ foreignKey: 'id_estudiante', as: 'justificaciones' });
  };

  return Estudiante;
};
