const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Cita', {
    id_cita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_acudiente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'cita',
    timestamps: false,
  });
};
