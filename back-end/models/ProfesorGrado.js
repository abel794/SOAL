module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ProfesorGrado', {
    id_profesor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_grado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  }, {
    tableName: 'profesorgrado',
    timestamps: false,
  });
};
