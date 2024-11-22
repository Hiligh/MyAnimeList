document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-item');
    const resultsDropdown = document.getElementById('search-results-dropdown');
    const idusuario = document.body.dataset.idusuario;
    const mangaID = document.body.getAttribute('data-idmanga');

    // Funções de busca e dropdown
    const searchMangas = async (query) => {
        try {
            const response = await fetch(`/api/buscar-mangas?title=${encodeURIComponent(query)}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Erro ao buscar mangas:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Erro ao buscar mangas:', error);
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

    // Função para carregar as listas do usuário
    async function carregarListas() {
        const listasDisponiveisElement = document.getElementById('listasDisponiveis');
        if (!listasDisponiveisElement) {
            console.error("Elemento com id 'listasDisponiveis' não encontrado.");
            return;
        }

        try {
            const response = await fetch(`/usuario/${idusuario}/listas-mangas`);

            if (!response.ok) {
                throw new Error(`Erro ao carregar listas: ${response.statusText}`);
            }

            const listas = await response.json();

            listasDisponiveisElement.innerHTML = '';

            if (listas.length > 0) {
                listas.forEach(lista => {
                    const listaButton = document.createElement('button');
                    listaButton.classList.add('btn', 'btn-primary', 'btn-block', 'mt-2');
                    listaButton.textContent = lista.Nome;
                    listaButton.addEventListener('click', () => adicionarMangaNaLista(lista.IDLista));
                    listasDisponiveisElement.appendChild(listaButton);
                });
            } else {
                listasDisponiveisElement.innerHTML = '<p>Você não tem listas de animes.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar listas:', error);
        }
    }

    const idManga = document.body.dataset.idmanga;
    async function adicionarMangaNaLista(IDLista) {
        try {
            const response = await fetch('/adicionar-manga', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ IDLista, IDManga: idManga })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao adicionar mangá à lista');
            }
    
            const data = await response.json();
            alert('Mangá adicionado à lista com sucesso!');
            $('#selectListModal').modal('hide');
        } catch (error) {
            console.error('Erro ao adicionar mangá à lista:', error);
            alert(error.message || 'Erro ao adicionar mangá à lista');
        }
    }

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

    document.getElementById('favoritar-manga').addEventListener('click', async function() {
        try {
            const response = await fetch('/favoritar-manga', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idManga: mangaID,
                    idUsuario: idusuario
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Mangá adicionado aos favoritos!');
            } else {
                alert(data.error || 'Erro ao favoritar o mangá.');
            }
        } catch (error) {
            console.error('Erro ao favoritar mangá:', error);
            alert('Erro de conexão. Tente novamente.');
        }
    });

    // Evento para abrir o pop-up de avaliação
    document.getElementById('avaliar-manga').addEventListener('click', () => {
        const nota = prompt('Avalie este mangá com uma nota de 0 a 5:');
        if (nota !== null && nota >= 0 && nota <= 5) {
            avaliarManga(nota);
        } else {
            alert('Por favor, insira uma nota válida entre 0 e 5.');
        }
    });

    // Função para enviar a avaliação
    async function avaliarManga(nota) {
        try {
            const response = await fetch('/avaliar-manga', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idManga: mangaID,
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
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
            alert('Erro ao enviar sua avaliação. Tente novamente.');
        }
    }
});