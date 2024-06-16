async function buscarDadosDoUsuario() {
    try {
        const response = await fetch(`${urlBase}/usuario`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados do usuário: ' + response.statusText);
        }
        const usuario = await response.json();
        
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=F00&color=FFF`;
        document.getElementById('avatar').src = avatarUrl;
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('email').value = usuario.email;
        
    } catch (error) {
        console.error('Erro ao buscar os dados do usuário: ', error);
    }
}

async function editarCampo(campo) {
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

