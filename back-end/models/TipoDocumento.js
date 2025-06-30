const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoDocumento = sequelize.define('TipoDocumento', {
    id_tipo_documento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    }
  }, {
    tableName: 'tipo_documento',
    timestamps: false,
  });

  // Asociación
  TipoDocumento.associate = (models) => {
    TipoDocumento.hasMany(models.Persona, {
      foreignKey: 'id_tipo_documento',
      as: 'personas'
    });
  };

  return TipoDocumento;
};
