const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/Usuario');

const router = express.Router();

router.post('/paginaCadastro', async (req, res) => {
  const { nome, idade, email, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    await User.create({
      Nome: nome,
      Idade: idade,
      Email: email,
      Senha: hashedPassword,
    });

    const user = await User.findOne({ where: { Email: email } });
    req.session.infoUsuario = user;
    res.redirect('/paginaPrincipal');

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send('Erro ao cadastrar usuário.');
  }
});

router.post('/logarUsuario', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      return res.status(400).send('Email ou senha incorretos');
    }

    const isMatch = await bcrypt.compare(senha, user.Senha); 
    if (!isMatch) {
      return res.status(400).send('Email ou senha incorretos');
    }
    req.session.infoUsuario = user;
    res.redirect('/paginaPrincipal');
    
  } catch (error) {
    console.error('Erro ao tentar logar:', error);
    res.status(500).send('Erro ao tentar logar.');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao sair da conta:', err);
      return res.status(500).send('Erro ao sair da conta.');
    }
    res.redirect('/');
  });
});

module.exports = router;
