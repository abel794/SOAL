const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    clave: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipo_usuario: {
      type: DataTypes.ENUM(
        'Estudiante',
        'Profesor',
        'Coordinador',
        'Secretaria',
        'Administrativo',
        'Rector',
        'Acudiente',
        'Orientador'
      ),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Inactivo'),
      allowNull: true,
      defaultValue: 'Activo',
    },
  }, {
    tableName: 'usuario',
    timestamps: false,
  });
};
