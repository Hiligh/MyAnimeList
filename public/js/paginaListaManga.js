document.addEventListener('DOMContentLoaded', function () {
  const IDUsuario = document.body.dataset.idusuario;
  const listaContainer = document.getElementById('divListaMangas');

  // Função para carregar as listas e mangás do usuário
  async function carregarListasMangas() {
      try {
          const response = await fetch(`/usuario/${IDUsuario}/listas-mangas`);

          // Verifica se a resposta foi bem-sucedida (status 200-299)
          if (!response.ok) {
              throw new Error(`Erro na requisição: ${response.statusText}`);
          }

          const listas = await response.json();

          // Limpa o container antes de adicionar novas listas
          listaContainer.innerHTML = '<h2 class="text-center">Lista de Mangás</h2>';

          if (listas.length > 0) {
              listas.forEach(lista => {
                  const listaDiv = document.createElement('div');
                  listaDiv.classList.add('row', 'mt-3');

                  const listaHeader = document.createElement('div');
                  listaHeader.classList.add('col-md-12');
                  listaHeader.innerHTML = `<h4>${lista.Nome}</h4>`;

                  const mangaContainer = document.createElement('div');
                  mangaContainer.classList.add('col-md-12', 'd-flex', 'align-items-center', 'justify-content-between', 'lista-box');

                  const mangaImages = document.createElement('div');
                  mangaImages.classList.add('d-flex', 'justify-content-center', 'flex-row', 'lista-imagens');

                  if (lista.Mangas && lista.Mangas.length > 0) {
                      lista.Mangas.forEach(manga => {
                        // Criação de uma div para o mangá
                        const mangaDiv = document.createElement('div');
                        mangaDiv.classList.add('manga-box'); // Classe para estilizar a div

                        // Criação do título do mangá dentro da div
                        const mangaTitle = document.createElement('div');
                        mangaTitle.classList.add('text-center', 'manga-title');
                        mangaTitle.innerHTML = `<h6>${manga.Titulo}</h6>`;
                        
                        mangaDiv.appendChild(mangaTitle);
                        mangaImages.appendChild(mangaDiv);
                      });
                  } else {
                      mangaImages.innerHTML = "<p>Sem mangas nesta lista</p>";
                  }

                  mangaContainer.appendChild(mangaImages);
                  listaDiv.appendChild(listaHeader);
                  listaDiv.appendChild(mangaContainer);
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
                  carregarListasMangas(); // Recarrega as listas para mostrar a nova lista criada
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

  const linkListasAnimes = document.getElementById('linkListasAnimes');
  
  linkListasAnimes.addEventListener('click', async function(event) {
    event.preventDefault();

    try {
        const response = await fetch(`/usuario/${IDUsuario}/listas-animes`);

        if (!response.ok) {
            throw new Error('Erro ao carregar as listas de animes');
        }

        const listasAnimes = await response.json();
        console.log(listasAnimes);

        window.location.href = `/listas-animes?usuarioId=${IDUsuario}`;
    } catch (error) {
        console.error('Erro ao carregar as listas de animes:', error);
    }
});

  // Inicializa o carregamento das listas
  carregarListasMangas();
});