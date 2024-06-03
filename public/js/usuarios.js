// ########################### FUNÇÃO PARA CONFERIR SE AS SENHAS A SEREM CRIADAS BATEM ################################    

function validarFormularioCadastro() {
    var senha = document.getElementById("senha").value;
    var confirmaSenha = document.getElementById("confirma-senha").value;
  
    if (senha !== confirmaSenha) {
        alert("As senhas não coincidem. Por favor, tente novamente.");
        return false;
    }
    return true;
}

// ########################### FUNÇÃO PARA O CADASTRO DE USUARIO ################################    

document.addEventListener('DOMContentLoaded', function() {
    const urlBase = window.location.href.replace(/\/[^\/]*$/, '') + '/api';

    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); //evita o recarregamento

        //obtendo os dados do formulário
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        //criando o objeto de inclusão
        const dadosUsuario = { nome: nome, email: email, senha: senha };

        //Efetuar o POST para o endpoint
        fetch(`${urlBase}/usuarios`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosUsuario)
        })
            .then(response => response.json())
            .then(data => {
                //Verifica se o usuário foi cadastrado
                if (data.acknowledged) { //se true, inseriu!
                    alert("Usuário criado com sucesso! Por favor, efetue o login.");
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 5000);
                } else if (data.errors) {
                    //vamos pegar os erros da API
                    const errorMessages = data.errors.map(error => error.msg).join('\n');
                    //Mostrar os erros em um alerta
                    alert("Erro ao criar usuário:\n" + errorMessages);
                }
            });
    });
});
