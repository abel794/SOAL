const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Grado', {
    id_grado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_grado: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'grado',
    timestamps: false,
  });
};
