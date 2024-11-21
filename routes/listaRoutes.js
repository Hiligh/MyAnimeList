// routes/listas.js
const express = require('express');
const router = express.Router();
const Lista = require('../models/lista');
const ListaAnime = require('../models/listaAnime');
const Anime = require('../models/animes');
const ListaManga = require('../models/listaManga');
const Manga = require('../models/mangas');

// Rota para criar uma nova lista
router.post('/criar-lista', async (req, res) => {
  const { nome, IDUsuario } = req.body;
  try {
    // Verifica se os dados são válidos
    if (!nome || !IDUsuario) {
      return res.status(400).json({ message: 'Nome e IDUsuario são obrigatórios' });
    }

    const novaLista = await Lista.create({ Nome: nome, IDUsuario });
    res.status(201).json({ message: 'Lista criada com sucesso', lista: novaLista });
  } catch (error) {
    // Adiciona um log detalhado do erro
    console.error('Erro ao criar lista:', error);
    res.status(500).json({ message: 'Erro ao criar lista', error: error.message });
  }
});

// Rota para adicionar um anime a uma lista
router.post('/adicionar-anime', async (req, res) => {
  const { IDLista, IDAnime } = req.body;

  try {
    // Validação dos campos
    if (!IDLista || !IDAnime) {
      return res.status(400).json({ message: 'IDLista e IDAnime são obrigatórios' });
    }

    // Verifica se o anime já está na lista
    const animeNaLista = await ListaAnime.findOne({
      where: { IDLista, IDAnime }
    });

    if (animeNaLista) {
      // Se já existe, retorna uma mensagem dizendo que o anime já foi adicionado
      return res.status(400).json({ message: 'Anime já está nesta lista' });
    }

    // Adiciona o anime à lista
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


// Rota para obter todas as listas do usuário com os animes associados

// Rota para obter todas as listas do usuário
router.get('/usuario/:IDUsuario/listas', async (req, res) => {
  const { IDUsuario } = req.params; // Obtém o ID do usuário a partir da URL

  try {
    // Busca as listas do usuário na tabela 'lista'
    const listas = await Lista.findAll({
      where: { IDUsuario }, // Condição para buscar listas associadas ao IDUsuario
      attributes: ['IDLista', 'Nome'], // Seleciona apenas os campos necessários
    });

    res.json(listas); // Retorna as listas em formato JSON
  } catch (error) {
    console.error('Erro ao obter listas:', error);
    res.status(500).json({ message: 'Erro ao obter listas do usuário' });
  }
});


router.get('/usuario/:idusuario/listas-animes', async (req, res) => {
  const { idusuario } = req.params;
  
  try {
    const listasAnimes = await Lista.findAll({
      where: { IDUsuario: idusuario }, // Aqui filtra pelo ID do usuário
      include: [
        {
          model: Anime,
          through: { model: ListaAnime }
        }
      ]
    });

    res.json(listasAnimes); // Retorna a lista de animes no formato JSON
  } catch (error) {
    console.error('Erro ao carregar as listas de animes:', error);
    res.status(500).json({ error: 'Erro ao carregar as listas de animes' });
  }
});

router.get('/usuario/:IDUsuario/listas-mangas', async (req, res) => {
  const { IDUsuario } = req.params;

  try {
    // Busca todas as listas de mangas do usuário com os mangas associados
    const listasMangas = await Lista.findAll({
      where: { IDUsuario }, // Filtro pelo ID do usuário
      include: [
        {
          model: Manga,
          through: { model: ListaManga }, // Junta pela tabela associativa
          attributes: ['IDManga', 'Titulo', 'Genero', 'Ano', 'Descricao', 'Nota', 'Cover'], // Inclui os campos do Manga
        },
      ],
    });

    res.json(listasMangas); // Retorna as listas no formato JSON
  } catch (error) {
    console.error('Erro ao carregar as listas de mangas:', error);
    res.status(500).json({ message: 'Erro ao carregar listas de mangas', error: error.message });
  }
});

// Rota para buscar os mangás de uma lista específica
router.get('/mangas/:idLista', async (req, res) => {
  const { idLista } = req.params;

  try {
      // Busca os mangás associados a essa lista
      const mangas = await ListaManga.findAll({
          where: { IDLista: idLista },
          include: [{ model: Manga }], // Inclui os detalhes do modelo Manga
      });

      res.json(mangas);
  } catch (error) {
      console.error('Erro ao buscar mangás:', error);
      res.status(500).json({ error: 'Erro ao buscar mangás da lista.' });
  }
});

module.exports = router;
