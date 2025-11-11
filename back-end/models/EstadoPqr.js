const { DataTypes } = require('sequelize'); // Importa los tipos de datos de Sequelize

// Exporta una función que define el modelo EstadoPqr
module.exports = (sequelize) => {
  // Definición del modelo EstadoPqr
  const EstadoPqr = sequelize.define('EstadoPqr', {
    id_estado_pqr: {
      type: DataTypes.INTEGER,     // Tipo entero
      primaryKey: true,            // Clave primaria
      autoIncrement: true,         // Se autoincrementa
    },
    nombre: {
      type: DataTypes.STRING(30),  // Nombre del estado (ej. Pendiente, Resuelto)
      allowNull: false,            // No puede ser nulo
      unique: true,                // Valor único (no repetido)
    }
  }, {
    tableName: 'estado_pqr',       // Nombre real de la tabla en la base de datos
    timestamps: false,             // No incluye createdAt ni updatedAt
  });

  // Asociación con el modelo Pqr
  EstadoPqr.associate = (models) => {
    EstadoPqr.hasMany(models.Pqr, {         // Un estado puede tener muchas PQRs
      foreignKey: 'id_estado_pqr',          // Clave foránea en la tabla PQR
      as: 'pqrs'                            // Alias para acceder a los datos relacionados
    });
  };

  return EstadoPqr; // Retorna el modelo definido
};
