const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Definimos el modelo 'Cita' que representa la tabla `cita`
  const Cita = sequelize.define('Cita', {
    id_cita: {
      type: DataTypes.INTEGER,
      primaryKey: true,      // Clave primaria
      autoIncrement: true,   // Se autoincrementa
    },
    id_estudiante: {
      type: DataTypes.INTEGER,
      allowNull: false       // FK al estudiante
    },
    id_acudiente: {
      type: DataTypes.INTEGER,
      allowNull: false       // FK al acudiente
    },
    id_funcionario: {
      type: DataTypes.INTEGER,
      allowNull: false       // FK al funcionario
    },
    fecha_cita: {
      type: DataTypes.DATE,
      allowNull: false       // Fecha y hora de la cita
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false       // Descripción del motivo
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true,       // Estado opcional
      defaultValue: 'Pendiente' // Valor por defecto
    }
  }, {
    tableName: 'cita',        // Nombre real de la tabla
    timestamps: false         // No se usan createdAt ni updatedAt
  });

  // Relaciones con otros modelos
  Cita.associate = (models) => {
    Cita.belongsTo(models.Estudiante, {
      foreignKey: 'id_estudiante',
      as: 'estudiante'
    });

    Cita.belongsTo(models.Acudiente, {
      foreignKey: 'id_acudiente',
      as: 'acudiente'
    });

    Cita.belongsTo(models.Funcionario, {
      foreignKey: 'id_funcionario',
      as: 'funcionario'
    });
  };

  return Cita;
};
