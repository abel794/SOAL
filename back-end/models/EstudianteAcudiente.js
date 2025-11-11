// back-end/models/EstudianteAcudiente.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EstudianteAcudiente = sequelize.define('EstudianteAcudiente', {
    id_estudiante_acudiente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_acudiente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_relacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'estudiante_acudiente',
    timestamps: false,
  });

  EstudianteAcudiente.associate = (models) => {
    // Pertenece a Estudiante
    EstudianteAcudiente.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });
    // Pertenece a Acudiente
    EstudianteAcudiente.belongsTo(models.Acudiente, {
      foreignKey: 'id_acudiente',
      as: 'acudiente'
    });
    // Pertenece a RelacionAcudiente
    EstudianteAcudiente.belongsTo(models.RelacionAcudiente, {
      foreignKey: 'id_relacion',
      as: 'relacion'
    });
  };

  return EstudianteAcudiente;
};
