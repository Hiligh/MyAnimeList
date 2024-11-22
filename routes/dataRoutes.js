const express = require('express');
const { Op } = require('sequelize');  
const Manga = require('../models/mangas');
const Anime = require('../models/animes');
const Usuario = require('../models/Usuario');
const AvaliacaoAnime = require('../models/AvaliacaoAnime');
const AvaliacaoManga = require('../models/AvaliacaoManga');
const router = express.Router();
const Sequelize = require('../config/database');

router.get('/anime/:id', async (req, res) => {
    try {
        const idAnime = req.params.id;  
        const idusuario = req.query.idusuario;  

        
        const anime = await Anime.findByPk(idAnime, { raw: true });

        
        const usuario = await Usuario.findByPk(idusuario, { raw: true });

        if (anime && usuario) {
            
            const avaliacoes = await AvaliacaoAnime.findAll({
                where: { IDAnime: idAnime }
            });

            
            const somaNotas = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
            const mediaNotas = avaliacoes.length > 0 ? (somaNotas / avaliacoes.length).toFixed(1) : 0;  

            
            res.render('paginaAnime', {
                detalhesAnime: anime,
                infoUsuario: usuario,
                mediaNota: mediaNotas  
            });
        } else {
            res.status(404).send('Anime ou usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes do anime:', error);
        res.status(500).send('Erro ao buscar detalhes do anime');
    }
});




router.get('/manga/:id', async (req, res) => {
    try {
        const manga = await Manga.findByPk(req.params.id, { raw: true });
        const infoUsuario = req.query.idusuario;  

        const usuario = await Usuario.findByPk(infoUsuario, { raw: true });

        if (manga && usuario) {
            res.render('paginaManga', { detalhesManga: manga, infoUsuario: usuario });
        } else {
            res.status(404).send('Anime ou usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes do mangá:', error);
        res.status(500).send('Erro ao buscar detalhes do mangá');
    }
});



router.get('/api/buscar-animes', async (req, res) => {
    const title = req.query.title;
    try {
        const animes = await Anime.findAll({
            where: {
                Nome: {
                    [Op.like]: `%${title}%`
                }
            }
        });
        res.json(animes);
    } catch (error) {
        console.error('Erro ao buscar animes:', error);
        res.status(500).json({ error: 'Erro ao buscar animes' });
    }
});


router.get('/api/buscar-mangas', async (req, res) => {
    const title = req.query.title;
    try {
        const mangas = await Manga.findAll({
            where: {
                Titulo: {
                    [Op.like]: `%${title}%`
                }
            }
        });
        res.json(mangas);
    } catch (error) {
        console.error('Erro ao buscar mangás:', error);
        res.status(500).json({ error: 'Erro ao buscar mangás' });
    }
});


router.post('/favoritar-anime', async (req, res) => {
    const { idAnime, idUsuario } = req.body;

    try {

        
        const anime = await Anime.findByPk(idAnime);

        if (anime) {
            
            anime.Membros += 1;
            await anime.save();

            
            

            res.status(200).json({ message: 'Anime favoritado com sucesso!' });
        } else {
            res.status(404).json({ error: 'Anime não encontrado!' });
        }
    } catch (error) {
        console.error('Erro ao favoritar anime:', error);
        res.status(500).json({ error: 'Erro ao favoritar o anime' });
    }
});

router.post('/avaliar-anime', async (req, res) => {
    const { idAnime, idUsuario, novaNota } = req.body;
  
    try {
        
        const anime = await Anime.findByPk(idAnime);
  
        if (anime) {
            
            const avaliacaoExistente = await AvaliacaoAnime.findOne({
                where: {
                    IDAnime: idAnime,
                    IDUsuario: idUsuario,
                }
            });
  
            if (avaliacaoExistente) {
                
                avaliacaoExistente.nota = novaNota;
                await avaliacaoExistente.save();
            } else {
                
                await AvaliacaoAnime.create({
                    IDAnime: idAnime,
                    IDUsuario: idUsuario,
                    nota: novaNota,
                });
            }
  
            
            const avaliacoes = await AvaliacaoAnime.findAll({
                where: { IDAnime: idAnime }
            });
  
            const somaNotas = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
            const mediaNotas = somaNotas / avaliacoes.length;
  
            
            anime.Nota = mediaNotas.toFixed(1);
            
            
            await anime.save();
  
            res.status(200).json({ message: 'Avaliação registrada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Anime não encontrado!' });
        }
    } catch (error) {
        console.error('Erro ao atualizar avaliação do anime:', error);
        res.status(500).json({ error: 'Erro ao registrar a avaliação' });
    }
});


router.get('/api/popular-animes', async (req, res) => {
    try {
      const animes = await Anime.findAll({
        order: [['Membros', 'DESC']],  
        limit: 5,                    
      });
      res.json(animes); 
    } catch (error) {
      console.error('Erro ao buscar animes populares:', error);
      res.status(500).json({ error: 'Erro ao buscar animes populares' });
    }
});

router.get('/api/animes-mais-bem-avaliados', async (req, res) => {
    try {
        const animes = await AvaliacaoAnime.findAll({
            attributes: [
                'IDAnime',
                [Sequelize.fn('AVG', Sequelize.col('AvaliacaoAnime.nota')), 'Nota'], 
            ],
            group: ['IDAnime'],
            order: [[Sequelize.fn('AVG', Sequelize.col('AvaliacaoAnime.nota')), 'DESC']],
            limit: 5,
            include: [
                {
                    model: Anime,
                    attributes: ['Nome'],
                },
            ],
        });

        const resposta = animes.map(avaliacao => ({
            IDAnime: avaliacao.IDAnime,
            Nome: avaliacao.Anime.Nome,
            Nota: parseFloat(avaliacao.dataValues.Nota).toFixed(2), 
        }));

        res.json(resposta);
    } catch (error) {
        console.error('Erro ao buscar animes mais bem avaliados:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.post('/favoritar-manga', async (req, res) => {
    const { idManga, idUsuario } = req.body;

    try {
        const manga = await Manga.findByPk(idManga);

        if (manga) {
            
            manga.Membros += 1;
            await manga.save();

            
            

            res.status(200).json({ message: 'Mangá favoritado com sucesso!' });
        } else {
            res.status(404).json({ error: 'Mangá não encontrado!' });
        }
    } catch (error) {
        console.error('Erro ao favoritar mangá:', error);
        res.status(500).json({ error: 'Erro ao favoritar o mangá' });
    }
});

router.post('/avaliar-manga', async (req, res) => {
    const { idManga, idUsuario, novaNota } = req.body;

    try {
        const manga = await Manga.findByPk(idManga);

        if (manga) {
            
            const avaliacaoExistente = await AvaliacaoManga.findOne({
                where: {
                    IDManga: idManga,
                    IDUsuario: idUsuario,
                }
            });

            if (avaliacaoExistente) {
                
                avaliacaoExistente.nota = novaNota;
                await avaliacaoExistente.save();
            } else {
                
                await AvaliacaoManga.create({
                    IDManga: idManga,
                    IDUsuario: idUsuario,
                    nota: novaNota,
                });
            }

            
            const avaliacoes = await AvaliacaoManga.findAll({
                where: { IDManga: idManga }
            });

            const somaNotas = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
            const mediaNotas = somaNotas / avaliacoes.length;

            manga.Nota = mediaNotas.toFixed(1);
            await manga.save();

            res.status(200).json({ message: 'Avaliação registrada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Mangá não encontrado!' });
        }
    } catch (error) {
        console.error('Erro ao registrar avaliação do mangá:', error);
        res.status(500).json({ error: 'Erro ao registrar a avaliação' });
    }
});

router.get('/api/popular-mangas', async (req, res) => {
    try {
        const mangas = await Manga.findAll({
            order: [['Membros', 'DESC']],
            limit: 5,
        });
        res.json(mangas);
    } catch (error) {
        console.error('Erro ao buscar mangás populares:', error);
        res.status(500).json({ error: 'Erro ao buscar mangás populares.' });
    }
});

router.get('/api/mangas-mais-bem-avaliados', async (req, res) => {
    try {
        const mangas = await AvaliacaoManga.findAll({
            attributes: [
                'IDManga',
                [Sequelize.fn('AVG', Sequelize.col('AvaliacaoManga.nota')), 'Nota'],
            ],
            group: ['IDManga'],
            order: [[Sequelize.fn('AVG', Sequelize.col('AvaliacaoManga.nota')), 'DESC']],
            limit: 5,
            include: [
                {
                    model: Manga,
                    attributes: ['Titulo'],
                },
            ],
        });

        const resposta = mangas.map(avaliacao => ({
            IDManga: avaliacao.IDManga,
            Titulo: avaliacao.Manga.Titulo,
            Nota: parseFloat(avaliacao.dataValues.Nota).toFixed(2),
        }));

        res.json(resposta);
    } catch (error) {
        console.error('Erro ao buscar mangás mais bem avaliados:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});


router.get('/api/animes-recentes', async (req, res) => {
    try {
      const animesRecentes = await Anime.findAll({
        order: [['Start_Aired', 'DESC']],
        limit: 5,
        attributes: ['IDAnime', 'Nome', 'Start_Aired']
      });

      const animesFiltrados = animesRecentes.filter(anime => anime.Start_Aired !== null);

      if (animesFiltrados.length > 0) {
        res.json(animesFiltrados.map(anime => anime.toJSON()));
      } else {
        res.status(404).json({ message: 'Nenhum anime recente encontrado' });
      }
    } catch (error) {
      console.error('Erro ao buscar animes recentes:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  });
  


router.get('/api/mangas-recentes', async (req, res) => {
    try {
      const mangasRecentes = await Manga.findAll({
        order: [['Ano', 'DESC']],
        limit: 5,
        attributes: ['IDManga', 'Titulo', 'Ano']
      });

      const mangasFiltrados = mangasRecentes.filter(manga => manga.Ano !== null);

      if (mangasFiltrados.length > 0) {
        res.json(mangasFiltrados.map(manga => manga.toJSON()));
      } else {
        res.status(404).json({ message: 'Nenhum mangá recente encontrado' });
      }
    } catch (error) {
      console.error('Erro ao buscar mangás recentes:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  });
  

router.get('/api/catalogoAnimes', async (req, res) => {
    const limit = 30;
    const page = parseInt(req.query.page) || 1;

    try {
        const offset = (page - 1) * limit;

        const animes = await Anime.findAll({
            limit: limit,
            offset: offset,
            raw: true
        });

        const animesMapeados = animes.map(anime => ({
            id: anime.IDAnime,
            nome: anime.Nome,
            genero: anime.Genero,
            tipo: anime.Tipo,
            episodios: anime.Episodios,
            status: anime.Status,
            startAired: anime.Start_Aired,
            endAired: anime.End_Aired,
            producers: anime.Producers,
            licensors: anime.Licensors,
            studios: anime.Studios,
            source: anime.Source,
            themes: anime.Themes,
            demographics: anime.Demographics,
            durationMinutes: anime.Duration_Minutes,
            rating: anime.Rating,
            nota: anime.Nota,
            membros: anime.Membros,
        }));

        res.json(animesMapeados);
    } catch (error) {
        console.error('Erro ao buscar animes:', error);
        res.status(500).send('Erro ao buscar animes');
    }
});


router.get('/api/catalogoMangas', async (req, res) => {
    try {
        const limit = 30;
        const offset = parseInt(req.query.offset) || 0;

        const mangas = await Manga.findAll({
            raw: true,
            limit: limit,
            offset: offset,
        });

        res.json(mangas);
    } catch (error) {
        console.error('Erro ao buscar mangás:', error);
        res.status(500).send('Erro ao buscar mangás');
    }
});

module.exports = router;