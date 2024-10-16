const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware para proteger rotas que exigem login
function checkAuth(req, res, next) {
  if (!req.session.infoUsuario) {
    return res.redirect('/logarUsuario'); // Redireciona para a página de login se não estiver logado
  }
  next(); // Se estiver logado, continua para a próxima função
}

// Configurando o Express para usar Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware para lidar com dados JSON e de formulário.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Salvar informações do usuário em uma session.
app.use(session({
  secret: 'chave-secreta',
  resave: false,
  saveUninitialized: true,
}));

// Rota principal
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

app.get('/listaAnimes', checkAuth, (req, res) => {
  const infoUsuario = req.session.infoUsuario;
  res.render('listaAnimes', { infoUsuario });
});

app.get('/listaMangas', checkAuth, (req, res) => {
  const infoUsuario = req.session.infoUsuario;
  res.render('listaMangas', { infoUsuario });
});

app.use('/', userRoutes);

app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log('DB Conectado!');
    console.log(`Servidor rodando em: http://localhost:${port}`);
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  }
});
