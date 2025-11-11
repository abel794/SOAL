// models/HistorialPqr.js
module.exports = (sequelize, DataTypes) => {
  const HistorialPqr = sequelize.define('HistorialPqr', {
    id_historial_pqr: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_pqr: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    id_estado_pqr: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'historial_pqr',
    timestamps: false
  });

  HistorialPqr.associate = function(models) {
    // Usa exactamente el nombre de modelo que definiste: 'Pqr'
    HistorialPqr.belongsTo(models.Pqr, { foreignKey: 'id_pqr', as: 'pqr_asociado' });
    HistorialPqr.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario_respuesta' });
    // En HistorialPqr.js
    HistorialPqr.belongsTo(models.EstadoPqr, {foreignKey: 'id_estado_pqr',as: 'estado_historial'});

  };

  return HistorialPqr;
};
