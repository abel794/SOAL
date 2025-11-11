// back-end/models/Acudiente.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Acudiente = sequelize.define('Acudiente', {
    id_acudiente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_documento: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_relacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'acudiente',
    timestamps: false,
  });

  Acudiente.associate = (models) => {
    // Usuario
    Acudiente.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });
    // Persona
    Acudiente.belongsTo(models.Persona, {
      foreignKey: 'numero_documento',
      targetKey: 'numero_documento',
      as: 'persona'
    });
    // RelacionAcudiente directa
    Acudiente.belongsTo(models.RelacionAcudiente, {
      foreignKey: 'id_relacion',
      as: 'relacion'
    });
    // M:N con Estudiante
    Acudiente.belongsToMany(models.Estudiante, {
      through: models.EstudianteAcudiente,
      foreignKey: 'id_acudiente',
      otherKey: 'id_estudiante',
      as: 'estudiantes'
    });
    // Relación directa a la pivote
    Acudiente.hasMany(models.EstudianteAcudiente, {
      foreignKey: 'id_acudiente',
      as: 'pivotes'
    });
    // Notificaciones, etc...
    Acudiente.hasMany(models.Notificacion, { foreignKey: 'id_acudiente', as: 'notificaciones' });
  };

  return Acudiente;
};
