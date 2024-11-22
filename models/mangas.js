const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manga = sequelize.define('Manga', {
  IDManga: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Titulo: {
    type: DataTypes.STRING(370),
    allowNull: false,
  },
  Descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Nota: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Ano: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Genero: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  Cover: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  Membros: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'manga',
  timestamps: false,
});

module.exports = Manga;
