const { Sequelize, DataTypes } = require('sequelize');

// 1. Conexión a la base de datos
const sequelize = new Sequelize('SOAL1', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// 2. Importación de modelos
const models = {
  Archivo: require('./Archivo')(sequelize, DataTypes),
  ConfiguracionSistema: require('./ConfiguracionSistema')(sequelize, DataTypes),
  Acudiente: require('./Acudiente')(sequelize, DataTypes),
  Asistencia: require('./Asistencia')(sequelize, DataTypes),
  CanalNotificacion : require('./Canal_notificacion')(sequelize, DataTypes),
  CategoriaObservacion: require('./CategoriaObservacion')(sequelize, DataTypes),
  Cita: require('./Cita')(sequelize, DataTypes),
  EstadoAcademico: require('./Estado_academico')(sequelize, DataTypes),
  EstadoAsistencia: require('./Estado_asistencia')(sequelize, DataTypes),
  EstadoNotificacion: require('./EstadoNotificacion')(sequelize, DataTypes),
  EstadoPqr: require('./EstadoPqr')(sequelize, DataTypes),
  EstadoUsuario: require('./EstadoUsuario')(sequelize, DataTypes),
  Estudiante: require('./Estudiante')(sequelize, DataTypes),
  EstudianteGrado: require('./EstudianteGrado')(sequelize, DataTypes),
  Eps: require('./Eps')(sequelize, DataTypes),
  Funcionario: require('./funcionario')(sequelize, DataTypes),
  FuncionarioGrado: require('./FuncionarioGrado')(sequelize, DataTypes),
  Grado: require('./grado')(sequelize, DataTypes),
  GravedadObservacion: require('./GravedadObservacion')(sequelize, DataTypes),
  HistorialObservacion: require('./HistorialObservacion')(sequelize, DataTypes),
  Justificacion: require('./justificacion')(sequelize, DataTypes),
  NivelEscolaridad: require('./NivelEscolaridad')(sequelize, DataTypes),
  Notificacion: require('./Notificacion')(sequelize, DataTypes),
  Observacion: require('./Observacion')(sequelize, DataTypes),
  Pqr: require('./Pqr')(sequelize, DataTypes),
  Persona: require('./Persona')(sequelize, DataTypes),
  RelacionAcudiente: require('./RelacionAcudiente')(sequelize, DataTypes),
  Sexo: require('./Sexo')(sequelize, DataTypes),
  TipoDocumento: require('./TipoDocumento')(sequelize, DataTypes),
  TipoPqr: require('./TipoPqr')(sequelize, DataTypes),
  TipoUsuario: require('./TipoUsuario')(sequelize, DataTypes),
  Usuario: require('./Usuario')(sequelize, DataTypes),
  // AuditoriaObservacion: require('./AuditoriaObservacion')(sequelize, DataTypes),
};

// 3. Asociaciones internas de los modelos
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

// 4. Relaciones adicionales si no están en associate

// Persona 1:1 con Funcionario, Estudiante y Acudiente
models.Persona.hasOne(models.Funcionario, { foreignKey: 'numero_documento' });
models.Persona.hasOne(models.Acudiente, { foreignKey: 'numero_documento' });
models.Persona.hasOne(models.Estudiante, { foreignKey: 'numero_documento' });

models.Funcionario.belongsTo(models.Persona, { foreignKey: 'numero_documento' });
models.Acudiente.belongsTo(models.Persona, { foreignKey: 'numero_documento' });
models.Estudiante.belongsTo(models.Persona, { foreignKey: 'numero_documento' });

// Usuario 1:1 Funcionario/Estudiante/Acudiente
models.Usuario.hasOne(models.Funcionario, { foreignKey: 'id_usuario' });
models.Usuario.hasOne(models.Estudiante, { foreignKey: 'id_usuario' });
models.Usuario.hasOne(models.Acudiente, { foreignKey: 'id_usuario' });

models.Funcionario.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
models.Estudiante.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
models.Acudiente.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });

// Usuario pertenece a Persona
models.Usuario.belongsTo(models.Persona, {
  foreignKey: 'numero_documento',
  targetKey: 'numero_documento',
});

// Funcionario <-> Grado (Muchos a Muchos)
models.Funcionario.belongsToMany(models.Grado, {
  through: models.FuncionarioGrado,
  foreignKey: 'id_funcionario',
  otherKey: 'id_grado',
  as: 'grados',
});
models.Grado.belongsToMany(models.Funcionario, {
  through: models.FuncionarioGrado,
  foreignKey: 'id_grado',
  otherKey: 'id_funcionario',
  as: 'funcionarios',
});

// Relaciones de Observación
models.Estudiante.hasMany(models.Observacion, { foreignKey: 'id_estudiante' });
models.Observacion.belongsTo(models.Estudiante, { foreignKey: 'id_estudiante' });

models.Funcionario.hasMany(models.Observacion, { foreignKey: 'id_funcionario' });
models.Observacion.belongsTo(models.Funcionario, { foreignKey: 'id_funcionario' });

models.CategoriaObservacion.hasMany(models.Observacion, { foreignKey: 'id_categoria' });
models.Observacion.belongsTo(models.CategoriaObservacion, { foreignKey: 'id_categoria' });

models.HistorialObservacion.belongsTo(models.Observacion, { foreignKey: 'id_observacion' });
models.Observacion.hasMany(models.HistorialObservacion, { foreignKey: 'id_observacion' });

// Estudiante <-> Grado (Muchos a muchos)
models.Estudiante.hasMany(models.EstudianteGrado, {
  foreignKey: 'id_estudiante',
  as: 'grados',
});
models.EstudianteGrado.belongsTo(models.Estudiante, {
  foreignKey: 'id_estudiante',
  as: 'estudiante',
});

models.Grado.hasMany(models.EstudianteGrado, { foreignKey: 'id_grado' });
models.EstudianteGrado.belongsTo(models.Grado, {
  foreignKey: 'id_grado',
});

// Acudiente -> Estudiante (1:N)
models.Acudiente.hasMany(models.Estudiante, { foreignKey: 'id_acudiente' });
models.Estudiante.belongsTo(models.Acudiente, { foreignKey: 'id_acudiente' });

// Asistencia
models.Funcionario.hasMany(models.Asistencia, { foreignKey: 'id_funcionario' });
models.Asistencia.belongsTo(models.Funcionario, { foreignKey: 'id_funcionario' });

models.Estudiante.hasMany(models.Asistencia, { foreignKey: 'id_estudiante' });
models.Asistencia.belongsTo(models.Estudiante, { foreignKey: 'id_estudiante' });

// Citas
models.Acudiente.hasMany(models.Cita, { foreignKey: 'id_acudiente' });
models.Cita.belongsTo(models.Acudiente, { foreignKey: 'id_acudiente' });

models.Estudiante.hasMany(models.Cita, { foreignKey: 'id_estudiante' });
models.Cita.belongsTo(models.Estudiante, { foreignKey: 'id_estudiante' });

// PQR
models.Acudiente.hasMany(models.Pqr, { foreignKey: 'id_acudiente' });
models.Pqr.belongsTo(models.Acudiente, { foreignKey: 'id_acudiente' });

models.Estudiante.hasMany(models.Pqr, { foreignKey: 'id_estudiante' });
models.Pqr.belongsTo(models.Estudiante, { foreignKey: 'id_estudiante' });

models.TipoPqr.hasMany(models.Pqr, { foreignKey: 'id_tipo_pqr' });
models.Pqr.belongsTo(models.TipoPqr, { foreignKey: 'id_tipo_pqr' });

models.EstadoPqr.hasMany(models.Pqr, { foreignKey: 'id_estado_pqr' });
models.Pqr.belongsTo(models.EstadoPqr, { foreignKey: 'id_estado_pqr' });

// Relación Acudiente - Relación
models.RelacionAcudiente.hasMany(models.Acudiente, { foreignKey: 'id_relacion' });
models.Acudiente.belongsTo(models.RelacionAcudiente, { foreignKey: 'id_relacion' });

// Sexo y TipoDocumento
models.Sexo.hasMany(models.Persona, { foreignKey: 'id_sexo' });
models.Persona.belongsTo(models.Sexo, { foreignKey: 'id_sexo' });

models.TipoDocumento.hasMany(models.Persona, { foreignKey: 'id_tipo_documento' });
models.Persona.belongsTo(models.TipoDocumento, { foreignKey: 'id_tipo_documento' });

// Usuario -> EstadoUsuario / TipoUsuario
models.EstadoUsuario.hasMany(models.Usuario, { foreignKey: 'id_estado_usuario' });
models.Usuario.belongsTo(models.EstadoUsuario, { foreignKey: 'id_estado_usuario' });

models.TipoUsuario.hasMany(models.Usuario, { foreignKey: 'id_tipo_usuario' });
models.Usuario.belongsTo(models.TipoUsuario, { foreignKey: 'id_tipo_usuario' });

// Usuario tiene muchos archivos
models.Usuario.hasMany(models.Archivo, { foreignKey: 'id_usuario' });
models.Archivo.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });


// 5. Exportar sequelize + todos los modelos
module.exports = {
  sequelize,
  ...models,
};
