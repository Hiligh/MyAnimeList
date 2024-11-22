document.addEventListener('DOMContentLoaded', function() {

    const openModalButton = document.getElementById('btnOpenModal');
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));

    openModalButton.addEventListener('click', function() {
      confirmDeleteModal.show();
    });

    const btnDeleteAccount = document.getElementById('btnDeleteAccount');

    btnDeleteAccount.addEventListener('click', async function() {
      try {
        const response = await fetch('/excluirConta', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Conta excluída com sucesso!');
          window.location.href = '/';
        } else {
          alert('Erro ao excluir a conta!');
        }
      } catch (error) {
        console.error('Erro ao excluir conta:', error);
        alert('Erro ao excluir conta!');
      }

      confirmDeleteModal.hide();
    });
});

document.addEventListener('DOMContentLoaded', function() {

    const editButton = document.getElementById('btnEditUserInfo');
    const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));

    editButton.addEventListener('click', function() {
        const userElement = document.getElementById('usernameBtn');
        const nome = userElement.dataset.nome;
        const idade = userElement.dataset.idade;
        document.getElementById('editName').value = nome;
        document.getElementById('editAge').value = idade;
        document.getElementById('editPassword').value = ''; 

        editUserModal.show();
    });

    const saveChangesButton = document.getElementById('saveChangesBtn');
    
    saveChangesButton.addEventListener('click', async function() {
        const nome = document.getElementById('editName').value;
        const idade = document.getElementById('editAge').value;
        const senha = document.getElementById('editPassword').value;

        if (!nome || !idade || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch('/editarConta', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    idade,
                    senha,
                }),
            });

            if (response.ok) {
                alert('Informações atualizadas com sucesso!');
                editUserModal.hide();
                document.getElementById('usernameBtn').textContent = nome;
                document.getElementById('usernameBtn').dataset.nome = nome;
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
      event.preventDefault();
      console.log("conseguiu vir até aqui apertando o botão")
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
