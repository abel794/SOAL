const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Estudiante = sequelize.define('Estudiante', {
    id_estudiante: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      allowNull: true,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sexo: {
      type: DataTypes.ENUM('M', 'F', 'Otro'),
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    id_tipo_documento: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    numero_documento: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ciudad_expedicion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    eps: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    id_acudiente: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado_academico: {
      type: DataTypes.ENUM('Matriculado', 'Graduado', 'Retirado'),
      allowNull: true,
      defaultValue: 'Matriculado',
    },
  }, {
    tableName: 'estudiante',
    timestamps: false,
  });

  // Asociaciones
  Estudiante.associate = (models) => {
    Estudiante.belongsTo(models.Acudiente, {
      foreignKey: 'id_acudiente',
      as: 'acudiente',
    });

    Estudiante.belongsToMany(models.Grado, {
      through: models.Estudiantegrado,
      foreignKey: 'id_estudiante',
      otherKey: 'id_grado',
      as: 'grados',
    });

    Estudiante.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario',
    });
  };

  return Estudiante;
};

