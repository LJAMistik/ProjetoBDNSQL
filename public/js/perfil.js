async function buscarDadosDoUsuario() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token não encontrado');
            alert('Token não encontrado. Faça login novamente.');
            return;
            }
        const response = await fetch(`${urlBase}/usuario`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'access-token': token
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
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token não encontrado');
        alert('Token não encontrado. Faça login novamente.');
        return;
    }

    // Exemplo de uma requisição utilizando fetch com o header 'access-token'
    try {
        const response = await fetch('/sua-url-endpoint', {
            method: 'PUT', // ou 'POST', 'GET', etc., dependendo do seu caso
            headers: {
                'Content-Type': 'application/json',
                'access-token': token
            },
            body: JSON.stringify({ campo: campo })
        });

        if (!response.ok) {
            throw new Error('Erro ao editar o campo');
        }

        // Sucesso na requisição
        const data = await response.json();
        console.log('Campo editado com sucesso:', data);

        document.getElementById(campo).disabled = false;
        document.getElementById('salvar-dados').style.display = 'inline-block';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao editar o campo. Tente novamente.');
    }
}

async function excluirConta() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token não encontrado');
        alert('Token não encontrado. Faça login novamente.');
        return;
    }

    try {
        let response = await fetch('api/excluir', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'access-token': token
            }
        });

        if (response.ok) {
            alert('Conta excluída com sucesso!');
            window.location.href = '/login';
        } else {
            console.error('Erro ao excluir a conta:', response.statusText);
            alert('Erro ao excluir a conta. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao excluir a conta:', error);
        alert('Erro ao excluir a conta. Tente novamente.');
    }
}


document.getElementById('editar-nome').addEventListener('click', function() {
    editarCampo('nome');
});

document.getElementById('editar-email').addEventListener('click', function() {
    editarCampo('email');
});

document.getElementById('excluir-conta').addEventListener('click', excluirConta);

