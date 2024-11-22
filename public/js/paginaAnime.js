document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-item');
    const resultsDropdown = document.getElementById('search-results-dropdown');
    const idusuario = document.body.dataset.idusuario;
    const animeID = document.body.dataset.idanime;

    // Funções de busca e dropdown
    const searchMangas = async (query) => {
        try {
            const response = await fetch(`/api/buscar-mangas?title=${encodeURIComponent(query)}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Erro ao buscar mangás:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Erro ao buscar mangás:', error);
            return [];
        }
    };

    const searchAnimes = async (query) => {
        try {
            const response = await fetch(`/api/buscar-animes?title=${encodeURIComponent(query)}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Erro ao buscar animes:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Erro ao buscar animes:', error);
            return [];
        }
    };

    const updateDropdown = (mangas, animes) => {
        resultsDropdown.innerHTML = '';

        if (mangas.length > 0) {
            const mangaHeader = document.createElement('li');
            mangaHeader.classList.add('dropdown-header');
            mangaHeader.textContent = 'Mangás';
            resultsDropdown.appendChild(mangaHeader);
    
            mangas.forEach(manga => {
                const item = document.createElement('li');
                item.classList.add('dropdown-item');
                item.textContent = manga.Titulo;
                item.addEventListener('click', () => {
                    window.location.href = `/manga/${manga.IDManga}?idusuario=${idusuario}`;
                });
    
                resultsDropdown.appendChild(item);
            });
        }

        if (animes.length > 0) {
            const animeHeader = document.createElement('li');
            animeHeader.classList.add('dropdown-header');
            animeHeader.textContent = 'Animes';
            resultsDropdown.appendChild(animeHeader);
    
            animes.forEach(anime => {
                const item = document.createElement('li');
                item.classList.add('dropdown-item');
                item.textContent = anime.Nome;
                item.addEventListener('click', () => {
                    window.location.href = `/anime/${anime.IDAnime}?idusuario=${idusuario}`;
                });
                resultsDropdown.appendChild(item);
            });
        }

        if (mangas.length === 0 && animes.length === 0) {
            const noResults = document.createElement('li');
            noResults.classList.add('dropdown-item');
            noResults.textContent = 'Nenhum resultado encontrado';
            resultsDropdown.appendChild(noResults);
        }

        resultsDropdown.classList.add('show');
    };

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (query.length > 1) {
            const [mangas, animes] = await Promise.all([searchMangas(query), searchAnimes(query)]);
            updateDropdown(mangas, animes);
        } else {
            resultsDropdown.classList.remove('show');
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
            resultsDropdown.classList.remove('show');
        }
    });
    
    const listasDisponiveisElement = document.getElementById('listasDisponiveis');
    
    async function carregarListas() {
        try {
          const response = await fetch(`/usuario/${idusuario}/listas-animes`);
      
          if (!response.ok) {
            throw new Error('Erro ao carregar listas de animes');
          }
      
          const listas = await response.json();
      
          listasDisponiveisElement.innerHTML = '';

          if (listas.length > 0) {
            listas.forEach((lista) => {
              const listaButton = document.createElement('button');
              listaButton.classList.add('btn', 'btn-primary', 'btn-block', 'mt-2');
              listaButton.textContent = lista.Nome;
              listaButton.addEventListener('click', () => adicionarAnimeNaLista(lista.IDLista));
              listasDisponiveisElement.appendChild(listaButton);
            });
          } else {
            listasDisponiveisElement.innerHTML = '<p>Você não tem listas de animes.</p>';
          }
        } catch (error) {
          console.error('Erro ao carregar listas:', error);
          alert('Erro ao carregar listas');
        }
      }
      

    // Função para adicionar o anime na lista
    async function adicionarAnimeNaLista(IDLista) {
        try {
            const response = await fetch('/adicionar-anime', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ IDLista, IDAnime: animeID })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao adicionar anime à lista');
            }
    
            const data = await response.json();
            alert('Anime adicionado à lista com sucesso!');
            $('#selectListModal').modal('hide');
        } catch (error) {
            console.error('Erro ao adicionar anime à lista:', error);
            alert(error.message || 'Erro ao adicionar anime à lista');
        }
    }
    

    // Carregar as listas quando a página for carregada
    carregarListas();

    const linkListasAnimes = document.getElementById('linkListasAnimes');

    linkListasAnimes.addEventListener('click', async function(event) {
      event.preventDefault();

      try {
          const response = await fetch(`/usuario/${idusuario}/listas-animes`);

          if (!response.ok) {
              throw new Error('Erro ao carregar as listas de animes');
          }

          const listasAnimes = await response.json();
          console.log(listasAnimes);

          window.location.href = `/listas-animes?usuarioId=${idusuario}`;
      } catch (error) {
          console.error('Erro ao carregar as listas de animes:', error);
      }
    });

    const linkListasMangas = document.getElementById('linkListasMangas');

    linkListasMangas.addEventListener('click', async function(event) {
      event.preventDefault();
      console.log("conseguiu vir até aqui apertando o botão")
      try {

          const response = await fetch(`/usuario/${idusuario}/listas-mangas`);

          if (!response.ok) {
              throw new Error('Erro ao carregar as listas de mangas');
          }

          const listasMangas = await response.json();
          console.log(listasMangas);

          window.location.href = `/listas-mangas?usuarioId=${idusuario}`;
      } catch (error) {
          console.error('Erro ao carregar as listas de mangas:', error);
      }
    });

    // Ação ao clicar no botão "Favoritar Anime"
    document.getElementById('favoritar-anime').addEventListener('click', async function() {
        try {
            const response = await fetch('/favoritar-anime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idAnime: animeID,
                    idUsuario: idusuario
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Anime adicionado aos favoritos!');
            } else {
                alert('Erro ao favoritar o anime.');
            }
        } catch (error) {
            console.error('Erro ao favoritar anime:', error);
            alert('Erro de conexão. Tente novamente.');
        }
    });

    // Evento para abrir o pop-up
    document.getElementById('avaliar-anime').addEventListener('click', () => {
        document.getElementById('pop-up-avaliacao').style.display = 'flex';
    });

    // Evento para fechar o pop-up
    document.getElementById('cancelar-avaliacao').addEventListener('click', () => {
        document.getElementById('pop-up-avaliacao').style.display = 'none';
    });

    // Evento para enviar a avaliação
    document.getElementById('submit-avaliacao').addEventListener('click', async () => {
        const nota = parseInt(document.getElementById('nota').value);
        if (nota >= 0 && nota <= 5) {
            try {
                const response = await fetch('/avaliar-anime', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idAnime: animeID,
                        idUsuario: idusuario,
                        novaNota: nota
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`Sua avaliação de ${nota} foi registrada com sucesso!`);
                } else {
                    alert(data.error || 'Erro ao registrar a avaliação.');
                }

            // Fecha o pop-up
            document.getElementById('pop-up-avaliacao').style.display = 'none';
            } catch (error) {
                console.error('Erro ao enviar avaliação:', error);
                alert('Erro ao enviar sua avaliação. Tente novamente.');
            }
        } else {
            alert("Por favor, insira uma nota válida entre 0 e 5.");
        }
    });


});
