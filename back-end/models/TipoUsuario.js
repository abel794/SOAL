const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoUsuario = sequelize.define('TipoUsuario', {
    id_tipo_usuario: {
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
    tableName: 'tipo_usuario',
    timestamps: false,
  });

  // Asociación
  TipoUsuario.associate = (models) => {
    TipoUsuario.hasMany(models.Usuario, {
      foreignKey: 'id_tipo_usuario',
      as: 'usuarios'
    });
  };

  return TipoUsuario;
};
