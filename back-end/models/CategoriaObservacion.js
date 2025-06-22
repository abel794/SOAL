module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CategoriaObservacion', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_categoria: {
      type: DataTypes.ENUM('Disciplinaria', 'Academica', 'Psicologica', 'Administrativa'),
      allowNull: false
    }
  }, {
    tableName: 'categoriaobservacion',
    timestamps: false
  });
};
