const express = require('express');
const { Op } = require('sequelize');  // Importando o Op do Sequelize
const Manga = require('../models/mangas');
const Anime = require('../models/animes');
const Usuario = require('../models/Usuario');
const AvaliacaoAnime = require('../models/AvaliacaoAnime');
const AvaliacaoManga = require('../models/AvaliacaoManga');
const ListaAnime = require('../models/listaAnime');
const ListaManga = require('../models/listaManga');
const Lista = require('../models/lista');
const router = express.Router();
const Sequelize = require('../config/database');

router.get('/anime/:id', async (req, res) => {
    try {
        const idAnime = req.params.id;  // ID do anime da URL
        const idusuario = req.query.idusuario;  // Acessa o idusuario na query string

        // Consultando informações do anime
        const anime = await Anime.findByPk(idAnime, { raw: true });

        // Consultando informações do usuário
        const usuario = await Usuario.findByPk(idusuario, { raw: true });

        if (anime && usuario) {
            // Agora, buscamos as avaliações do anime para calcular a média das notas
            const avaliacoes = await AvaliacaoAnime.findAll({
                where: { IDAnime: idAnime }
            });

            // Calculando a soma das notas e a média
            const somaNotas = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
            const mediaNotas = avaliacoes.length > 0 ? (somaNotas / avaliacoes.length).toFixed(1) : 0;  // Caso não haja avaliações, a média será 0

            // Passa o anime, usuário e a média das notas
            res.render('paginaAnime', {
                detalhesAnime: anime,
                infoUsuario: usuario,
                mediaNota: mediaNotas  // Adiciona a média das notas ao objeto de dados
            });
        } else {
            res.status(404).send('Anime ou usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes do anime:', error);
        res.status(500).send('Erro ao buscar detalhes do anime');
    }
});



// Rota para detalhes de Mangá
router.get('/manga/:id', async (req, res) => {
    try {
        const manga = await Manga.findByPk(req.params.id, { raw: true });
        const infoUsuario = req.query.idusuario;  // Acessa o idusuario na query string

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


// Rota para buscar animes pelo título
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

// Rota para buscar mangás pelo título
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

// Rota para favoritar o anime
router.post('/favoritar-anime', async (req, res) => {
    const { idAnime, idUsuario } = req.body;

    try {

        // Para incrementar o número de membros (que representa o número de favoritos)
        const anime = await Anime.findByPk(idAnime);

        if (anime) {
            // Incrementa o número de membros que favoritaram o anime
            anime.Membros += 1;
            await anime.save();

            // Aqui você pode adicionar o usuário à lista de favoritos, por exemplo:
            // await UsuarioAnimeFavorito.create({ idUsuario, idAnime }); // Tabela de favoritos

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
        // Verifica se o anime existe
        const anime = await Anime.findByPk(idAnime);
  
        if (anime) {
            // Verifica se o usuário já avaliou este anime
            const avaliacaoExistente = await AvaliacaoAnime.findOne({
                where: {
                    IDAnime: idAnime,
                    IDUsuario: idUsuario,
                }
            });
  
            if (avaliacaoExistente) {
                // Se já houver uma avaliação, atualiza a nota
                avaliacaoExistente.nota = novaNota;
                await avaliacaoExistente.save();
            } else {
                // Se o usuário ainda não avaliou, cria uma nova avaliação
                await AvaliacaoAnime.create({
                    IDAnime: idAnime,
                    IDUsuario: idUsuario,
                    nota: novaNota,
                });
            }
  
            // Agora, vamos atualizar a Nota média do anime
            const avaliacoes = await AvaliacaoAnime.findAll({
                where: { IDAnime: idAnime }
            });
  
            const somaNotas = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
            const mediaNotas = somaNotas / avaliacoes.length;
  
            // Atualiza a Nota média do anime
            anime.Nota = mediaNotas.toFixed(1);
            // Não alteramos a contagem de Membros diretamente no modelo Anime
            // A contagem de membros é gerenciada pela tabela AvaliacaoAnime.
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

// Rota para obter os animes mais populares
router.get('/api/popular-animes', async (req, res) => {
    try {
      const animes = await Anime.findAll({
        order: [['Membros', 'DESC']],  // Ordena pela quantidade de membros
        limit: 5,                    // Limita a 10 animes mais populares
      });
      res.json(animes); // Retorna os animes como JSON
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
                [Sequelize.fn('AVG', Sequelize.col('AvaliacaoAnime.nota')), 'Nota'], // Retorna a média das notas como 'Nota'
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
            Nota: parseFloat(avaliacao.dataValues.Nota).toFixed(2), // Converte e formata a nota média
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
            // Incrementa o número de membros que favoritaram o mangá
            manga.Membros += 1;
            await manga.save();

            // (Opcional) Adiciona o mangá à tabela de favoritos do usuário
            // await UsuarioMangaFavorito.create({ idUsuario, idManga });

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
            // Verifica se o usuário já avaliou este mangá
            const avaliacaoExistente = await AvaliacaoManga.findOne({
                where: {
                    IDManga: idManga,
                    IDUsuario: idUsuario,
                }
            });

            if (avaliacaoExistente) {
                // Atualiza a nota existente
                avaliacaoExistente.nota = novaNota;
                await avaliacaoExistente.save();
            } else {
                // Cria uma nova avaliação
                await AvaliacaoManga.create({
                    IDManga: idManga,
                    IDUsuario: idUsuario,
                    nota: novaNota,
                });
            }

            // Atualiza a média de notas do mangá
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
                [Sequelize.fn('AVG', Sequelize.col('AvaliacaoManga.nota')), 'Nota'], // Calcula a média das notas
            ],
            group: ['IDManga'],
            order: [[Sequelize.fn('AVG', Sequelize.col('AvaliacaoManga.nota')), 'DESC']],
            limit: 5,
            include: [
                {
                    model: Manga,
                    attributes: ['Titulo'], // Retorna o título do mangá
                },
            ],
        });

        const resposta = mangas.map(avaliacao => ({
            IDManga: avaliacao.IDManga,
            Titulo: avaliacao.Manga.Titulo,
            Nota: parseFloat(avaliacao.dataValues.Nota).toFixed(2), // Converte e formata a nota média
        }));

        res.json(resposta);
    } catch (error) {
        console.error('Erro ao buscar mangás mais bem avaliados:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para Animes Recentes
router.get('/api/animes-recentes', async (req, res) => {
    try {
      const animesRecentes = await Anime.findAll({
        order: [['Start_Aired', 'DESC']],  // Ordena pela data de início de exibição
        limit: 5,                         // Limita a 5 animes mais recentes
        attributes: ['IDAnime', 'Nome', 'Start_Aired']  // Seleciona os campos necessários
      });
  
      // Filtra os animes onde a data de início (Start_Aired) não seja null
      const animesFiltrados = animesRecentes.filter(anime => anime.Start_Aired !== null);
  
      // Verifica se existem animes encontrados
      if (animesFiltrados.length > 0) {
        res.json(animesFiltrados.map(anime => anime.toJSON())); // Retorna os dados dos animes
      } else {
        res.status(404).json({ message: 'Nenhum anime recente encontrado' });
      }
    } catch (error) {
      console.error('Erro ao buscar animes recentes:', error);  // Log do erro no servidor
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message }); // Detalha o erro na resposta
    }
  });
  

// Rota para Mangás Recentes
router.get('/api/mangas-recentes', async (req, res) => {
    try {
      const mangasRecentes = await Manga.findAll({
        order: [['Ano', 'DESC']],           // Ordena pelo ano de publicação mais recente
        limit: 5,                           // Limita a 5 mangás mais recentes
        attributes: ['IDManga', 'Titulo', 'Ano']  // Seleciona os campos necessários
      });
  
      // Filtra os mangás onde o ano (Ano) não seja null
      const mangasFiltrados = mangasRecentes.filter(manga => manga.Ano !== null);
  
      // Verifica se existem mangás encontrados
      if (mangasFiltrados.length > 0) {
        res.json(mangasFiltrados.map(manga => manga.toJSON())); // Retorna os dados dos mangás
      } else {
        res.status(404).json({ message: 'Nenhum mangá recente encontrado' });
      }
    } catch (error) {
      console.error('Erro ao buscar mangás recentes:', error);  // Log do erro no servidor
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message }); // Detalha o erro na resposta
    }
  });
  
// Rota para listar animes com paginação
router.get('/api/catalogoAnimes', async (req, res) => {
    const limit = 30; // Número máximo de animes por página
    const page = parseInt(req.query.page) || 1; // Página solicitada (default é 1)

    try {
        // Calcular o offset com base na página
        const offset = (page - 1) * limit;

        // Buscar os animes com base na paginação
        const animes = await Anime.findAll({
            limit: limit,
            offset: offset,
            raw: true
        });

        // Mapear os animes para um formato mais amigável
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

        // Envia os animes como JSON
        res.json(animesMapeados);
    } catch (error) {
        console.error('Erro ao buscar animes:', error);
        res.status(500).send('Erro ao buscar animes');
    }
});

// Rota para listar os mangás
router.get('/api/catalogoMangas', async (req, res) => {
    try {
        // Definindo o número de mangás a ser retornado por vez (30)
        const limit = 30;
        const offset = parseInt(req.query.offset) || 0; // Certificando-se de que o offset seja um número inteiro

        const mangas = await Manga.findAll({
            raw: true,
            limit: limit,   // O limite é passado diretamente como número
            offset: offset, // O offset agora também é um número
        });

        // Envia os mangás como resposta JSON
        res.json(mangas);
    } catch (error) {
        console.error('Erro ao buscar mangás:', error);
        res.status(500).send('Erro ao buscar mangás');
    }
});

module.exports = router;