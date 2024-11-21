// Variável global para controlar a página atual
let currentPage = 1;
const idusuario = document.body.dataset.idusuario;

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
    resultsDropdown.innerHTML = ''; // Limpa o dropdown antes de popular

    // Se houver Mangás, cria a seção "Mangás"
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
                // Redireciona para a página de detalhes do Mangá, incluindo o idusuario
                window.location.href = `/manga/${manga.IDManga}?idusuario=${idusuario}`;
            });

            resultsDropdown.appendChild(item);
        });
    }

    // Se houver Animes, cria a seção "Animes"
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
                // Redireciona para a página de detalhes do Anime, incluindo o idusuario
                window.location.href = `/anime/${anime.IDAnime}?idusuario=${idusuario}`;
            });
            resultsDropdown.appendChild(item);
        });
    }

    // Se não houver resultados, exibe uma mensagem
    if (mangas.length === 0 && animes.length === 0) {
        const noResults = document.createElement('li');
        noResults.classList.add('dropdown-item');
        noResults.textContent = 'Nenhum resultado encontrado';
        resultsDropdown.appendChild(noResults);
    }

    // Exibe o dropdown com os resultados
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

// Função para buscar os animes e atualizar a página
function carregarAnimes(page = 1) {
    fetch(`/api/catalogoAnimes?page=${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os animes');
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then(animes => {
            // Seleciona o elemento onde os animes serão exibidos
            const container = document.getElementById('anime-container');
            
            // Limpa o conteúdo atual se for a primeira página
            if (page === 1) {
                container.innerHTML = '';
            }

            // Loop para adicionar cada anime no HTML
            animes.forEach(anime => {
                const animeElement = document.createElement('div');
                animeElement.classList.add('anime-item');
                animeElement.innerHTML = `
                    <h2>${anime.nome}</h2>
                    <p><strong>Gênero:</strong> ${anime.genero}</p>
                    <p><strong>Tipo:</strong> ${anime.tipo}</p>
                    <p><strong>Status:</strong> ${anime.status}</p>
                    <p><strong>Nota:</strong> ${anime.nota}</p>
                    <p><strong>Duração:</strong> ${anime.durationMinutes ? anime.durationMinutes + ' minutos' : 'Desconhecida'}</p>
                `;
                container.appendChild(animeElement);
            });

            // Exibe o botão "Ver Mais" após carregar os animes
            const botaoVerMais = document.getElementById('ver-mais');
            botaoVerMais.style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao carregar os animes:', error);
        });
}

// Função para carregar mais animes ao clicar no botão
function carregarMaisAnimes() {
    currentPage++; // Incrementa a página
    carregarAnimes(currentPage); // Carrega os animes da próxima página
}

// Chama a função para carregar a primeira página de animes assim que a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    carregarAnimes(currentPage);

    // Adiciona o evento de clique no botão "Ver Mais"
    document.getElementById('ver-mais').addEventListener('click', carregarMaisAnimes);
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
    event.preventDefault();  // Evita o comportamento padrão do link
    console.log("conseguiu vir até aqui apertando o botão")
    try {
        // Fazendo a requisição para pegar as listas de mangas
        const response = await fetch(`/usuario/${idusuario}/listas-mangas`);

        if (!response.ok) {
            throw new Error('Erro ao carregar as listas de mangas');
        }

        const listasMangas = await response.json();
        console.log(listasMangas); // Você pode checar aqui as listas de mangas

        // Redireciona para a página de listas de mangas, passando o ID do usuário
        window.location.href = `/listas-mangas?usuarioId=${idusuario}`;
    } catch (error) {
        console.error('Erro ao carregar as listas de mangas:', error);
    }
});
