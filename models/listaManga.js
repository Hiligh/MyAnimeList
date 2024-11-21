const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Lista = require('./lista');
const Manga = require('./mangas');  // Importa o modelo Manga

const ListaManga = sequelize.define('ListaManga', {
  IDListaManga: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Define o campo como chave primária com incremento automático
  },
  IDLista: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Lista,  // Refere-se à tabela 'Lista'
      key: 'IDLista', // Referência à chave primária da tabela Lista
    },
  },
  IDManga: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Manga,  // Refere-se à tabela 'Manga'
      key: 'IDManga', // Referência à chave primária da tabela Manga
    },
  },
}, {
  tableName: 'lista_manga',  // Nome da tabela associativa
  timestamps: false,  // Desabilita as colunas 'createdAt' e 'updatedAt'
});

module.exports = ListaManga;
