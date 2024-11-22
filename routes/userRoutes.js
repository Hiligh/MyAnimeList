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

router.delete('/excluirConta', async (req, res) => {
  try {
    // Verifica se o usuário está autenticado
    if (!req.session.infoUsuario) {
      return res.status(401).send('Usuário não autenticado');
    }

    // Recupera o usuário a partir da sessão
    const usuarioId = req.session.infoUsuario.IDUsuario;

    // Exclui o usuário do banco de dados
    await User.destroy({ where: { IDUsuario: usuarioId } });

    // Finaliza a sessão
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Erro ao encerrar sessão');
      }
      res.status(200).send('Conta excluída com sucesso');
    });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    res.status(500).send('Erro ao excluir conta');
  }
});

// Rota para editar informações do usuário
router.put('/editarConta', async (req, res) => {
  try {
    // Verifica se o usuário está autenticado
    if (!req.session.infoUsuario) {
      return res.status(401).send('Usuário não autenticado');
    }

    const { nome, idade, senha } = req.body;

    // Recupera o ID do usuário a partir da sessão
    const usuarioId = req.session.infoUsuario.IDUsuario;

    // Se a senha for informada, criptografa a nova senha
    let updatedFields = { Nome: nome, Idade: idade };
    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      updatedFields.Senha = hashedPassword;
    }

    // Atualiza os dados do usuário no banco de dados
    const updatedUser = await User.update(updatedFields, {
      where: { IDUsuario: usuarioId },
    });

    if (updatedUser[0] === 0) {
      return res.status(400).send('Nenhuma alteração foi feita.');
    }

    // Atualiza as informações da sessão
    req.session.infoUsuario.Nome = nome;
    req.session.infoUsuario.Idade = idade;

    res.status(200).send('Informações atualizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao editar conta:', error);
    res.status(500).send('Erro ao editar conta');
  }
});


module.exports = router;
