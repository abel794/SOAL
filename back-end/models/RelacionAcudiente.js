const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RelacionAcudiente = sequelize.define('RelacionAcudiente', {
    id_relacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    }
  }, {
    tableName: 'relacion_acudiente',
    timestamps: false,
  });

  // Asociación
  RelacionAcudiente.associate = (models) => {
    RelacionAcudiente.hasMany(models.Acudiente, {
      foreignKey: 'id_relacion',
      as: 'acudientes'
    });
  };

  return RelacionAcudiente;
};
