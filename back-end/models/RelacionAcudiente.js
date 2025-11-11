// back-end/models/RelacionAcudiente.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RelacionAcudiente = sequelize.define('RelacionAcudiente', {
    id_relacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'relacion_acudiente',   // <— aquí el nombre correcto
    timestamps: false,
  });

  RelacionAcudiente.associate = (models) => {
    // si quieres la inverse:
    RelacionAcudiente.hasMany(models.EstudianteAcudiente, {
      foreignKey: 'id_relacion',
      as: 'pivotes'
    });
    RelacionAcudiente.hasMany(models.Acudiente, {
      foreignKey: 'id_relacion',
      as: 'acudientesDirectos'
    });
  };

  return RelacionAcudiente;
};
