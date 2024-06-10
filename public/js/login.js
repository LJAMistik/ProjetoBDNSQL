// ########################### FUNÇÃO PARA ENVIAR OS DADOS DO FORMULARIO DE LOGIN ################################

const urlBase = window.location.href.replace(/\/[^\/]*$/, '') + '/api';

function showModalMessage(message, isError = false) {
    const mensagemElem = document.getElementById('mensagem');
    mensagemElem.innerHTML = `<span class='${isError ? 'text-danger' : ''}'>${message}</span>`;
    const msgModal = new bootstrap.Modal(document.getElementById('modalMensagem'));
    msgModal.show();
}

document.getElementById('formulario-login').addEventListener('submit', function(event) {
    event.preventDefault();

    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    const dadosLogin = {
        email: login,
        senha: senha
    };

    fetch(`${urlBase}/usuarios/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosLogin)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 200) {
            localStorage.setItem('token', body.access_token);
            window.location.href = 'menu.html';
        } else {
            const errorMessages = body.errors.map(error => error.msg).join('<br>');
            showModalMessage(errorMessages, true);
        }
    })
    .catch(error => {
        showModalMessage('Ocorreu um erro ao processar sua solicitação.', true);
        console.error('Erro:', error);
    });
});
