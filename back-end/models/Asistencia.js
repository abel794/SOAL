// Importamos los tipos de datos de Sequelize
const { DataTypes } = require('sequelize');

// Exportamos la función que define el modelo Asistencia
module.exports = (sequelize) => {
  // Definimos el modelo con sus columnas
  const Asistencia = sequelize.define('Asistencia', {
    id_asistencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,       // Clave primaria
      autoIncrement: true     // Se autoincrementa automáticamente
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false        // FK obligatoria (estudiante que recibe la asistencia)
    },
    id_funcionario: {
      type: DataTypes.INTEGER,
      allowNull: false        // FK obligatoria (quien registra la asistencia)
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false        // Fecha de la asistencia (formato YYYY-MM-DD)
    },
    id_estado_asistencia: {
      type: DataTypes.INTEGER,
      allowNull: false        // FK obligatoria (estado como presente, ausente, etc.)
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true         // Campo opcional para detalles adicionales
    }
  }, {
    tableName: 'asistencia',  // Nombre de la tabla real
    timestamps: false         // No se usarán createdAt ni updatedAt
  });

  // Definimos las asociaciones con otras tablas
  Asistencia.associate = (models) => {
    // Relación con estudiante (muchas asistencias pueden pertenecer a un estudiante)
    Asistencia.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });

    // Relación con funcionario (quien toma la asistencia)
    Asistencia.belongsTo(models.Funcionario, {
      foreignKey: 'id_funcionario',
      as: 'funcionario'
    });

    // Relación con estado de asistencia
    Asistencia.belongsTo(models.EstadoAsistencia, {
      foreignKey: 'id_estado_asistencia',
      as: 'estadoAsistencia'
    });
  };

  return Asistencia;
};
