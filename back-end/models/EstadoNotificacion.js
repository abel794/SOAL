// Importamos DataTypes de Sequelize para definir tipos de datos
const { DataTypes } = require('sequelize');

// Exportamos una función que define el modelo EstadoNotificacion
module.exports = (sequelize) => {

  // Definimos el modelo con sus campos y restricciones
  const EstadoNotificacion = sequelize.define('EstadoNotificacion', {
    // Campo: ID del estado, clave primaria autoincremental
    id_estado_notificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Campo: nombre del estado (Ej: Enviado, Pendiente, Leído)
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false,     // No puede ser nulo
      unique: true          // Debe ser único
    }

  }, {
    tableName: 'estado_notificacion',  // Nombre real de la tabla en la BD
    timestamps: false                  // No se usarán createdAt ni updatedAt
  });

  // Asociación del modelo: Un estado puede tener muchas notificaciones
  EstadoNotificacion.associate = (models) => {
    EstadoNotificacion.hasMany(models.Notificacion, {
      foreignKey: 'id_estado_notificacion',  // Clave foránea en la tabla notificacion
      as: 'notificaciones'                   // Alias para acceder a las notificaciones relacionadas
    });
  };

  // Retornamos el modelo ya definido
  return EstadoNotificacion;
};
