const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EstudianteGrado = sequelize.define('EstudianteGrado', {
    id_estudiante_grado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_grado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    anio_academico: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_finalizacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    id_funcionario_titular: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'estudiante_grado',
    timestamps: false,
  });

  EstudianteGrado.associate = (models) => {
    // Relación con Estudiante
    EstudianteGrado.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudianteAsignado'
    });

    // Relación con Grado
    EstudianteGrado.belongsTo(models.Grado, {
      foreignKey: 'id_grado',
      as: 'grado'
    });

    // Relación con EstadoAnio
    EstudianteGrado.belongsTo(models.EstadoAnio, {
      foreignKey: 'id_estado',
      as: 'estadoAnio'
    });

    // Relación opcional con Funcionario (profesor)
    EstudianteGrado.belongsTo(models.Funcionario, {
      foreignKey: 'id_funcionario_titular',
      as: 'funcionarioTitular'
    });
  };

  return EstudianteGrado;
};
