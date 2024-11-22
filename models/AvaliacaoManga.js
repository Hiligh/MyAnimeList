const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Manga = require('./mangas');
const Usuario = require('./Usuario');

const AvaliacaoManga = sequelize.define('AvaliacaoManga', {
  IDAvaliacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  IDUsuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'IDUsuario',
    },
    allowNull: false,
  },
  IDManga: {
    type: DataTypes.INTEGER,
    references: {
      model: Manga,
      key: 'IDManga',
    },
    allowNull: false,
  },
  nota: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
}, {
  tableName: 'avaliacao_manga',
  timestamps: false,
});

module.exports = AvaliacaoManga;
