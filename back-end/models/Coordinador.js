// models/Coordinador.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Coordinador', {
    id_coordinador: {
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
    }
  }, {
    tableName: 'coordinador',
    timestamps: false,
  });
};
