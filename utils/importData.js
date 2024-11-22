
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Anime = require('../models/animes'); 
const Manga = require('../models/mangas'); 

async function importAnimes() {
  const animes = [];
  const animeFilePath = path.join(__dirname, '..', 'public', 'assets', 'Animes.csv'); 

  return new Promise((resolve, reject) => {
    fs.createReadStream(animeFilePath)
      .pipe(csv())
      .on('data', (row) => {
        
        const episodes = row.Episodes && !isNaN(row.Episodes) ? parseInt(row.Episodes) : null;
        
        
        const startAired = row.Start_Aired ? row.Start_Aired : null;  
        const endAired = row.End_Aired ? row.End_Aired : null; 

        
        const producers = row.Producers ? row.Producers.replace(/"/g, '') : null;
        const licensors = row.Licensors ? row.Licensors.replace(/"/g, '') : null;
        const studios = row.Studios ? row.Studios.replace(/"/g, '') : null;

        
        const themes = row.Themes ? row.Themes.replace(/"/g, '') : null;
        const demographics = row.Demographics ? row.Demographics.replace(/"/g, '') : null;

        
        animes.push({
          Nome: row.Title, 
          Genero: row.Genres.replace(/"/g, ''), 
          Tipo: row.Type, 
          Episodios: episodes,
          Status: row.Status, 
          Start_Aired: startAired,  
          End_Aired: endAired,     
          Producers: producers,
          Licensors: licensors,
          Studios: studios,
          Source: row.Source, 
          Themes: themes,
          Demographics: demographics,
          Duration_Minutes: row.Duration_Minutes ? parseInt(row.Duration_Minutes) : null,
          Rating: row.Rating, 
          Nota: 0, 
          Membros: 0, 
        });
      })
      .on('end', async () => {
        try {
          
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

async function importMangas() {
  const mangas = [];
  const mangaFilePath = path.join(__dirname, '..', 'public', 'assets', 'data.csv'); 

  return new Promise((resolve, reject) => {
    fs.createReadStream(mangaFilePath)
      .pipe(csv())
      .on('data', (row) => {
        
        const year = row.year && !isNaN(row.year) ? parseInt(row.year) : null;

        mangas.push({
          Titulo: row.title,
          Descricao: row.description,
          Nota: 0,
          Ano: year,
          Genero: row.tags.replace(/[\[\]']/g, ''), 
          Cover: row.cover,
          Membros: 0, 
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


async function importData() {
  await importAnimes();
  await importMangas();
}


module.exports = { importData };