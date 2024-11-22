const idusuario = document.body.dataset.idusuario;

document.addEventListener('DOMContentLoaded', function() {
    let offset = 0;
    const limit = 30;
    
    const searchInput = document.getElementById('search-item');
    const resultsDropdown = document.getElementById('search-results-dropdown');

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

    // Função para carregar os mangás
    function carregarMangas() {
        fetch(`/api/catalogoMangas?offset=${offset}`)
            .then(response => response.json())
            .then(mangas => {
                mangas.forEach(manga => {
                    const mangaItem = `
                        <div class="manga-item">
                            <h2>${manga.Titulo}</h2>
                            <p>${manga.Descricao ? manga.Descricao.slice(0, 100) + '...' : 'Sem descrição disponível'}</p>
                            <p><strong>Ano:</strong> ${manga.Ano}</p>
                            <p><strong>Gêneros:</strong> ${manga.Genero}</p>
                            <p><strong>Nota:</strong> ${manga.Nota ? manga.Nota : 'Não avaliado'}</p>
                        </div>
                    `;
                    document.getElementById('manga-container').insertAdjacentHTML('beforeend', mangaItem);
                });
                offset += limit;

                if (mangas.length < limit) {
                    document.getElementById('ver-mais').style.display = 'none';
                } else {
                    document.getElementById('ver-mais').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar mangás:', error);
                alert('Erro ao carregar mangás. Tente novamente.');
            });
    }

    carregarMangas();

    document.getElementById('ver-mais').addEventListener('click', function() {
        carregarMangas();
    });
  });

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
  