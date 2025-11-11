const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoPqr = sequelize.define('TipoPqr', {
    id_tipo_pqr: {
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
    tableName: 'tipo_pqr',
    timestamps: false,
  });

  // Asociación
  TipoPqr.associate = (models) => {
    TipoPqr.hasMany(models.Pqr, {
      foreignKey: 'id_tipo_pqr',
      as: 'pqrs'
    });
  };

  return TipoPqr;
};
