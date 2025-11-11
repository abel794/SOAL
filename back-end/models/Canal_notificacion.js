// Importamos el tipo de datos de Sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que define el modelo CanalNotificacion
module.exports = (sequelize) => {
  // Definimos el modelo con el método define de Sequelize
  const CanalNotificacion = sequelize.define('CanalNotificacion', {
    // ID del canal (clave primaria autoincremental)
    id_canal: {
      type: DataTypes.INTEGER,
      primaryKey: true,      // Es la clave primaria
      autoIncrement: true,   // Se autoincrementa
    },

    // Nombre del canal (ej: Email, WhatsApp, SMS, etc.)
    nombre: {
      type: DataTypes.STRING(30), // Máximo 30 caracteres
      allowNull: false,           // No se permite nulo
      unique: true,               // No se puede repetir (único)
    }
  }, {
    // Nombre real de la tabla en la base de datos
    tableName: 'canal_notificacion',

    // No se usan timestamps (createdAt, updatedAt)
    timestamps: false,
  });

  // Definimos asociaciones con otros modelos (relaciones)
  CanalNotificacion.associate = (models) => {

    
    // Un canal puede tener muchas notificaciones (1:N)
    CanalNotificacion.hasMany(models.Notificacion, {
      foreignKey: 'id_canal',     // Clave foránea en notificacion
      as: 'notificaciones'        // Alias para acceder a las notificaciones desde un canal
    });
  };

  // Retornamos el modelo ya configurado
  return CanalNotificacion;
};
