const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Anime = require('./animes');
const Usuario = require('./Usuario');

const AvaliacaoAnime = sequelize.define('AvaliacaoAnime', {
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
  IDAnime: {
    type: DataTypes.INTEGER,
    references: {
      model: Anime,
      key: 'IDAnime',
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
  tableName: 'avaliacao_anime',
  timestamps: false,
});

module.exports = AvaliacaoAnime;
