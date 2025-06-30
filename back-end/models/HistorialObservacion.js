const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HistorialObservacion = sequelize.define('HistorialObservacion', {
    // ID único del historial
    id_historial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // ID de la observación modificada
    id_observacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Fecha de la modificación (por defecto la actual)
    fecha_modificacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },

    // Descripción de qué se modificó
    descripcion_modificacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'historialobservacion', // Nombre de la tabla
    timestamps: false,                 // No usa createdAt ni updatedAt
  });

  // Asociaciones (se definen por fuera del define)
  HistorialObservacion.associate = (models) => {
    // Relación muchos-a-uno: muchos historiales pertenecen a una observación
    HistorialObservacion.belongsTo(models.Observacion, {
      foreignKey: 'id_observacion',
      as: 'observacion'
    });
  };

  return HistorialObservacion;
};

