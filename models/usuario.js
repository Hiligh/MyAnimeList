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
  },
  Idade: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(35),
    allowNull: false,
    unique: true, // Garante que não haja emails duplicados
  },
  Senha: {
    type: DataTypes.STRING(60),
    allowNull: false,
  }
}, {
  tableName: 'usuario', // Nome da tabela no banco de dados
  timestamps: false,    // Desabilita a criação automática de colunas de timestamps como `createdAt` e `updatedAt`
});

module.exports = Usuario;
