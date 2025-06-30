const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pqr = sequelize.define('Pqr', {
    id_pqr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_acudiente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: true, // puede ser NULL si el PQR no es por un estudiante específico
    },
    id_tipo_pqr: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    id_estado_pqr: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'pqr',
    timestamps: false,
  });

  // Asociaciones
  Pqr.associate = (models) => {
    Pqr.belongsTo(models.Acudiente, {
      foreignKey: 'id_acudiente',
      as: 'acudiente'
    });

    Pqr.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });

    Pqr.belongsTo(models.TipoPqr, {
      foreignKey: 'id_tipo_pqr',
      as: 'tipo'
    });

    Pqr.belongsTo(models.EstadoPqr, {
      foreignKey: 'id_estado_pqr',
      as: 'estado'
    });
  };

  return Pqr;
};
