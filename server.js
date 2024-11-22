const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const { engine } = require('express-handlebars');
const { importData } = require('./utils/importData');
const dataRoutes = require('./routes/dataRoutes');
const listasRoutes = require('./routes/listaRoutes');

// Importa modelos e configura associações
const Usuario = require('./models/Usuario');
const Lista = require('./models/lista');
const ListaAnime = require('./models/listaAnime');
const ListaManga = require('./models/listaManga');
const Anime = require('./models/animes');
const Manga = require('./models/mangas');
const AvaliacaoAnime = require('./models/AvaliacaoAnime.js');
const AvaliacaoManga = require('./models/AvaliacaoManga.js');

const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const app = express();
const port = 3000;

const handlebars = allowInsecurePrototypeAccess(Handlebars);

app.engine('handlebars', engine({
  defaultLayout: false,
  handlebars: handlebars,
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true,
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'chave-secreta',
  resave: false,
  saveUninitialized: true,
}));

function checkAuth(req, res, next) {
  if (!req.session.infoUsuario) {
    return res.redirect('/logarUsuario');
  }
  next();
}

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/logarUsuario', (req, res) => {
  res.render('paginaLogin');
});

app.get('/cadastrarUsuario', (req, res) => {
  res.render('paginaCadastro');
});

app.get('/paginaPrincipal', checkAuth, (req, res) => {
  const infoUsuario = req.session.infoUsuario;
  res.render('paginaPrincipal', { infoUsuario });
});

app.get('/perfilUsuario', checkAuth, (req, res) => {
  const infoUsuario = req.session.infoUsuario;
  res.render('perfilUsuario', { infoUsuario });
});

app.get('/catalogoAnimes', checkAuth, (req, res) => {
  const infoUsuario = req.session.infoUsuario;
  res.render('catalogoAnimes', { infoUsuario });
});

app.get('/catalogoMangas', checkAuth, (req, res) => {
  const infoUsuario = req.session.infoUsuario;
  res.render('catalogoMangas', { infoUsuario });
});


app.get('/listas-animes', async (req, res) => {
  try {

    if (!req.session.infoUsuario) {
      return res.redirect('/login');
    }

    const usuario = req.session.infoUsuario;

    res.render('listaAnimes', { infoUsuario: usuario });
  } catch (error) {
    console.error('Erro ao carregar a página de listas de animes:', error);
    res.status(500).send('Erro ao carregar a página.');
  }
});

app.get('/listas-mangas', checkAuth, async (req, res) => {
  try {
    if (!req.session.infoUsuario) {
      return res.redirect('/login');
    }

    const usuario = req.session.infoUsuario;

    res.render('listaMangas', { infoUsuario: usuario });
  } catch (error) {
    console.error('Erro ao carregar a página de listas de animes:', error);
    res.status(500).send('Erro ao carregar a página.');
  }
});

app.get('/mangas/:idLista', async (req, res) => {
  const { idLista } = req.params;

  try {

    const listaComMangas = await Lista.findOne({
      where: { IDLista: idLista },
      include: [
        {
          model: Manga,
          through: { attributes: [] }
        }
      ]
    });

    if (!listaComMangas) {
      return res.status(404).send('Lista não encontrada');
    }

    res.json(listaComMangas.Mangas);
  } catch (error) {
    console.error('Erro ao buscar mangas:', error);
    res.status(500).send('Erro ao buscar mangas');
  }
});

app.use('/', userRoutes);
app.use('/', dataRoutes);
app.use('/', listasRoutes);


app.listen(port, async () => {
  try {

    await sequelize.sync({ force: false, logging: false });
    console.log('DB Conectado e tabelas sincronizadas!');
    console.log(`Servidor rodando em: http://localhost:${port}`);

    Usuario.hasMany(Lista, { foreignKey: 'IDUsuario' });
    Lista.belongsTo(Usuario, { foreignKey: 'IDUsuario' });

    Lista.belongsToMany(Anime, { through: ListaAnime, foreignKey: 'IDLista' });
    Anime.belongsToMany(Lista, { through: ListaAnime, foreignKey: 'IDAnime' });

    Lista.belongsToMany(Manga, { through: ListaManga, foreignKey: 'IDLista' });
    Manga.belongsToMany(Lista, { through: ListaManga, foreignKey: 'IDManga' });

    Anime.hasMany(AvaliacaoAnime, { foreignKey: 'IDAnime' });
    AvaliacaoAnime.belongsTo(Anime, { foreignKey: 'IDAnime' });

    Usuario.hasMany(AvaliacaoAnime, { foreignKey: 'IDUsuario' });
    AvaliacaoAnime.belongsTo(Usuario, { foreignKey: 'IDUsuario' });

    AvaliacaoManga.belongsTo(Manga, {
      foreignKey: 'IDManga',
      targetKey: 'IDManga'
    });

    Manga.hasMany(AvaliacaoManga, {
      foreignKey: 'IDManga',
      sourceKey: 'IDManga'
    });

    if (process.argv.includes('--importData')) {
      console.log('Importando dados...');
      await importData();
      console.log('Importação de dados concluída!');
    }
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  }
});