const { DataTypes } = require('sequelize');

// Exportamos la función que define el modelo Acudiente
module.exports = (sequelize) => {
  // Definición del modelo Acudiente con sus columnas
  const Acudiente = sequelize.define('Acudiente', {
    id_acudiente: {
      type: DataTypes.INTEGER,
      primaryKey: true,       // Clave primaria
      autoIncrement: true,    // Se autoincrementa
    },
    numero_documento: {
      type: DataTypes.STRING(20),
      allowNull: true,        // Se relaciona con la tabla persona
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,        // Usuario del sistema (FK)
    },
    id_relacion: {
      type: DataTypes.INTEGER,
      allowNull: true,        // Tipo de relación con el estudiante (Padre, Madre...)
    }
  }, {
    tableName: 'acudiente',   // Nombre real de la tabla
    timestamps: false,        // No usaremos createdAt ni updatedAt
  });

  // Asociaciones con otros modelos (definidas si estás usando Sequelize `index.js`)
  Acudiente.associate = (models) => {

    Acudiente.hasMany(models.Notificacion, {
  foreignKey: 'id_acudiente',
  as: 'notificaciones'
  });

    // FK: acudiente.id_usuario → usuario.id_usuario
    Acudiente.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });

    // FK: acudiente.numero_documento → persona.numero_documento
    Acudiente.belongsTo(models.Persona, {
      foreignKey: 'numero_documento',
      targetKey: 'numero_documento',
      as: 'persona'
    });

    // FK: acudiente.id_relacion → relacion_acudiente.id_relacion
    Acudiente.belongsTo(models.RelacionAcudiente, {
      foreignKey: 'id_relacion',
      as: 'relacion'
    });

    // Relación 1:N → Un acudiente puede tener varios estudiantes
    Acudiente.hasMany(models.Estudiante, {
      foreignKey: 'id_acudiente',
      as: 'estudiantes'
    });
  };

  return Acudiente;
};
