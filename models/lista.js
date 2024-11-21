const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Lista = sequelize.define('Lista', {
  IDLista: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  IDUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'IDUsuario',
    },
  },
}, {
  tableName: 'lista',
  timestamps: false,
});

module.exports = Lista;
