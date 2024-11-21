const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manga = sequelize.define('Manga', {
  IDManga: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Titulo: {
    type: DataTypes.STRING(370), // Ajuste o tamanho conforme necessário
    allowNull: false,
  },
  Descricao: {
    type: DataTypes.TEXT, // Usa TEXT para descrições longas
    allowNull: true, // Permite null caso a descrição não esteja disponível
  },
  Nota: {
    type: DataTypes.INTEGER, // Avaliação média (exemplo: 8.5)
    allowNull: true,
  },
  Ano: {
    type: DataTypes.INTEGER, // Ano de publicação do mangá
    allowNull: true,
  },
  Genero: {
    type: DataTypes.STRING(500), // Tags ou gêneros, separados por vírgula (ex: "Action, Adventure")
    allowNull: true,
  },
  Cover: {
    type: DataTypes.STRING(500), // Armazena a URL da capa do mangá
    allowNull: true,
  },
  Membros: {
    type: DataTypes.INTEGER, // Número de membros/usuários que adicionaram este mangá
    allowNull: true,
  }
}, {
  tableName: 'manga', // Nome da tabela no banco de dados
  timestamps: false,  // Desabilita a criação automática de colunas `createdAt` e `updatedAt`
});

module.exports = Manga;
