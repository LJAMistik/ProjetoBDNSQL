document.addEventListener("DOMContentLoaded", function() {
    async function buscarDadosDoUsuario() {
        try {
            let response = await fetch('api/perfil');
            if (response.ok) {
                let dados = await response.json();
                document.getElementById('nome').value = dados.nome;
                document.getElementById('email').value = dados.email;
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(dados.nome)}&background=F00&color=FFF`;
                document.getElementById('avatar').src = avatarUrl;
            } else {
                console.error('Erro ao buscar os dados do usuário: ', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar os dados do usuário: ', error);
        }
    }

    function editarCampo(campo) {
        document.getElementById(campo).disabled = false;
        document.getElementById('salvar-dados').style.display = 'inline-block';
    }

    async function excluirConta() {
        try {
            let response = await fetch('api/excluir', { method: 'DELETE' });
            if (response.ok) {
                alert('Conta excluída com sucesso!');
                window.location.href = '/login';
            } else {
                console.error('Erro ao excluir a conta: ', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao excluir a conta: ', error);
        }
    }

    document.getElementById('editar-nome').addEventListener('click', function() {
        editarCampo('nome');
    });

    document.getElementById('editar-email').addEventListener('click', function() {
        editarCampo('email');
    });

    document.getElementById('excluir-conta').addEventListener('click', excluirConta);

    buscarDadosDoUsuario();
});
