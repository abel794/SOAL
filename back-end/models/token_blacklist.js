module.exports = (sequelize, DataTypes) => {
  const TokenBlacklist = sequelize.define(
    "TokenBlacklist",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "usuario", // 👈 nombre exacto de la tabla
          key: "id_usuario",
        },
        onDelete: "CASCADE",
      },
      fecha_invalido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      expira_en: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "token_blacklist", // 👈 nombre real de la tabla en BD
      timestamps: false, // no necesitamos createdAt ni updatedAt
    }
  );

  TokenBlacklist.associate = (models) => {
    TokenBlacklist.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      targetKey: "id_usuario",
      onDelete: "CASCADE",
    });
  };

  return TokenBlacklist;
};
