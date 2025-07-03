module.exports = (sequelize, DataTypes) => {
  const HistorialObservacion = sequelize.define('HistorialObservacion', {
    id_historial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_observacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_modificacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // ✅ corregido
    },
    descripcion_modificacion: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'historial_observacion',
    timestamps: false
  });

  HistorialObservacion.associate = function (models) {
    HistorialObservacion.belongsTo(models.Observacion, {
      foreignKey: 'id_observacion',
      as: 'observacion' // ✅ necesario para .observacion en el frontend
    });
  };

  return HistorialObservacion;
};
