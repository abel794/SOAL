const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sexo = sequelize.define('Sexo', {
    id_sexo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
    }
  }, {
    tableName: 'sexo',
    timestamps: false,
  });

  // Asociación
  Sexo.associate = (models) => {
    Sexo.hasMany(models.Persona, {
      foreignKey: 'id_sexo',
      as: 'personas'
    });
  };

  return Sexo;
};
