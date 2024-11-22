# **MyAnimeList**

Esse projeto é feito com o intuito de aprender as técnicas e ferramentas da disciplina de programação web.

## Como usar

### Configurando os pacotes:
- Apenas dê um npm install no seu terminal, o projeto já tem o arquivo package.json configurado.

### Banco de dados utilizado
- Foi utilizado o mysql como banco de dados.
- Para fazer a integração com node/express, se usou a biblioteca sequelize.
- Apenas crie um novo banco de dados na sua máquina, e linque ele com o projeto na pasta config.

### Rodando o programa
#### Sua primeira vez usando.
- No terminal, para ter todos os dados de animes e mangás no seu banco de dados, utilize o comando:
~~~javascript
npm start -- --importData
~~~
- Ele irá adicionar os animes e mangás no banco de dados.
- Após o término, finalize a sessão do terminal com ctrl + c e rode o programa normalmente usando:
~~~javascript
npm start
~~~
