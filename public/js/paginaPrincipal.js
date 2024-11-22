document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-item');
    const resultsDropdown = document.getElementById('search-results-dropdown');
    const idusuario = document.body.dataset.idusuario;

    // Função para buscar Mangás
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

    // Função para buscar Animes
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

    // Função para atualizar o dropdown com os resultados da pesquisa
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

    // Escuta o evento de digitação no input
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (query.length > 1) {
            const [mangas, animes] = await Promise.all([searchMangas(query), searchAnimes(query)]);
            updateDropdown(mangas, animes);
        } else {
            resultsDropdown.classList.remove('show');
        }
    });

    // Fecha o dropdown se clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
            resultsDropdown.classList.remove('show');
        }
    });

    // Código relacionado ao link de "Listas Animes"
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

  // Função para buscar os animes mais populares
    const fetchPopularAnimes = async () => {
        try {
            const response = await fetch('/api/popular-animes');
            if (response.ok) {
                const animes = await response.json();
                renderPopularAnimes(animes);
            } else {
                console.error('Erro ao buscar animes populares:', response.status);
            }
        } catch (error) {
            console.error('Erro ao buscar animes populares:', error);
        }
    };

    const renderPopularAnimes = (animes) => {
        const popularAnimesContainer = document.getElementById('popular-animes');
        popularAnimesContainer.innerHTML = '';

        if (animes.length === 0) {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.textContent = 'Nenhum anime encontrado.';
            popularAnimesContainer.appendChild(item);
        } else {

            animes.forEach(anime => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.textContent = anime.Nome;
                popularAnimesContainer.appendChild(item);
            });
        }
    };
    
    fetchPopularAnimes();

    const topRatedAnimesList = document.getElementById('top-rated-animes');

    // Função para buscar os animes mais bem avaliados
    const fetchTopRatedAnimes = async () => {
        try {
        const response = await fetch('/api/animes-mais-bem-avaliados');
        if (response.ok) {
            const animes = await response.json();
            updateTopRatedAnimes(animes);
        } else {
            console.error('Erro ao buscar os animes mais bem avaliados:', response.status);
            topRatedAnimesList.innerHTML = '<li class="list-group-item">Erro ao carregar os animes mais bem avaliados</li>';
        }
        } catch (error) {
        console.error('Erro ao buscar os animes mais bem avaliados:', error);
        topRatedAnimesList.innerHTML = '<li class="list-group-item">Erro ao carregar os animes mais bem avaliados</li>';
        }
    };

    // Função para atualizar a lista de animes mais bem avaliados na página
    const updateTopRatedAnimes = (animes) => {
        topRatedAnimesList.innerHTML = '';

        if (animes.length === 0) {
        topRatedAnimesList.innerHTML = '<li class="list-group-item">Nenhum anime encontrado</li>';
        } else {
        animes.forEach(anime => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = `${anime.Nome} - Nota: ${anime.Nota}`;

            topRatedAnimesList.appendChild(listItem);
        });
        }
    };

    fetchTopRatedAnimes();

    // Função para buscar os mangás mais populares
    const fetchPopularMangas = async () => {
        try {
            const response = await fetch('/api/popular-mangas');
            if (response.ok) {
                const mangas = await response.json();
                renderPopularMangas(mangas);
            } else {
                console.error('Erro ao buscar mangás populares:', response.status);
            }
        } catch (error) {
            console.error('Erro ao buscar mangás populares:', error);
        }
    };

    // Função para renderizar os mangás mais populares
    const renderPopularMangas = (mangas) => {
        const popularMangasContainer = document.getElementById('popular-mangas');
        popularMangasContainer.innerHTML = '';  // Limpa os mangás anteriores

        if (mangas.length === 0) {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.textContent = 'Nenhum mangá encontrado.';
            popularMangasContainer.appendChild(item);
        } else {
            mangas.forEach(manga => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.textContent = manga.Titulo;
                popularMangasContainer.appendChild(item);
            });
        }
    };

    // Função para buscar os mangás mais bem avaliados
    const fetchTopRatedMangas = async () => {
        try {
            const response = await fetch('/api/mangas-mais-bem-avaliados');
            if (response.ok) {
                const mangas = await response.json();
                updateTopRatedMangas(mangas);
            } else {
                console.error('Erro ao buscar os mangás mais bem avaliados:', response.status);
            }
        } catch (error) {
            console.error('Erro ao buscar os mangás mais bem avaliados:', error);
        }
    };

    // Função para renderizar os mangás mais bem avaliados
    const updateTopRatedMangas = (mangas) => {
        const topRatedMangasContainer = document.getElementById('top-rated-mangas');
        topRatedMangasContainer.innerHTML = ''; // Limpa os itens anteriores

        if (mangas.length === 0) {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.textContent = 'Nenhum mangá encontrado.';
            topRatedMangasContainer.appendChild(item);
        } else {
            mangas.forEach(manga => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.textContent = `${manga.Titulo} - Nota: ${manga.Nota}`;
                topRatedMangasContainer.appendChild(item);
            });
        }
    };

    fetchPopularMangas();
    fetchTopRatedMangas();

    // Função para buscar os animes mais recentes
    const fetchRecentAnimes = async () => {
        try {
            const response = await fetch('/api/animes-recentes');
            if (response.ok) {
                const animes = await response.json();
                renderRecentAnimes(animes);
            } else {
                console.error('Erro ao buscar animes recentes:', response.status);
            }
        } catch (error) {
            console.error('Erro ao buscar animes recentes:', error);
        }
    };

    // Função para renderizar os animes mais recentes
    const renderRecentAnimes = (animes) => {
        const recentAnimesContainer = document.getElementById('recent-animes');
        recentAnimesContainer.innerHTML = '';  // Limpa os animes anteriores

        if (animes.length === 0) {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.textContent = 'Nenhum anime recente encontrado.';
            recentAnimesContainer.appendChild(item);
        } else {
            animes.forEach(anime => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.textContent = `${anime.Nome} - Início: ${anime.Start_Aired}`;
                recentAnimesContainer.appendChild(item);
            });
        }
    };

    fetchRecentAnimes();

    // Função para buscar os mangás mais recentes
    const fetchRecentMangas = async () => {
        try {
            const response = await fetch('/api/mangas-recentes');
            if (response.ok) {
                const mangas = await response.json();
                renderRecentMangas(mangas);
            } else {
                console.error('Erro ao buscar mangás recentes:', response.status);
            }
        } catch (error) {
            console.error('Erro ao buscar mangás recentes:', error);
        }
    };

    // Função para renderizar os mangás mais recentes
    const renderRecentMangas = (mangas) => {
        const recentMangasContainer = document.getElementById('recent-mangas');
        recentMangasContainer.innerHTML = '';  // Limpa os mangás anteriores

        if (mangas.length === 0) {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.textContent = 'Nenhum mangá recente encontrado.';
            recentMangasContainer.appendChild(item);
        } else {
            mangas.forEach(manga => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.textContent = `${manga.Titulo} - Ano: ${manga.Ano}`;
                recentMangasContainer.appendChild(item);
            });
        }
    };

    fetchRecentMangas();

});