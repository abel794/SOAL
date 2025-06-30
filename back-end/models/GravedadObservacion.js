const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Definición del modelo GravedadObservacion
  const GravedadObservacion = sequelize.define('GravedadObservacion', {
    // Clave primaria auto incremental
    id_gravedad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Nombre del nivel de gravedad (Ej: Leve, Moderada, Grave)
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // No se permite duplicar nombres de gravedad
    }
  }, {
    tableName: 'gravedad_observacion', // Nombre real de la tabla
    timestamps: false // No usar createdAt ni updatedAt
  });

  // Asociaciones
  GravedadObservacion.associate = (models) => {
    // Una gravedad puede estar asociada a muchas observaciones
    GravedadObservacion.hasMany(models.Observacion, {
      foreignKey: 'id_gravedad',
      as: 'observaciones'
    });
  };

  return GravedadObservacion;
};
