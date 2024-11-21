const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Lista = require('./lista');

const ListaAnime = sequelize.define('ListaAnime', {
  IDListaAnime: {
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
  IDAnime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Supondo que existe uma tabela 'anime' com uma chave primária 'IDAnime'
    references: {
      model: 'anime',  // Nome da tabela de animes
      key: 'IDAnime',
    },
  },
}, {
  tableName: 'lista_anime',
  timestamps: false,
});

module.exports = ListaAnime;