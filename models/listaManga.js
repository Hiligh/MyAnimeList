const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Lista = require('./lista');
const Manga = require('./mangas');

const ListaManga = sequelize.define('ListaManga', {
  IDListaManga: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  IDLista: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lista,
      key: 'IDLista',
    },
  },
  IDManga: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Manga,
      key: 'IDManga',
    },
  },
}, {
  tableName: 'lista_manga',
  timestamps: false,
});

module.exports = ListaManga;
