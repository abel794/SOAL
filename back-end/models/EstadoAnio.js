const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EstadoAnio = sequelize.define('EstadoAnio', {
    id_estado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_estado: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'estado_anio',
    timestamps: false
  });

  EstadoAnio.associate = (models) => {
    EstadoAnio.hasMany(models.EstudianteGrado, {
      foreignKey: 'id_estado',
      as: 'estudiantesGrado'
    });
  };

  return EstadoAnio;
};
