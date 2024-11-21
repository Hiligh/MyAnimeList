// utils/importData.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Anime = require('../models/animes'); // Altere para o caminho correto do modelo Anime
const Manga = require('../models/mangas'); // Altere para o caminho correto do modelo Manga

// Função para importar dados de animes
async function importAnimes() {
  const animes = [];
  const animeFilePath = path.join(__dirname, '..', 'public', 'assets', 'Animes.csv'); // Caminho do CSV

  return new Promise((resolve, reject) => {
    fs.createReadStream(animeFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Validando e convertendo os campos
        const episodes = row.Episodes && !isNaN(row.Episodes) ? parseInt(row.Episodes) : null;
        
        // As datas no formato "Apr 7, 2013"
        const startAired = row.Start_Aired ? row.Start_Aired : null;  // Mantém o formato original da data
        const endAired = row.End_Aired ? row.End_Aired : null; // Mantém o formato original da data

        // Convertendo as listas de produtores, licenciadores e estúdios em strings separadas por vírgula
        const producers = row.Producers ? row.Producers.replace(/"/g, '') : null;
        const licensors = row.Licensors ? row.Licensors.replace(/"/g, '') : null;
        const studios = row.Studios ? row.Studios.replace(/"/g, '') : null;

        // Convertendo temas e demografia em strings separadas por vírgula
        const themes = row.Themes ? row.Themes.replace(/"/g, '') : null;
        const demographics = row.Demographics ? row.Demographics.replace(/"/g, '') : null;

        // Adicionando o anime ao array
        animes.push({
          Nome: row.Title, // 'Title' no CSV mapeado para 'Nome' no modelo
          Genero: row.Genres.replace(/"/g, ''), // 'Genres' no CSV mapeado para 'Genero' no modelo
          Tipo: row.Type, // 'Type' no CSV mapeado para 'Tipo' no modelo
          Episodios: episodes,
          Status: row.Status, // 'Status' no CSV mapeado para 'Status' no modelo
          Start_Aired: startAired,  // Mantém o formato de texto das datas
          End_Aired: endAired,     // Mantém o formato de texto das datas
          Producers: producers,
          Licensors: licensors,
          Studios: studios,
          Source: row.Source, // 'Source' no CSV mapeado para 'Source' no modelo
          Themes: themes,
          Demographics: demographics,
          Duration_Minutes: row.Duration_Minutes ? parseInt(row.Duration_Minutes) : null,
          Rating: row.Rating, // 'Rating' no CSV mapeado para 'Rating' no modelo
          Nota: 0, // Nota definida como 0 ou outro valor, já que não existe no CSV
          Membros: 0, // Membros definidos como 0 ou outro valor, pois não há no CSV
        });
      })
      .on('end', async () => {
        try {
          // Inserir os dados no banco de dados usando bulkCreate
          await Anime.bulkCreate(animes);
          console.log('Animes importados com sucesso!');
          resolve();
        } catch (error) {
          console.error('Erro ao importar animes:', error);
          reject(error);
        }
      });
  });
}

// Função para importar dados de mangás
async function importMangas() {
  const mangas = [];
  const mangaFilePath = path.join(__dirname, '..', 'public', 'assets', 'data.csv'); // Caminho do CSV

  return new Promise((resolve, reject) => {
    fs.createReadStream(mangaFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Validando e convertendo cada campo
        const year = row.year && !isNaN(row.year) ? parseInt(row.year) : null;

        mangas.push({
          Titulo: row.title,
          Descricao: row.description,
          Nota: 0,
          Ano: year,
          Genero: row.tags.replace(/[\[\]']/g, ''), // Remove colchetes e aspas
          Cover: row.cover,
          Membros: 0, // Defina o valor inicial ou ajuste para o CSV se necessário
        });
      })
      .on('end', async () => {
        try {
          await Manga.bulkCreate(mangas);
          console.log('Mangás importados com sucesso!');
          resolve();
        } catch (error) {
          console.error('Erro ao importar mangás:', error);
          reject(error);
        }
      });
  });
}

// Função principal que chama as duas funções de importação
async function importData() {
  await importAnimes();
  await importMangas();
}

// Exporta a função importData
module.exports = { importData };