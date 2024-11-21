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
    type: DataTypes.STRING(100), // Novo campo para Status (exemplo: 'Em exibição', 'Completo')
    allowNull: true,
  },
  Start_Aired: {
    type: DataTypes.STRING(20), // Data de início da exibição (Formato: 'YYYY-MM-DD')
    allowNull: true,
  },
  End_Aired: {
    type: DataTypes.STRING(20), // Data de fim da exibição (Formato: 'YYYY-MM-DD')
    allowNull: true,
  },
  Producers: {
    type: DataTypes.STRING(500), // Lista de produtores separados por vírgula
    allowNull: true,
  },
  Licensors: {
    type: DataTypes.STRING(500), // Lista de licenciadores
    allowNull: true,
  },
  Studios: {
    type: DataTypes.STRING(500), // Lista de estúdios
    allowNull: true,
  },
  Source: {
    type: DataTypes.STRING(100), // Fonte original (ex: 'Mangá', 'Light Novel', etc.)
    allowNull: true,
  },
  Themes: {
    type: DataTypes.STRING(500), // Lista de temas separados por vírgula
    allowNull: true,
  },
  Demographics: {
    type: DataTypes.STRING(100), // Público-alvo (ex: 'Shounen', 'Seinen', etc.)
    allowNull: true,
  },
  Duration_Minutes: {
    type: DataTypes.INTEGER, // Duração de cada episódio em minutos
    allowNull: true,
  },
  Rating: {
    type: DataTypes.STRING(50), // Classificação do anime (ex: 'PG', 'R', etc.)
    allowNull: true,
  },
  Nota: {
    type: DataTypes.INTEGER, // Avaliação média
    allowNull: true,
  },
  Membros: {
    type: DataTypes.INTEGER, // Número de membros/usuários que adicionaram este anime
    allowNull: true,
  }
}, {
  tableName: 'anime',
  timestamps: false,
});

module.exports = Anime;
