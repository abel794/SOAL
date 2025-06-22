const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Acudiente = sequelize.define('Acudiente', {
    id_acudiente: {
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
    telefono_alterno: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    sexo: {
      type: DataTypes.ENUM('M', 'F', 'Otro'),
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
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
    relacion: {
      type: DataTypes.ENUM('Padre', 'Madre', 'Tio', 'Tia', 'Abuelo', 'Abuela', 'Otro'),
      allowNull: true,
    }
  }, {
    tableName: 'acudiente',
    timestamps: false,
  });

  // 📌 Asociación
  Acudiente.associate = (models) => {
    Acudiente.hasMany(models.Estudiante, {
      foreignKey: 'id_acudiente',
      as: 'estudiantes'
    });
  };

  return Acudiente;
};
