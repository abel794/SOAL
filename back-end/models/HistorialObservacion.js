const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('HistorialObservacion', {
    id_historial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_observacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_modificacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    descripcion_modificacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'historialobservacion',
    timestamps: false,
  });
};
