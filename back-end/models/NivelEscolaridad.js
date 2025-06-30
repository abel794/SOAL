const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NivelEscolaridad = sequelize.define('NivelEscolaridad', {
    // ID único del nivel
    id_escolaridad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Nombre del nivel (ej. Bachiller, Técnico, Profesional, Maestría)
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    }
  }, {
    tableName: 'nivel_escolaridad',
    timestamps: false,
  });

  // Asociación con funcionarios
  NivelEscolaridad.associate = (models) => {
    NivelEscolaridad.hasMany(models.Funcionario, {
      foreignKey: 'id_escolaridad',
      as: 'funcionarios'
    });
  };

  return NivelEscolaridad;
};
