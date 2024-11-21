const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  IDUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nome: {
    type: DataTypes.STRING(30),
    allowNull: false,
    // Não criar um índice automático
    indexes: []
  },
  Idade: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(35),
    allowNull: false,
    unique: true, // Garante que o email seja único, criando um índice
  },
  Senha: {
    type: DataTypes.STRING(60),
    allowNull: false,
  }
}, {
  tableName: 'usuario',
  timestamps: false,
  // Aqui, você pode desabilitar a criação de índices automáticos
  indexes: [] // Remove qualquer índice automático
});

module.exports = Usuario;