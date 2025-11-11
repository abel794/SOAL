const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EstadoAsistencia = sequelize.define('EstadoAsistencia', {
    id_estado_asistencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    }
  }, {
    tableName: 'estado_asistencia',
    timestamps: false,
  });

  // Asociación
  EstadoAsistencia.associate = (models) => {
    EstadoAsistencia.hasMany(models.Asistencia, {
      foreignKey: 'id_estado_asistencia',
      as: 'asistencias'
    });
  };

  return EstadoAsistencia;
};
