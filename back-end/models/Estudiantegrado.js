const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Definición del modelo intermedio entre Estudiante y Grado
  const EstudianteGrado = sequelize.define('EstudianteGrado', {
    // ID único de la tabla estudiante_grado
    id_estudiante_grado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Clave foránea al estudiante
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Clave foránea al grado
    id_grado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Año académico en que cursa el grado
    anio_academico: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Indica si la relación estudiante-grado está activa
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    // Nombre de la tabla real
    tableName: 'estudiante_grado',
    // No se manejan createdAt ni updatedAt
    timestamps: false,
  });

  // Asociaciones
  EstudianteGrado.associate = (models) => {
    // Relación con estudiante
    EstudianteGrado.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });

    // Relación con grado
    EstudianteGrado.belongsTo(models.Grado, {
      foreignKey: 'id_grado',
      as: 'grado'
    });
  };

  return EstudianteGrado;
};
