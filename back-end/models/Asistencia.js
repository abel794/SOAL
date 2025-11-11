// models/asistencia.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Asistencia = sequelize.define('Asistencia', {
    id_asistencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_funcionario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_grado_asistencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grado_asistencia',
        key: 'id_grado_asistencia'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    id_estado_asistencia: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'asistencia',
    timestamps: false
  });

  // Asociaciones
  Asistencia.associate = (models) => {
    Asistencia.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });

    Asistencia.belongsTo(models.Funcionario, {
      foreignKey: 'id_funcionario',
      as: 'funcionario'
    });

    Asistencia.belongsTo(models.GradoAsistencia, {
      foreignKey: 'id_grado_asistencia',
      as: 'gradoAsistencia'
    });

    Asistencia.belongsTo(models.EstadoAsistencia, {
      foreignKey: 'id_estado_asistencia',
      as: 'estadoAsistencia'
    });
  };

  return Asistencia;
};
