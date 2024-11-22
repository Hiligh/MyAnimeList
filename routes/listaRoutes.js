
const express = require('express');
const router = express.Router();
const Lista = require('../models/lista');
const ListaAnime = require('../models/listaAnime');
const Anime = require('../models/animes');
const ListaManga = require('../models/listaManga');
const Manga = require('../models/mangas');


router.post('/criar-lista', async (req, res) => {
  const { nome, IDUsuario } = req.body;
  try {
    
    if (!nome || !IDUsuario) {
      return res.status(400).json({ message: 'Nome e IDUsuario são obrigatórios' });
    }

    const novaLista = await Lista.create({ Nome: nome, IDUsuario });
    res.status(201).json({ message: 'Lista criada com sucesso', lista: novaLista });
  } catch (error) {
    
    console.error('Erro ao criar lista:', error);
    res.status(500).json({ message: 'Erro ao criar lista', error: error.message });
  }
});


router.post('/adicionar-anime', async (req, res) => {
  const { IDLista, IDAnime } = req.body;

  try {
    
    if (!IDLista || !IDAnime) {
      return res.status(400).json({ message: 'IDLista e IDAnime são obrigatórios' });
    }

    
    const animeNaLista = await ListaAnime.findOne({
      where: { IDLista, IDAnime }
    });

    if (animeNaLista) {
      
      return res.status(400).json({ message: 'Anime já está nesta lista' });
    }

    
    const listaAnime = await ListaAnime.create({ IDLista, IDAnime });
    res.status(201).json({ message: 'Anime adicionado à lista com sucesso', listaAnime });
  } catch (error) {
    console.error('Erro ao adicionar anime à lista:', error);
    res.status(500).json({ message: 'Erro ao adicionar anime à lista', error: error.message });
  }
});



router.post('/adicionar-manga', async (req, res) => {
  const { IDLista, IDManga } = req.body;
  try {
    const listaManga = await ListaManga.create({ IDLista, IDManga });
    res.status(201).json({ message: 'Mangá adicionado à lista com sucesso', listaManga });
  } catch (error) {
    console.error('Erro ao adicionar mangá à lista:', error);
    res.status(500).json({ message: 'Erro ao adicionar mangá à lista', error: error.message });
  }
});





router.get('/usuario/:IDUsuario/listas', async (req, res) => {
  const { IDUsuario } = req.params; 

  try {
    
    const listas = await Lista.findAll({
      where: { IDUsuario }, 
      attributes: ['IDLista', 'Nome'], 
    });

    res.json(listas); 
  } catch (error) {
    console.error('Erro ao obter listas:', error);
    res.status(500).json({ message: 'Erro ao obter listas do usuário' });
  }
});


router.get('/usuario/:idusuario/listas-animes', async (req, res) => {
  const { idusuario } = req.params;
  
  try {
    const listasAnimes = await Lista.findAll({
      where: { IDUsuario: idusuario }, 
      include: [
        {
          model: Anime,
          through: { model: ListaAnime }
        }
      ]
    });

    res.json(listasAnimes); 
  } catch (error) {
    console.error('Erro ao carregar as listas de animes:', error);
    res.status(500).json({ error: 'Erro ao carregar as listas de animes' });
  }
});

router.get('/usuario/:IDUsuario/listas-mangas', async (req, res) => {
  const { IDUsuario } = req.params;

  try {
    
    const listasMangas = await Lista.findAll({
      where: { IDUsuario }, 
      include: [
        {
          model: Manga,
          through: { model: ListaManga }, 
          attributes: ['IDManga', 'Titulo', 'Genero', 'Ano', 'Descricao', 'Nota', 'Cover'], 
        },
      ],
    });

    res.json(listasMangas); 
  } catch (error) {
    console.error('Erro ao carregar as listas de mangas:', error);
    res.status(500).json({ message: 'Erro ao carregar listas de mangas', error: error.message });
  }
});


router.get('/mangas/:idLista', async (req, res) => {
  const { idLista } = req.params;

  try {
      
      const mangas = await ListaManga.findAll({
          where: { IDLista: idLista },
          include: [{ model: Manga }], 
      });

      res.json(mangas);
  } catch (error) {
      console.error('Erro ao buscar mangás:', error);
      res.status(500).json({ error: 'Erro ao buscar mangás da lista.' });
  }
});

module.exports = router;
