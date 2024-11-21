document.addEventListener('DOMContentLoaded', function () {
  const IDUsuario = document.body.dataset.idusuario;
  const listaContainer = document.getElementById('divListaAnimes');

  // Função para carregar as listas e animes do usuário
  async function carregarListas() {
    try {
      const response = await fetch(`/usuario/${IDUsuario}/listas-animes`);

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const listas = await response.json();

      // Limpa o container antes de adicionar novas listas
      listaContainer.innerHTML = '<h2 class="text-center">Lista Animes</h2>';

      if (listas.length > 0) {
        listas.forEach(lista => {
          const listaDiv = document.createElement('div');
          listaDiv.classList.add('row', 'mt-3');

          const listaHeader = document.createElement('div');
          listaHeader.classList.add('col-md-12');
          listaHeader.innerHTML = `<h4>${lista.Nome}</h4>`;

          // Div pai que envolve os animes dessa lista
          const animeContainer = document.createElement('div');
          animeContainer.classList.add('col-md-12', 'd-flex', 'align-items-center', 'justify-content-between', 'lista-box', 'bg-white');  // Adicionando a classe bg-white

          // Adicionando padding e bordas arredondadas com CSS
          animeContainer.style.padding = '20px';  // Padding para dar mais espaçamento
          animeContainer.style.borderRadius = '10px';  // Bordas arredondadas
          animeContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Adicionando uma leve sombra para destaque

          // Criação de uma div para os animes dentro da lista
          const animeListDiv = document.createElement('div');
          animeListDiv.classList.add('d-flex', 'justify-content-center', 'flex-row', 'lista-imagens');

          // Verifica se existem animes na lista
          if (lista.Animes && lista.Animes.length > 0) {
            lista.Animes.forEach(anime => {
              const animeDiv = document.createElement('div');
              animeDiv.classList.add('anime-box'); // Classe para estilizar a div do anime

              // Criação do título do anime dentro da div
              const animeTitleDiv = document.createElement('div');
              animeTitleDiv.classList.add('anime-title-container'); // Contêiner para o título do anime
              animeTitleDiv.innerHTML = `<h6>${anime.Nome}</h6>`; // Coloca o nome do anime dentro da div

              // Adiciona o título dentro da div do anime
              animeDiv.appendChild(animeTitleDiv);

              // Adiciona a div do anime à lista de animes
              animeListDiv.appendChild(animeDiv);
            });
          } else {
            animeListDiv.innerHTML = "<p>Sem animes nesta lista</p>";
          }

          // Adiciona a div dos animes dentro da div pai da lista
          animeContainer.appendChild(animeListDiv);
          listaDiv.appendChild(listaHeader);
          listaDiv.appendChild(animeContainer);

          // Adiciona a lista à lista de animes no container
          listaContainer.appendChild(listaDiv);
        });
      } else {
        listaContainer.innerHTML += '<p class="text-center">Nenhuma lista encontrada.</p>';
      }
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
      listaContainer.innerHTML = '<p class="text-center">Erro ao carregar listas.</p>';
    }
  }

  // Carregar as listas ao iniciar a página
  carregarListas();

  // Função para criar uma nova lista
  document.getElementById('criarListaBtn').addEventListener('click', async () => {
    const nomeLista = document.getElementById('nomeLista').value.trim();

    if (nomeLista) {
      try {
        const response = await fetch('/criar-lista', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: nomeLista, IDUsuario })
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          $('#criarListaModal').modal('hide'); // Fecha o modal após criar a lista
          carregarListas(); // Recarrega as listas para mostrar a nova lista criada
        } else {
          alert(data.message || 'Erro ao criar a lista');
        }
      } catch (error) {
        console.error('Erro ao criar lista:', error);
        alert('Erro ao criar lista');
      }
    } else {
      alert('Por favor, insira um nome para a lista');
    }
  });

  // Manipulador de evento para o link de listas de mangas
  const linkListasMangas = document.getElementById('linkListasMangas');

  linkListasMangas.addEventListener('click', async function(event) {
    event.preventDefault();  // Evita o comportamento padrão do link
    try {
      // Fazendo a requisição para pegar as listas de mangas
      const response = await fetch(`/usuario/${IDUsuario}/listas-mangas`);

      if (!response.ok) {
        throw new Error('Erro ao carregar as listas de mangas');
      }

      const listasMangas = await response.json();
      console.log(listasMangas); // Você pode checar aqui as listas de mangas

      // Redireciona para a página de listas de mangas
      window.location.href = `/listas-mangas?usuarioId=${IDUsuario}`;
    } catch (error) {
      console.error('Erro ao carregar as listas de mangas:', error);
    }
  });
});
