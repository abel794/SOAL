// Importamos los tipos de datos desde Sequelize
const { DataTypes } = require('sequelize');

// Exportamos una función que define el modelo CategoriaObservacion
module.exports = (sequelize) => {
  // Definición del modelo con el método define
  const CategoriaObservacion = sequelize.define('CategoriaObservacion', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,       // Clave primaria
      autoIncrement: true,    // Se autoincrementa
    },
    nombre: {
      type: DataTypes.STRING(50), // Máximo 50 caracteres
      allowNull: false,           // No se permite nulo
      unique: true,               // No se repite el nombre
    }
  }, {
    tableName: 'categoria_observacion', // Nombre real de la tabla en la BD
    timestamps: false, // Desactiva createdAt y updatedAt
  });

  // Asociaciones del modelo con otras tablas
  CategoriaObservacion.associate = (models) => {
    // Relación 1:N → Una categoría puede tener muchas observaciones
    CategoriaObservacion.hasMany(models.Observacion, {
      foreignKey: 'id_categoria', // Clave foránea en la tabla observacion
      as: 'observaciones'         // Alias para acceder a las observaciones
    });
  };

  return CategoriaObservacion; // Exportamos el modelo
};
