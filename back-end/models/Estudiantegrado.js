module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Estudiantegrado', {
    id_estudiante: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_grado: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    tableName: 'estudiantegrado',
    timestamps: false
  });
};
