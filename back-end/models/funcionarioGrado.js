const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Definición del modelo FuncionarioGrado (relación entre funcionario y grado)
  const FuncionarioGrado = sequelize.define('FuncionarioGrado', {
    // ID único del registro
    id_funcionario_grado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // ID del funcionario (docente, orientador, etc.)
    id_funcionario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // ID del grado que se le asigna
    id_grado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Rol específico en ese grado (ej. "Titular", "Orientador", "Apoyo")
    rol: {
      type: DataTypes.STRING(30),
      allowNull: true,
    }
  }, {
    tableName: 'funcionario_grado', // nombre real de la tabla
    timestamps: false,              // sin createdAt ni updatedAt automáticos
  });

  // Asociaciones con otros modelos
  FuncionarioGrado.associate = (models) => {
    // Relación con Funcionario
    FuncionarioGrado.belongsTo(models.Funcionario, {
      foreignKey: 'id_funcionario',
      as: 'funcionario'
    });

    // Relación con Grado
    FuncionarioGrado.belongsTo(models.Grado, {
      foreignKey: 'id_grado',
      as: 'grado'
    });
  };

  return FuncionarioGrado;
};
