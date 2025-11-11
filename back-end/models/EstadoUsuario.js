const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Definición del modelo EstadoUsuario
  const EstadoUsuario = sequelize.define('EstadoUsuario', {
    // Campo id_estado_usuario: entero, clave primaria, autoincremental
    id_estado_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Campo nombre: cadena de hasta 20 caracteres, no nulo, único
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    }
  }, {
    // Nombre explícito de la tabla en la base de datos
    tableName: 'estado_usuario',
    // No se crean campos automáticos createdAt ni updatedAt
    timestamps: false,
  });

  // Definición de asociaciones con otros modelos
  EstadoUsuario.associate = (models) => {
    // Un EstadoUsuario puede estar asociado a muchos usuarios
    EstadoUsuario.hasMany(models.Usuario, {
      foreignKey: 'id_estado_usuario', // clave foránea en tabla Usuario
      as: 'usuarios' // alias para la relación
    });
  };

  // Retorna el modelo definido
  return EstadoUsuario;
};
