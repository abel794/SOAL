const { Sequelize } = require('sequelize');

// 1. Conexión a la base de datos
const sequelize = new Sequelize('soal', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// 2. Importación de modelos
const models = {
  Coordinador: require('./Coordinador')(sequelize, Sequelize.DataTypes),
  Usuario: require('./Usuario')(sequelize, Sequelize.DataTypes),
  Estudiante: require('./Estudiante')(sequelize, Sequelize.DataTypes),
  Grado: require('./Grado')(sequelize, Sequelize.DataTypes),
  Estudiantegrado: require('./Estudiantegrado')(sequelize, Sequelize.DataTypes),
  Profesor: require('./Profesor')(sequelize, Sequelize.DataTypes),
  Secretaria: require('./Secretaria')(sequelize, Sequelize.DataTypes),
  Acudiente: require('./Acudiente')(sequelize, Sequelize.DataTypes),
  Observacion: require('./Observacion')(sequelize, Sequelize.DataTypes),
  CategoriaObservacion: require('./CategoriaObservacion')(sequelize, Sequelize.DataTypes),
  Cita: require('./Cita')(sequelize, Sequelize.DataTypes),
  Asistencia: require('./Asistencia')(sequelize, Sequelize.DataTypes),
  HistorialObservacion: require('./HistorialObservacion')(sequelize, Sequelize.DataTypes),
  ProfesorGrado: require('./ProfesorGrado')(sequelize, Sequelize.DataTypes),
};

// 3. Ejecutar asociaciones si existen en los modelos
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// 4. Declaración de relaciones adicionales

const {
  Usuario,
  Estudiante,
  Grado,
  Estudiantegrado,
  Profesor,
  Secretaria,
  Coordinador,
  Acudiente,
  Observacion,
  Cita,
  Asistencia,
  HistorialObservacion,
  ProfesorGrado,
  CategoriaObservacion,
} = models;

// Usuario 1:1 con cada rol
Usuario.hasOne(Estudiante, { foreignKey: 'id_usuario' });
Estudiante.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Usuario.hasOne(Profesor, { foreignKey: 'id_usuario' });
Profesor.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Usuario.hasOne(Secretaria, { foreignKey: 'id_usuario' });
Secretaria.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Usuario.hasOne(Acudiente, { foreignKey: 'id_usuario' });
Acudiente.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Estudiante-Grado (Muchos a Muchos)
Grado.hasMany(Estudiantegrado, { foreignKey: 'id_grado' });
Estudiantegrado.belongsTo(Grado, { foreignKey: 'id_grado' });

Estudiante.hasMany(Estudiantegrado, { foreignKey: 'id_estudiante' });
Estudiantegrado.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });

// Profesor-Grado (Muchos a Muchos)
Grado.hasMany(ProfesorGrado, { foreignKey: 'id_grado' });
ProfesorGrado.belongsTo(Grado, { foreignKey: 'id_grado' });

Profesor.hasMany(ProfesorGrado, { foreignKey: 'id_profesor' });
ProfesorGrado.belongsTo(Profesor, { foreignKey: 'id_profesor' });

// Estudiante - Observacion
Estudiante.hasMany(Observacion, { foreignKey: 'id_estudiante' });
Observacion.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });

// Usuario - Observacion
Usuario.hasMany(Observacion, { foreignKey: 'id_usuario' });
Observacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Observacion - Historial
Observacion.hasMany(HistorialObservacion, { foreignKey: 'id_observacion' });
HistorialObservacion.belongsTo(Observacion, { foreignKey: 'id_observacion' });

// Estudiante - Cita
Estudiante.hasMany(Cita, { foreignKey: 'id_estudiante' });
Cita.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });

// Acudiente - Cita
Acudiente.hasMany(Cita, { foreignKey: 'id_acudiente' });
Cita.belongsTo(Acudiente, { foreignKey: 'id_acudiente' });

// Asistencia
Estudiante.hasMany(Asistencia, { foreignKey: 'id_estudiante' });
Asistencia.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });

Profesor.hasMany(Asistencia, { foreignKey: 'id_profesor' });
Asistencia.belongsTo(Profesor, { foreignKey: 'id_profesor' });

// Acudiente - Estudiante (1:N)
Acudiente.hasMany(Estudiante, { foreignKey: 'id_acudiente' });
Estudiante.belongsTo(Acudiente, { foreignKey: 'id_acudiente' });

// Categoría - Observación
CategoriaObservacion.hasMany(Observacion, { foreignKey: 'id_categoria' });
Observacion.belongsTo(CategoriaObservacion, { foreignKey: 'id_categoria' });

// 5. Exportación final
module.exports = {
  sequelize,
  ...models
};
