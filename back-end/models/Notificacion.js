const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notificacion = sequelize.define('Notificacion', {
    id_notificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_observacion: {      // 🔹 Asegúrate de agregar este campo
      type: DataTypes.INTEGER,
      allowNull: true,     // si quieres que pueda ser null
    },
    id_acudiente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_envio: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    id_canal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_estado_notificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'notificacion',
    timestamps: false,
  });

  // 🔹 Todas las asociaciones dentro de associate
  Notificacion.associate = (models) => {
    Notificacion.belongsTo(models.Observacion, {
      foreignKey: 'id_observacion',
      as: 'observacion'
    });

    Notificacion.belongsTo(models.Acudiente, {
      foreignKey: 'id_acudiente',
      as: 'acudiente'
    });

    Notificacion.belongsTo(models.CanalNotificacion, {
      foreignKey: 'id_canal',
      as: 'canal'
    });

    Notificacion.belongsTo(models.EstadoNotificacion, {
      foreignKey: 'id_estado_notificacion',
      as: 'estado'
    });
    Notificacion.hasMany(models.ObservacionNotificacion, {
      foreignKey: 'id_notificacion',
      as: 'observaciones'
});

  };

  return Notificacion;
};
