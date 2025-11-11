const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Funcionario = sequelize.define('Funcionario', {
    id_funcionario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_documento: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cargo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    id_escolaridad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    arl: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
    // ❌ id_estado_usuario eliminado, ya no se necesita
  }, {
    tableName: 'funcionario',
    timestamps: false,
  });

  Funcionario.associate = (models) => {
    // Asociaciones válidas y necesarias
    Funcionario.belongsTo(models.Persona, {
      foreignKey: 'numero_documento',
      targetKey: 'numero_documento',
      as: 'persona'
    });

    Funcionario.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });

    Funcionario.belongsTo(models.NivelEscolaridad, {
      foreignKey: 'id_escolaridad',
      as: 'escolaridad'
    });

    // ❌ Relación innecesaria eliminada:
    // Funcionario.belongsTo(models.EstadoUsuario, { ... });

    Funcionario.hasMany(models.Observacion, {
      foreignKey: 'id_funcionario',
      as: 'observaciones'
    });

    Funcionario.hasMany(models.Asistencia, {
      foreignKey: 'id_funcionario',
      as: 'asistencias'
    });

    Funcionario.hasMany(models.FuncionarioGrado, {
      foreignKey: 'id_funcionario',
      as: 'gradosAsignados'
    });

    Funcionario.hasMany(models.Cita, {
      foreignKey: 'id_funcionario',
      as: 'citas'
    });
  };

  return Funcionario;
};
