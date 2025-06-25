const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Observacion', {
    id_observacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_observacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gravedad: {
      type: DataTypes.ENUM('Leve', 'Moderado', 'Grave'),
      allowNull: true,
    },

  }, {
    tableName: 'observacion',
    timestamps: false,
  });
};
