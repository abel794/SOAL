const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Persona = sequelize.define('Persona', {
    numero_documento: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    ciudad_residencia: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tipo_sangre: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    discapacidad: {
      type: DataTypes.ENUM('Sí', 'No'),
      allowNull: true,
    },
    ocupacion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_sexo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_tipo_documento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'persona',
    timestamps: false,
  });

  // Asociaciones
  Persona.associate = (models) => {
    Persona.belongsTo(models.Sexo, {
      foreignKey: 'id_sexo',
      as: 'sexo'
    });

    Persona.belongsTo(models.TipoDocumento, {
      foreignKey: 'id_tipo_documento',
      as: 'tipoDocumento'
    });

    Persona.hasOne(models.Estudiante, {
      foreignKey: 'numero_documento',
      sourceKey: 'numero_documento',
      as: 'estudiante'
    });

    Persona.hasOne(models.Funcionario, {
      foreignKey: 'numero_documento',
      sourceKey: 'numero_documento',
      as: 'funcionario'
    });

    Persona.hasOne(models.Acudiente, {
      foreignKey: 'numero_documento',
      sourceKey: 'numero_documento',
      as: 'acudiente'
    });
  };

  return Persona;
};
