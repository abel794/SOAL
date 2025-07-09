module.exports = (sequelize, DataTypes) => {
  const Archivo = sequelize.define('Archivo', {
    id_archivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_original: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre_sistema: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    contenido: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    },
    ruta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_subida: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_documento: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'archivo',
    timestamps: false
  });

  // 🔗 Relación con Usuario
  Archivo.associate = (models) => {
    Archivo.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });
  };

  return Archivo;
};
