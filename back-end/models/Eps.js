const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Definimos el modelo 'Eps' que representa la tabla `eps`
  const Eps = sequelize.define('Eps', {
    id_eps: {
      type: DataTypes.INTEGER,
      primaryKey: true,      // Clave primaria
      autoIncrement: true,   // Se autoincrementa
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,      // No puede ser nulo
      unique: true,          // Debe ser único (no repetir nombres de EPS)
    }
  }, {
    tableName: 'eps',         // Nombre real de la tabla en la base de datos
    timestamps: false         // No se usan las columnas createdAt/updatedAt
  });

  // Relaciones (asociaciones) con otros modelos
  Eps.associate = (models) => {
    // Una EPS puede estar asignada a muchos estudiantes
    Eps.hasMany(models.Estudiante, {
      foreignKey: 'id_eps',   // FK en la tabla estudiante
      as: 'estudiantes'       // Alias para acceder a los estudiantes de una EPS
    });
  };

  return Eps; // Retornamos el modelo
};
