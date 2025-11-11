module.exports = (sequelize, DataTypes) => {
  const GradoAsistencia = sequelize.define('GradoAsistencia', {
    id_grado_asistencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_grado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_funcionario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'grado_asistencia',
    timestamps: false
  });

  GradoAsistencia.associate = (models) => {
    // Un grado_asistencia pertenece a un grado
    GradoAsistencia.belongsTo(models.Grado, {
      foreignKey: 'id_grado',
      as: 'grado'
    });

    // Un grado_asistencia pertenece a un funcionario
    GradoAsistencia.belongsTo(models.Funcionario, {
      foreignKey: 'id_funcionario',
      as: 'funcionario'
    });

    // Relación inversa: un grado_asistencia tiene muchas asistencias
    GradoAsistencia.hasMany(models.Asistencia, {
      foreignKey: 'id_grado_asistencia',
      as: 'asistencias'
    });
  };

  return GradoAsistencia;
};
