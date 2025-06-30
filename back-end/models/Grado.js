const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Grado = sequelize.define('Grado', {
    id_grado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_grado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  }, {
    tableName: 'grado',
    timestamps: false
  });

  Grado.associate = (models) => {
    Grado.hasMany(models.EstudianteGrado, {
      foreignKey: 'id_grado',
      as: 'estudiantes'
    });

    // 👇 Alias cambiado para evitar conflicto
    Grado.hasMany(models.FuncionarioGrado, {
      foreignKey: 'id_grado',
      as: 'funcionarioGrados'
    });
  };

  return Grado;
};
