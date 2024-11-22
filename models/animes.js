const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Anime = sequelize.define('Anime', {
  IDAnime: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Nome: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  Genero: {
    type: DataTypes.STRING(350),
    allowNull: false,
  },
  Tipo: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  Episodios: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null, 
  },
  Status: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Start_Aired: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  End_Aired: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  Producers: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  Licensors: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  Studios: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  Source: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Themes: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  Demographics: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Duration_Minutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Rating: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  Nota: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Membros: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'anime',
  timestamps: false,
});

module.exports = Anime;
