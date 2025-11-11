const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Observacion = sequelize.define('Observacion', {
    id_observacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_funcionario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_gravedad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'observacion',
    timestamps: false,
  });

  // 🔹 Todas las asociaciones dentro de associate
  Observacion.associate = (models) => {
    Observacion.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });

    Observacion.belongsTo(models.Funcionario, {
      foreignKey: 'id_funcionario',
      as: 'funcionario'
    });

    Observacion.belongsTo(models.GravedadObservacion, {
      foreignKey: 'id_gravedad',
      as: 'gravedad'
    });

    Observacion.belongsTo(models.CategoriaObservacion, {
      foreignKey: 'id_categoria',
      as: 'categoria'
    });

    Observacion.hasMany(models.HistorialObservacion, {
      foreignKey: 'id_observacion',
      as: 'historiales'
    });

// Relación principal
Observacion.hasMany(models.ObservacionNotificacion, {
  foreignKey: 'id_observacion',
  as: 'notificaciones'
});

// Otra relación, pero con alias diferente
Observacion.hasMany(models.ObservacionNotificacion, { 
  foreignKey: 'observacionId',
  as: 'observacionNotificaciones'
});
  };


  return Observacion;
};
