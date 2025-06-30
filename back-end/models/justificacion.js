const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Justificacion = sequelize.define('Justificacion', {
    // ID único de la justificación
    id_justificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Relación con el estudiante
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Fecha de la justificación (día que se justifica la falta)
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    // Motivo por el cual el estudiante faltó
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // Archivo adjunto (puede ser PDF o imagen)
    archivo: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'justificacion', // nombre de la tabla
    timestamps: false,          // sin createdAt ni updatedAt automáticos
  });

  // Asociación con el modelo Estudiante
  Justificacion.associate = (models) => {
    Justificacion.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });
  };

  return Justificacion;
};
