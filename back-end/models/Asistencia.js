const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Asistencia', {
    id_asistencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_profesor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('Presente', 'Ausente', 'Tarde', 'Justificada'),
      allowNull: false,
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'asistencia',
    timestamps: false,
  });
};
