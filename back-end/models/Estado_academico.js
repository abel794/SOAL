const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EstadoAcademico = sequelize.define('EstadoAcademico', {
    id_estado_academico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    }
  }, {
    tableName: 'estado_academico',
    timestamps: false,
  });

  // Asociación con Estudiante
  EstadoAcademico.associate = (models) => {
    EstadoAcademico.hasMany(models.Estudiante, {
      foreignKey: 'id_estado_academico',
      as: 'estudiantes'
    });
  };

  return EstadoAcademico;
};
