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

  // Asociaciones
  Observacion.associate = (models) => {
    // Estudiante al que pertenece la observación
    Observacion.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });

    // Funcionario (profesor/orientador/coordinador) que hizo la observación
    Observacion.belongsTo(models.Funcionario, {
      foreignKey: 'id_funcionario',
      as: 'funcionario'
    });

    // Gravedad de la observación (leve, moderada, grave)
    Observacion.belongsTo(models.GravedadObservacion, {
      foreignKey: 'id_gravedad',
      as: 'gravedad'
    });

    // Categoría (ej. disciplina, académico, etc.)
    Observacion.belongsTo(models.CategoriaObservacion, {
      foreignKey: 'id_categoria',
      as: 'categoria'
    });

    /* Relación con auditoría (si usas)
    Observacion.hasMany(models.AuditoriaObservacion, {
      foreignKey: 'id_observacion',
      as: 'auditoria'
    });*/

    // Historial de modificaciones (corrección agregada)
    Observacion.hasMany(models.HistorialObservacion, {
      foreignKey: 'id_observacion',
      as: 'historial'
    });
  };

  return Observacion;
};
