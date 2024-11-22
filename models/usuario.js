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
    indexes: []
  },
  Idade: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(35),
    allowNull: false,
    unique: true,
  },
  Senha: {
    type: DataTypes.STRING(60),
    allowNull: false,
  }
}, {
  tableName: 'usuario',
  timestamps: false,
  indexes: []
});

module.exports = Usuario;