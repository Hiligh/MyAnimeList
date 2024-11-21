document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o botão que abre o modal
    const openModalButton = document.getElementById('btnOpenModal');
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));

    // Ao clicar no botão "Excluir Conta", exibe o modal
    openModalButton.addEventListener('click', function() {
      confirmDeleteModal.show();
    });

    // Seleciona o botão "Excluir Conta" dentro do modal
    const btnDeleteAccount = document.getElementById('btnDeleteAccount');
    
    // Adiciona evento para confirmar a exclusão
    btnDeleteAccount.addEventListener('click', async function() {
      try {
        // Envia uma requisição DELETE para o servidor para excluir a conta
        const response = await fetch('/excluirConta', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Se a resposta for ok, exibe uma mensagem de sucesso e redireciona para a página inicial
          alert('Conta excluída com sucesso!');
          window.location.href = '/'; // Redireciona para a página inicial após exclusão
        } else {
          alert('Erro ao excluir a conta!');
        }
      } catch (error) {
        console.error('Erro ao excluir conta:', error);
        alert('Erro ao excluir conta!');
      }

      // Fecha o modal após a tentativa de exclusão
      confirmDeleteModal.hide();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o botão de editar informações do usuário
    const editButton = document.getElementById('btnEditUserInfo');
    const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));

    // Ao clicar no botão "Editar Informações", exibe o modal
    editButton.addEventListener('click', function() {
        // Pega os valores diretamente dos atributos data-* do elemento
        const userElement = document.getElementById('usernameBtn');
        const nome = userElement.dataset.nome;
        const idade = userElement.dataset.idade;

        // Preenche o formulário com os dados atuais do usuário
        document.getElementById('editName').value = nome;
        document.getElementById('editAge').value = idade;
        // Limpeza da senha, o usuário não deve ver a senha atual
        document.getElementById('editPassword').value = ''; 
        
        // Exibe o modal
        editUserModal.show();
    });

    // Ao clicar no botão "Salvar Alterações", envia os dados alterados
    const saveChangesButton = document.getElementById('saveChangesBtn');
    
    saveChangesButton.addEventListener('click', async function() {
        const nome = document.getElementById('editName').value;
        const idade = document.getElementById('editAge').value;
        const senha = document.getElementById('editPassword').value;

        // Validação dos campos
        if (!nome || !idade || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // Envia os dados para o servidor
            const response = await fetch('/editarConta', {
                method: 'PUT', // Usamos PUT para atualização
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    idade,
                    senha,  // Aqui a senha será atualizada. Caso queira deixar em branco, adicione uma verificação
                }),
            });

            if (response.ok) {
                alert('Informações atualizadas com sucesso!');
                // Fechar o modal após salvar as alterações
                editUserModal.hide();
                // Atualizar as informações no perfil sem precisar recarregar a página
                document.getElementById('usernameBtn').textContent = nome;
                // Atualizar o atributo data-* para refletir a mudança
                document.getElementById('usernameBtn').dataset.nome = nome;
                // Aqui você também pode atualizar outras informações se necessário
            } else {
                alert('Erro ao atualizar as informações.');
            }
        } catch (error) {
            console.error('Erro ao atualizar as informações:', error);
            alert('Erro ao atualizar as informações.');
        }
    });

  // Código relacionado ao link de "Listas Animes"
  const linkListasAnimes = document.getElementById('linkListasAnimes');
  const usuarioElement = document.getElementById('usernameBtn');
  const IDUsuario = usuarioElement.dataset.idusuario;

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

  const linkListasMangas = document.getElementById('linkListasMangas');

  linkListasMangas.addEventListener('click', async function(event) {
      event.preventDefault();  // Evita o comportamento padrão do link
      console.log("conseguiu vir até aqui apertando o botão")
      try {
          // Fazendo a requisição para pegar as listas de mangas
          const response = await fetch(`/usuario/${IDUsuario}/listas-mangas`);

          if (!response.ok) {
              throw new Error('Erro ao carregar as listas de mangas');
          }

          const listasMangas = await response.json();
          console.log(listasMangas); // Você pode checar aqui as listas de mangas

          // Redireciona para a página de listas de mangas, passando o ID do usuário
          window.location.href = `/listas-mangas?usuarioId=${IDUsuario}`;
      } catch (error) {
          console.error('Erro ao carregar as listas de mangas:', error);
      }
  });

});
