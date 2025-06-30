const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notificacion = sequelize.define('Notificacion', {
    id_notificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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

  Notificacion.associate = (models) => {
    Notificacion.belongsTo(models.Acudiente, {
      foreignKey: 'id_acudiente',
      as: 'acudiente'
    });

    // ✅ Nombre corregido aquí
    Notificacion.belongsTo(models.Canal_notificacion, {
      foreignKey: 'id_canal',
      as: 'canal'
    });

    Notificacion.belongsTo(models.EstadoNotificacion, {
      foreignKey: 'id_estado_notificacion',
      as: 'estado'
    });
  };

  return Notificacion;
};
