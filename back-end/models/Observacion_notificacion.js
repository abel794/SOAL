// back-end/models/ObservacionNotificacion.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ObservacionNotificacion = sequelize.define("ObservacionNotificacion", {
    id_observacion_notificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_notificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_observacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: "observacion_notificacion",
    timestamps: false,
  });

  ObservacionNotificacion.associate = (models) => {
    // Relación con Notificación
    ObservacionNotificacion.belongsTo(models.Notificacion, {
      foreignKey: "id_notificacion",
      as: "notificacion",
    });

    // Relación con Observación
    ObservacionNotificacion.belongsTo(models.Observacion, {
      foreignKey: "id_observacion",
      as: "observacion",
    });
  };

  return ObservacionNotificacion;
};
