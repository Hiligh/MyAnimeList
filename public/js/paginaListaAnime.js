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

      listaContainer.innerHTML = '<h2 class="text-center">Lista Animes</h2>';

      if (listas.length > 0) {
        listas.forEach(lista => {
          const listaDiv = document.createElement('div');
          listaDiv.classList.add('row', 'mt-3');

          const listaHeader = document.createElement('div');
          listaHeader.classList.add('col-md-12');
          listaHeader.innerHTML = `<h4>${lista.Nome}</h4>`;

          const animeContainer = document.createElement('div');
          animeContainer.classList.add('col-md-12', 'd-flex', 'align-items-center', 'justify-content-between', 'lista-box', 'bg-white');

          animeContainer.style.padding = '20px';
          animeContainer.style.borderRadius = '10px';
          animeContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

          const animeListDiv = document.createElement('div');
          animeListDiv.classList.add('d-flex', 'justify-content-center', 'flex-row', 'lista-imagens');

          if (lista.Animes && lista.Animes.length > 0) {
            lista.Animes.forEach(anime => {
              const animeDiv = document.createElement('div');
              animeDiv.classList.add('anime-box');
              const animeTitleDiv = document.createElement('div');
              animeTitleDiv.classList.add('anime-title-container');
              animeTitleDiv.innerHTML = `<h6>${anime.Nome}</h6>`;

              animeDiv.appendChild(animeTitleDiv);

              animeListDiv.appendChild(animeDiv);
            });
          } else {
            animeListDiv.innerHTML = "<p>Sem animes nesta lista</p>";
          }

          animeContainer.appendChild(animeListDiv);
          listaDiv.appendChild(listaHeader);
          listaDiv.appendChild(animeContainer);

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
          $('#criarListaModal').modal('hide');
          carregarListas();
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
    event.preventDefault();
    try {
      const response = await fetch(`/usuario/${IDUsuario}/listas-mangas`);

      if (!response.ok) {
        throw new Error('Erro ao carregar as listas de mangas');
      }

      const listasMangas = await response.json();
      console.log(listasMangas);

      window.location.href = `/listas-mangas?usuarioId=${IDUsuario}`;
    } catch (error) {
      console.error('Erro ao carregar as listas de mangas:', error);
    }
  });
});
