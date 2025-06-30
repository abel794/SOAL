const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    contrasena: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    numero_documento: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    id_tipo_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_estado_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'usuario',
    timestamps: false,
  });

  // Asociaciones
  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Persona, {
      foreignKey: 'numero_documento',
      targetKey: 'numero_documento',
      as: 'persona'
    });

    Usuario.belongsTo(models.TipoUsuario, {
      foreignKey: 'id_tipo_usuario',
      as: 'tipo'
    });

    Usuario.belongsTo(models.EstadoUsuario, {
      foreignKey: 'id_estado_usuario',
      as: 'estado'
    });

    Usuario.hasOne(models.Acudiente, {
      foreignKey: 'id_usuario',
      as: 'acudiente'
    });

    Usuario.hasOne(models.Funcionario, {
      foreignKey: 'id_usuario',
      as: 'funcionario'
    });

    

    Usuario.hasOne(models.Estudiante, {
      foreignKey: 'id_usuario',
      as: 'estudiante'
    });
  };

  return Usuario;
};
