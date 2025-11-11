const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EstudianteGrado = sequelize.define('EstudianteGrado', {
    id_estudiante_grado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_grado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    anio_academico: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    tableName: 'estudiante_grado',
    timestamps: false,
  });

  // Asociaciones internas del modelo
  EstudianteGrado.associate = (models) => {
    // ✅ Alias modificado para evitar conflicto
    EstudianteGrado.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudianteAsignado'
    });

    EstudianteGrado.belongsTo(models.Grado, {
      foreignKey: 'id_grado',
      as: 'grado'
    });
  };

  return EstudianteGrado;
};
